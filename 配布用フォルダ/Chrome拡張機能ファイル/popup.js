// グローバル変数
let formData = null;
let apiUrl = '';

// 初期化
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Google Form Generator 起動');
  
  // 保存済みの設定を読み込む
  const result = await chrome.storage.local.get(['apiUrl']);
  if (result.apiUrl) {
    apiUrl = result.apiUrl;
    document.getElementById('apiUrl').value = apiUrl;
    console.log('保存済みURL読み込み完了');
    // URLが設定済みの場合は折りたたみ表示にする
    toggleUrlSection(true);
  }
  
  setupEventListeners();
});

// イベントリスナーの設定
function setupEventListeners() {
  document.getElementById('saveSettings').addEventListener('click', saveSettings);
  document.getElementById('fileInput').addEventListener('change', handleFileSelect);
  document.getElementById('createForm').addEventListener('click', createForm);
  
  // URL編集ボタンのイベントリスナー（存在する場合のみ）
  const toggleButton = document.getElementById('toggleUrlEdit');
  if (toggleButton) {
    toggleButton.addEventListener('click', toggleUrlEdit);
  }
}

// URL設定セクションの表示切り替え
function toggleUrlSection(isCollapsed) {
  const urlInput = document.getElementById('apiUrl');
  const saveButton = document.getElementById('saveSettings');
  const urlEditButton = document.getElementById('toggleUrlEdit');
  const helpText = document.querySelector('#settingsSection .help-text');
  const urlDisplay = document.getElementById('urlDisplay');
  
  if (isCollapsed) {
    // 折りたたみ表示（URLが設定済み状態）
    urlInput.style.display = 'none';
    saveButton.style.display = 'none';
    helpText.style.display = 'none';
    urlDisplay.style.display = 'block';
    urlEditButton.style.display = 'block';
    urlDisplay.innerHTML = `
      <div class="url-display-content">
        <span class="url-label">✅ Apps Script URL設定済み</span>
        <span class="url-preview">${apiUrl.substring(0, 50)}...</span>
      </div>
    `;
  } else {
    // 編集表示
    urlInput.style.display = 'block';
    saveButton.style.display = 'block';
    helpText.style.display = 'block';
    urlDisplay.style.display = 'none';
    urlEditButton.style.display = 'none';
  }
}

// URL編集モードの切り替え
function toggleUrlEdit() {
  toggleUrlSection(false);
  // 入力フィールドにフォーカス
  setTimeout(() => {
    document.getElementById('apiUrl').focus();
  }, 100);
}

// 設定を保存
async function saveSettings() {
  const url = document.getElementById('apiUrl').value.trim();
  
  if (!url) {
    showError('URLを入力してください');
    return;
  }
  
  if (!url.startsWith('https://script.google.com/macros/s/')) {
    showError('正しいGoogle Apps Script URLを入力してください\nURLは "https://script.google.com/macros/s/" で始まる必要があります');
    return;
  }
  
  if (!url.endsWith('/exec')) {
    showError('URLの末尾が "/exec" で終わっていることを確認してください');
    return;
  }
  
  apiUrl = url;
  await chrome.storage.local.set({ apiUrl: url });
  showStatus('✅ 設定を保存しました', 'success');
  console.log('URL保存:', url);
  
  // 保存後に折りたたみ表示に切り替え
  toggleUrlSection(true);
}

// ファイル選択処理
function handleFileSelect(event) {
  const file = event.target.files[0];
  
  if (!file) {
    return;
  }
  
  console.log('ファイル選択:', file.name);
  
  if (!file.name.endsWith('.json')) {
    showError('JSONファイルを選択してください（拡張子が .json のファイル）');
    return;
  }
  
  const reader = new FileReader();
  
  reader.onload = (e) => {
    try {
      formData = JSON.parse(e.target.result);
      console.log('JSON解析成功:', formData);
      
      validateFormData(formData);
      displayFileInfo(file, formData);
      displayPreview(formData);
      document.getElementById('createForm').disabled = false;
      hideError();
      
      showStatus('✅ ファイルを読み込みました', 'success');
    } catch (error) {
      console.error('ファイル読み込みエラー:', error);
      showError(`ファイル読み込みエラー:\n${error.message}\n\nJSONファイルの形式を確認してください`);
      formData = null;
      document.getElementById('createForm').disabled = true;
    }
  };
  
  reader.onerror = () => {
    showError('ファイルの読み込みに失敗しました');
  };
  
  reader.readAsText(file);
}

