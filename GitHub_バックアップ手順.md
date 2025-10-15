# 📦 GitHubバックアップ手順

## ✅ 完了済み

以下の作業は既に完了しています：

- ✅ Gitリポジトリの初期化
- ✅ .gitignoreファイルの作成
- ✅ 全ファイルのコミット（15ファイル、6211行）
- ✅ コミットメッセージ：「Googleフォーム自動作成ツール v1.0」

---

## 🚀 GitHubへのアップロード手順

### ステップ1: GitHubにログイン

1. https://github.com/ にアクセス
2. ログイン（アカウントがない場合は新規作成）

---

### ステップ2: 新しいリポジトリを作成

1. 右上の「+」マークをクリック
2. 「New repository」を選択

3. 以下の情報を入力：

```
Repository name: google-form-generator
（または任意の名前）

Description: 
ChatGPTで生成したJSONファイルから、Googleフォームを自動作成するChrome拡張機能

Public / Private: 
お好みで選択（Publicを推奨）

Initialize this repository with:
□ Add a README file ← チェックしない（既にREADME.mdがあるため）
□ Add .gitignore ← チェックしない（既に.gitignoreがあるため）
□ Choose a license ← お好みで（MIT推奨）
```

4. 「Create repository」をクリック

---

### ステップ3: リモートリポジトリを追加

GitHubでリポジトリが作成されると、以下のような画面が表示されます。

**「…or push an existing repository from the command line」**というセクションに表示されているコマンドを使用します。

#### Macの場合：

1. ターミナルを開く（アプリケーション → ユーティリティ → ターミナル）

2. 以下のコマンドを順番に実行：

```bash
cd "/Users/yamamotokiichirou/Desktop/googleフォーマット"

# リモートリポジトリを追加（URLは自分のものに変更）
git remote add origin https://github.com/あなたのユーザー名/google-form-generator.git

# ブランチ名をmainに変更（既にmainの場合は不要）
git branch -M main

# GitHubにプッシュ
git push -u origin main
```

**重要**: `https://github.com/あなたのユーザー名/google-form-generator.git` の部分は、
GitHubの画面に表示されている実際のURLに置き換えてください。

---

### ステップ4: 認証

初めてプッシュする場合、認証が必要です。

#### 方法A: Personal Access Token（推奨）

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 「Generate new token」→「Generate new token (classic)」
3. Note: 「google-form-generator」
4. Expiration: 「No expiration」または任意の期間
5. Select scopes: 「repo」にチェック
6. 「Generate token」をクリック
7. 表示されたトークンをコピー（一度しか表示されません！）
8. ターミナルでプッシュ時、パスワードの代わりにトークンを入力

#### 方法B: GitHub CLI（簡単）

```bash
# GitHub CLIのインストール（Homebrewがある場合）
brew install gh

# 認証
gh auth login

# プッシュ
git push -u origin main
```

---

### ステップ5: 確認

1. GitHubのリポジトリページをリフレッシュ
2. 以下のファイルが表示されていればOKです：

```
✅ README.md
✅ 要件定義書.md
✅ 実装計画.md
✅ 初心者向けセットアップガイド.md
✅ ChatGPT用プロンプト.md
✅ sample-survey.json
✅ google-form-generator/
   ✅ manifest.json
   ✅ popup.html
   ✅ popup.js
   ✅ Code.gs
✅ その他のドキュメント
```

---

## 🔄 今後の更新方法

ファイルを変更した後、以下のコマンドで更新をGitHubに反映できます：

```bash
cd "/Users/yamamotokiichirou/Desktop/googleフォーマット"

# 変更を確認
git status

# 変更をステージング
git add .

# コミット
git commit -m "更新内容の説明"

# GitHubにプッシュ
git push
```

---

## 📝 コミットメッセージの例

```bash
# 機能追加
git commit -m "feat: 新しいテンプレート機能を追加"

# バグ修正
git commit -m "fix: プレビュー表示のバグを修正"

# ドキュメント更新
git commit -m "docs: セットアップガイドを更新"

# リファクタリング
git commit -m "refactor: コードを整理"
```

---

## 🌟 GitHubリポジトリの設定（推奨）

### 1. リポジトリの説明を追加

GitHub上で：
1. リポジトリページの「About」の⚙️をクリック
2. Description: 「ChatGPTと連携してGoogleフォームを自動作成するChrome拡張機能」
3. Topics: `google-forms`, `chrome-extension`, `automation`, `chatgpt`, `javascript`
4. 「Save changes」

### 2. README.mdをプレビュー

GitHubのリポジトリページでREADME.mdが自動的に表示されます。

### 3. ライセンスの追加（推奨）

1. リポジトリページで「Add file」→「Create new file」
2. ファイル名: `LICENSE`
3. 「Choose a license template」をクリック
4. 「MIT License」を選択（推奨）
5. 「Review and submit」→「Commit new file」

---

## 🔒 プライベートリポジトリの場合

プライベートリポジトリを選択した場合：

**メリット:**
- コードが他人に見られない
- Apps Script URLなどの機密情報を含められる

**デメリット:**
- 他の人と共有できない
- オープンソースとして公開できない

---

## 📊 GitHubでの表示

リポジトリが正しくアップロードされると：

✅ プロジェクト構造が一目で分かる
✅ README.mdが自動的に表示される
✅ ファイルごとの履歴が確認できる
✅ 他のデバイスからクローンできる

---

## 💾 他のデバイスでの使用

別のPCで使用する場合：

```bash
# リポジトリをクローン
git clone https://github.com/あなたのユーザー名/google-form-generator.git

# フォルダに移動
cd google-form-generator

# 完了！
```

---

## 🆘 トラブルシューティング

### エラー: "remote origin already exists"

```bash
# 既存のリモートを削除
git remote remove origin

# 改めて追加
git remote add origin https://github.com/あなたのユーザー名/google-form-generator.git
```

### エラー: "failed to push some refs"

```bash
# 最新の変更を取得してからプッシュ
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### エラー: "Authentication failed"

- Personal Access Tokenを再生成
- GitHub CLIを使用（`gh auth login`）

### プッシュが遅い

日本語ファイル名が多いため、初回プッシュは少し時間がかかる場合があります。
数分待ってください。

---

## 📋 チェックリスト

バックアップ完了確認：

- [ ] GitHubアカウントにログイン
- [ ] 新しいリポジトリを作成
- [ ] リモートリポジトリを追加（git remote add origin）
- [ ] プッシュ実行（git push -u origin main）
- [ ] GitHubでファイルが表示されることを確認
- [ ] README.mdが正しく表示されることを確認

追加設定（オプション）：

- [ ] リポジトリの説明を追加
- [ ] Topicsを追加
- [ ] ライセンスを追加
- [ ] Starを付ける（自分のリポジトリを見つけやすくする）

---

## 🎉 完了！

GitHubへのバックアップが完了すれば：

✅ データの安全なバックアップ
✅ バージョン管理
✅ 複数デバイスでの同期
✅ 他の人との共有（Publicの場合）
✅ オープンソースプロジェクトとしての公開

---

## 📞 次のステップ

1. **ターミナルを開く**
2. **ステップ3のコマンドを実行**
3. **GitHubで確認**

すべて完了です！

---

**作成日**: 2025年10月15日  
**Gitコミット**: 7ee6021  
**ファイル数**: 15ファイル  
**総行数**: 6211行

