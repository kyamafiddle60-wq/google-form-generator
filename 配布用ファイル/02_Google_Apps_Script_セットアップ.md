# 🔧 Google Apps Script セットアップガイド

## 📋 概要

このガイドでは、Google Apps Scriptをセットアップして、Chrome拡張機能から呼び出せるようにします。

**所要時間**: 約15分

---

## 🎯 セットアップの流れ

1. Google Apps Scriptを開く
2. プロジェクトを作成
3. コードを貼り付け
4. テスト実行
5. デプロイ
6. URLを取得

---

## ステップ1: Google Apps Scriptを開く

### 1-1. ブラウザでアクセス

1. Google Chromeを開く
2. 以下のURLをコピーして、アドレスバーに貼り付けてEnterキーを押す

```
https://script.google.com/home
```

3. Googleアカウントでログインしていない場合は、ログインする

### 1-2. 画面の確認

- 「マイ プロジェクト」という画面が表示されればOKです
- 初めての場合は何も表示されていないかもしれませんが、問題ありません

---

## ステップ2: 新しいプロジェクトを作成

### 2-1. プロジェクトを作成

1. 画面左上の **「新しいプロジェクト」** ボタンをクリック
   - 青い「＋」マークのボタンです
   
2. 新しいタブで、コードエディタ画面が開きます

### 2-2. プロジェクト名を変更（推奨）

1. 画面左上の「無題のプロジェクト」をクリック
2. 「Googleフォーム自動作成」と入力
3. 「OK」をクリック

---

## ステップ3: コードを貼り付ける

### 3-1. 既存のコードを削除

1. エディタに以下のようなコードが表示されています：

```javascript
function myFunction() {

}
```

2. このコードを**すべて選択**して削除します
   - `Ctrl + A`（Mac: `Command + A`）で全選択
   - `Delete`キーで削除

### 3-2. 新しいコードを貼り付け

1. 以下のコードを**すべてコピー**します
2. エディタに**貼り付け**ます（`Ctrl + V` または Mac: `Command + V`）

```javascript
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
```

3. コードが貼り付けられたら、**保存**します
   - `Ctrl + S`（Mac: `Command + S`）
   - または画面上部の「💾（保存）」アイコンをクリック

---

## ステップ4: 動作テスト（重要！）

コードが正しく動作するか確認します。

### 4-1. テスト関数を実行

1. 画面上部の関数選択ドロップダウン（「myFunction」と表示されている部分）をクリック
2. **「testCreateForm」** を選択
3. 右側の **「▶実行」** ボタンをクリック

### 4-2. 権限の承認（初回のみ）

初めて実行する時は、権限の確認画面が表示されます：

1. **「権限を確認」** ボタンをクリック
2. Googleアカウントを選択
3. **「詳細」** をクリック（警告画面が出た場合）
4. **「Googleフォーム自動作成（安全ではないページ）に移動」** をクリック
   - 「安全ではない」と表示されますが、自分で作成したスクリプトなので問題ありません
5. **「許可」** ボタンをクリック

### 4-3. 実行結果を確認

1. 実行が完了するまで数秒待ちます
2. 画面下部の「実行ログ」をクリック
3. 以下のようなログが表示されればOKです：

```
✅ フォーム作成成功！
URL: https://docs.google.com/forms/d/xxxxx/edit
```

4. このURLをクリックすると、実際に作成されたテストフォームが開きます
   - フォームが表示されれば、正常に動作しています！

### 4-4. エラーが出た場合

エラーメッセージが表示された場合：
1. コードが正しく貼り付けられているか確認
2. コピー&ペーストを最初からやり直す
3. それでもエラーが出る場合は、エラーメッセージをメモしておく

---

## ステップ5: Webアプリとして公開

### 5-1. デプロイを開始

1. 画面右上の **「デプロイ」** ボタンをクリック
2. **「新しいデプロイ」** を選択

### 5-2. デプロイの設定

1. 左側の「⚙️（設定）」アイコンをクリック
2. **「種類の選択」** から **「ウェブアプリ」** を選択

3. 以下の設定を行います：

```
📝 説明（オプション）: Googleフォーム自動作成API

👤 次のユーザーとして実行:
   → 「自分」を選択

🌐 アクセスできるユーザー:
   → 「全員」を選択（重要！）
```

4. **「デプロイ」** ボタンをクリック

### 5-3. URLをコピー

1. **「ウェブアプリ」** の下に表示されるURLをコピーします
   ```
   https://script.google.com/macros/s/AKfycbxxx.../exec
   ```
2. このURLは後で使うので、メモ帳などに保存しておいてください
3. **「完了」** ボタンをクリック

---

## ✅ 完了！

これでGoogle Apps Scriptの準備は完了です。

**重要**: コピーしたURLを安全な場所に保存してください。Chrome拡張機能の設定で使用します。

---

## ❓ トラブルシューティング

### 問題1: 権限エラーが出る

**症状**: 「権限が不足しています」と表示される

**解決法**:
1. 権限の確認画面で「許可」をクリック
2. それでもエラーが出る場合は、Googleアカウントでログインし直す

### 問題2: コードが貼り付けられない

**症状**: コードが正しく貼り付けられない

**解決法**:
1. 既存のコードをすべて削除
2. 一度にすべてのコードをコピー&ペースト
3. 保存を忘れずに

### 問題3: テスト関数が実行できない

**症状**: 「実行」ボタンが押せない

**解決法**:
1. 関数選択で「testCreateForm」が選択されているか確認
2. コードが保存されているか確認
3. ブラウザをリフレッシュ

### 問題4: URLが表示されない

**症状**: テスト関数を実行してもURLが表示されない

**解決法**:
- これは正常な動作です
- フォームはGoogle Driveに作成されています
- デプロイに進んでください

---

## 📞 サポート

問題が解決しない場合：

1. **エラーメッセージを確認**
2. **Google Apps Scriptのログを確認**
3. **ブラウザをリフレッシュして再試行**

---

**次のステップ**: `03_Chrome拡張機能_インストール.md` を参照してください。

---

**バージョン**: 1.0  
**最終更新**: 2025年10月15日