// フォームデータのバリデーション
function validateFormData(data) {
  if (!data.formTitle) {
    throw new Error('formTitle（フォームタイトル）が必要です');
  }
  
  if (!data.questions || !Array.isArray(data.questions)) {
    throw new Error('questions（質問の配列）が必要です');
  }
  
  if (data.questions.length === 0) {
    throw new Error('少なくとも1つの質問が必要です');
  }
  
  // 対応する質問タイプ
  const validTypes = [
    'short_answer', 'paragraph', 'multiple_choice', 'checkbox',
    'dropdown', 'linear_scale', 'date', 'time', 'grid', 'checkbox_grid'
  ];
  
  // 各質問の検証
  data.questions.forEach((q, index) => {
    if (!q.type) {
      throw new Error(`質問${index + 1}: type（質問タイプ）が必要です`);
    }
    if (!validTypes.includes(q.type)) {
      throw new Error(`質問${index + 1}: 無効な質問タイプ "${q.type}"\n対応タイプ: ${validTypes.join(', ')}`);
    }
    if (!q.title) {
      throw new Error(`質問${index + 1}: title（質問文）が必要です`);
    }
    
    // 選択肢が必要なタイプの検証
    if (['multiple_choice', 'checkbox', 'dropdown'].includes(q.type)) {
      if (!q.options || !Array.isArray(q.options) || q.options.length === 0) {
        throw new Error(`質問${index + 1}: options（選択肢の配列）が必要です`);
      }
    }
    
    // スケールタイプの検証
    if (q.type === 'linear_scale') {
      if (!q.scale || !q.scale.min || !q.scale.max) {
        throw new Error(`質問${index + 1}: scale.min と scale.max が必要です`);
      }
    }
    
    // グリッドタイプの検証
    if (['grid', 'checkbox_grid'].includes(q.type)) {
      if (!q.rows || !Array.isArray(q.rows) || q.rows.length === 0) {
        throw new Error(`質問${index + 1}: rows（行の配列）が必要です`);
      }
      if (!q.columns || !Array.isArray(q.columns) || q.columns.length === 0) {
        throw new Error(`質問${index + 1}: columns（列の配列）が必要です`);
      }
    }
  });
  
  console.log('バリデーション成功');
}

// ファイル情報を表示
function displayFileInfo(file, data) {
  const info = document.getElementById('fileInfo');
  info.innerHTML = `
    <strong>📄 ${file.name}</strong> (${(file.size / 1024).toFixed(2)} KB)<br>
    <strong>📝 フォームタイトル:</strong> ${data.formTitle}<br>
    <strong>❓ 質問数:</strong> ${data.questions.length}問
  `;
  info.style.display = 'block';
}

// プレビューを表示
function displayPreview(data) {
  const preview = document.getElementById('preview');
  const previewSection = document.getElementById('previewSection');
  
  let html = `
    <div class="preview-title">${data.formTitle}</div>
    ${data.formDescription ? `<div class="preview-description">${data.formDescription}</div>` : ''}
    <div class="preview-questions">
  `;
  
  data.questions.forEach((q, index) => {
    html += `
      <div class="preview-question">
        <div class="question-number">質問 ${index + 1}</div>
        <div class="question-title">
          ${q.title}
          ${q.required ? '<span class="required">*</span>' : ''}
        </div>
        ${q.description ? `<div class="question-description">${q.description}</div>` : ''}
        <div class="question-type">${getTypeLabel(q.type)}</div>
      </div>
    `;
  });
  
  html += '</div>';
  preview.innerHTML = html;
  previewSection.style.display = 'block';
}

// 質問タイプのラベル（日本語）
function getTypeLabel(type) {
  const labels = {
    'short_answer': '記述式（短文）',
    'paragraph': '段落（長文）',
    'multiple_choice': 'ラジオボタン（単一選択）',
    'checkbox': 'チェックボックス（複数選択）',
    'dropdown': 'プルダウン',
    'linear_scale': '均等目盛（評価）',
    'date': '日付',
    'time': '時刻',
    'grid': '選択式グリッド',
    'checkbox_grid': 'チェックボックスグリッド'
  };
  return labels[type] || type;
}

// フォームを作成
async function createForm() {
  console.log('フォーム作成開始');
  
  if (!apiUrl) {
    showError('Apps Script URLを設定してください');
    return;
  }
  
  if (!formData) {
    showError('JSONファイルを選択してください');
    return;
  }
  
  // ボタンを無効化
  const button = document.getElementById('createForm');
  const originalText = button.innerHTML;
  button.disabled = true;
  button.innerHTML = '<span class="loading"></span> 作成中...';
  
  showStatus('📤 フォームを作成しています...', 'info');
  hideError();
  hideResult();
  
  try {
    console.log('API呼び出し:', apiUrl);
    console.log('送信データ:', formData);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    console.log('リクエスト送信完了');
    
    // 少し待ってから成功メッセージを表示
    setTimeout(() => {
      showStatus('✅ フォーム作成リクエストを送信しました！\nGoogle Driveを確認してください', 'success');
      showResult('作成完了');
    }, 2000);
    
  } catch (error) {
    console.error('作成エラー:', error);
    showError(`作成エラー:\n${error.message}\n\nURLの設定を確認してください`);
    showStatus('', '');
  } finally {
    button.disabled = false;
    button.innerHTML = originalText;
  }
}

// 結果を表示
function showResult(message) {
  const result = document.getElementById('result');
  const resultSection = document.getElementById('resultSection');
  
  result.innerHTML = `
    <p>フォーム作成リクエストを送信しました！</p>
    <p style="margin-top: 10px; font-size: 14px; color: #666;">
      Google Driveを開いて、作成されたフォームを確認してください。<br>
      数秒後に表示されます。
    </p>
    <a href="https://drive.google.com/drive/my-drive" target="_blank" class="form-link">
      📁 Google Driveを開く
    </a>
  `;
  resultSection.style.display = 'block';
}

// エラー表示
function showError(message) {
  const error = document.getElementById('error');
  const errorSection = document.getElementById('errorSection');
  error.textContent = message;
  errorSection.style.display = 'block';
  console.error('エラー:', message);
}

function hideError() {
  document.getElementById('errorSection').style.display = 'none';
}

// 結果を非表示
function hideResult() {
  document.getElementById('resultSection').style.display = 'none';
}

// ステータス表示
function showStatus(message, type) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = `status ${type}`;
  
  if (message && type === 'success') {
    setTimeout(() => {
      status.textContent = '';
      status.className = 'status';
    }, 5000);
  }
}
