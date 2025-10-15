/**
 * Googleフォーム自動作成ツール
 * バージョン: 1.0
 */

/**
 * Webアプリとして公開するメイン関数
 * Chrome拡張機能からのPOSTリクエストを受け取る
 */
function doPost(e) {
  try {
    // リクエストボディからJSONデータを取得
    const data = JSON.parse(e.postData.contents);
    
    // Googleフォームを作成
    const formUrl = createGoogleForm(data);
    
    // 成功レスポンスを返す
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        url: formUrl,
        message: 'フォームを作成しました'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // エラーレスポンスを返す
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString(),
        message: 'フォームの作成に失敗しました'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Googleフォームを作成するメイン関数
 */
function createGoogleForm(data) {
  // 1. フォームを作成
  const form = FormApp.create(data.formTitle);
  
  // 2. 説明文を設定（もしあれば）
  if (data.formDescription) {
    form.setDescription(data.formDescription);
  }
  
  // 3. フォームの設定を適用（もしあれば）
  if (data.settings) {
    applyFormSettings(form, data.settings);
  }
  
  // 4. 質問を追加
  data.questions.forEach((question, index) => {
    try {
      addQuestion(form, question);
    } catch (error) {
      throw new Error(`質問${index + 1}の作成エラー: ${error.message}`);
    }
  });
  
  // 5. フォームのURLを返す
  return form.getPublishedUrl();
}

/**
 * フォームの設定を適用
 */
function applyFormSettings(form, settings) {
  // メールアドレスの収集
  if (settings.collectEmail !== undefined) {
    form.setCollectEmail(settings.collectEmail);
  }
  
  // 回答の編集を許可
  if (settings.allowResponseEditing !== undefined) {
    form.setAllowResponseEdits(settings.allowResponseEditing);
  }
  
  // 質問の順序をシャッフル
  if (settings.shuffleQuestions !== undefined) {
    form.setShuffleQuestions(settings.shuffleQuestions);
  }
  
  // テストモードに設定
  if (settings.isQuiz !== undefined) {
    form.setIsQuiz(settings.isQuiz);
  }
  
  // 「別の回答を送信」リンクを表示
  if (settings.showLinkToRespondAgain !== undefined) {
    form.setShowLinkToRespondAgain(settings.showLinkToRespondAgain);
  }
}

/**
 * 質問をフォームに追加（タイプ別）
 */
function addQuestion(form, question) {
  let item;
  
  switch (question.type) {
    // 記述式（短文回答）
    case 'short_answer':
      item = form.addTextItem();
      item.setTitle(question.title);
      if (question.description) {
        item.setHelpText(question.description);
      }
      if (question.required) {
        item.setRequired(true);
      }
      break;
      
    // 段落（長文回答）
    case 'paragraph':
      item = form.addParagraphTextItem();
      item.setTitle(question.title);
      if (question.description) {
        item.setHelpText(question.description);
      }
      if (question.required) {
        item.setRequired(true);
      }
      break;
      
    // ラジオボタン（単一選択）
    case 'multiple_choice':
      item = form.addMultipleChoiceItem();
      item.setTitle(question.title);
      if (question.description) {
        item.setHelpText(question.description);
      }
      if (question.required) {
        item.setRequired(true);
      }
      
      // 選択肢を作成
      const mcChoices = question.options.map(opt => item.createChoice(opt));
      item.setChoices(mcChoices);
      
      // 「その他」オプション
      if (question.hasOther) {
        item.showOtherOption(true);
      }
      break;
      
    // チェックボックス（複数選択）
    case 'checkbox':
      item = form.addCheckboxItem();
      item.setTitle(question.title);
      if (question.description) {
        item.setHelpText(question.description);
      }
      if (question.required) {
        item.setRequired(true);
      }
      
      // 選択肢を作成
      const cbChoices = question.options.map(opt => item.createChoice(opt));
      item.setChoices(cbChoices);
      
      // 「その他」オプション
      if (question.hasOther) {
        item.showOtherOption(true);
      }
      break;
      
    // プルダウン（ドロップダウンリスト）
    case 'dropdown':
      item = form.addListItem();
      item.setTitle(question.title);
      if (question.description) {
        item.setHelpText(question.description);
      }
      if (question.required) {
        item.setRequired(true);
      }
      
      // 選択肢を作成
      const ddChoices = question.options.map(opt => item.createChoice(opt));
      item.setChoices(ddChoices);
      break;
      
    // 均等目盛（リッカート尺度）
    case 'linear_scale':
      item = form.addScaleItem();
      item.setTitle(question.title);
      if (question.description) {
        item.setHelpText(question.description);
      }
      if (question.required) {
        item.setRequired(true);
      }
      
      // スケールの範囲を設定
      item.setBounds(
        question.scale.min || 1,
        question.scale.max || 5
      );
      
      // ラベルを設定
      if (question.scale.minLabel && question.scale.maxLabel) {
        item.setLabels(question.scale.minLabel, question.scale.maxLabel);
      }
      break;
      
    // 日付
    case 'date':
      item = form.addDateItem();
      item.setTitle(question.title);
      if (question.description) {
        item.setHelpText(question.description);
      }
      if (question.required) {
        item.setRequired(true);
      }
      
      // 年を含めるかどうか
      if (question.includeYear === false) {
        item.setIncludesYear(false);
      }
      break;
      
    // 時刻
    case 'time':
      item = form.addTimeItem();
      item.setTitle(question.title);
      if (question.description) {
        item.setHelpText(question.description);
      }
      if (question.required) {
        item.setRequired(true);
      }
      break;
      
    // 選択式グリッド（マトリックス）
    case 'grid':
      item = form.addGridItem();
      item.setTitle(question.title);
      if (question.description) {
        item.setHelpText(question.description);
      }
      if (question.required) {
        item.setRequired(true);
      }
      
      // 行と列を設定
      item.setRows(question.rows);
      item.setColumns(question.columns);
      break;
      
    // チェックボックスグリッド
    case 'checkbox_grid':
      item = form.addCheckboxGridItem();
      item.setTitle(question.title);
      if (question.description) {
        item.setHelpText(question.description);
      }
      if (question.required) {
        item.setRequired(true);
      }
      
      // 行と列を設定
      item.setRows(question.rows);
      item.setColumns(question.columns);
      break;
      
    default:
      throw new Error(`未対応の質問タイプ: ${question.type}`);
  }
}

/**
 * テスト用関数
 * この関数を実行すると、サンプルフォームが作成されます
 */
function testCreateForm() {
  const testData = {
    "formTitle": "テストフォーム - 自動作成",
    "formDescription": "このフォームは自動作成ツールのテストです",
    "settings": {
      "collectEmail": false,
      "allowResponseEditing": true
    },
    "questions": [
      {
        "id": "q1",
        "type": "short_answer",
        "title": "お名前を教えてください",
        "description": "フルネームで入力してください",
        "required": true
      },
      {
        "id": "q2",
        "type": "multiple_choice",
        "title": "年齢層を選択してください",
        "required": true,
        "options": ["10代", "20代", "30代", "40代", "50代以上"]
      },
      {
        "id": "q3",
        "type": "checkbox",
        "title": "興味のある分野を選んでください（複数選択可）",
        "required": false,
        "options": ["テクノロジー", "ビジネス", "デザイン", "教育", "その他"]
      },
      {
        "id": "q4",
        "type": "linear_scale",
        "title": "満足度を教えてください",
        "required": true,
        "scale": {
          "min": 1,
          "max": 5,
          "minLabel": "不満",
          "maxLabel": "満足"
        }
      }
    ]
  };
  
  try {
    const url = createGoogleForm(testData);
    Logger.log('✅ フォーム作成成功！');
    Logger.log('URL: ' + url);
    return url;
  } catch (error) {
    Logger.log('❌ エラー: ' + error.toString());
    throw error;
  }
}
