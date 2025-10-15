#!/bin/bash

# Googleフォーム自動作成ツール - 配布用ZIP作成スクリプト
# バージョン: 1.0

echo "📦 配布用ZIPファイルを作成します..."
echo ""

# 現在のディレクトリを保存
ORIGINAL_DIR=$(pwd)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# バージョン番号
VERSION="1.0.0"

# 配布用ディレクトリ名
DIST_DIR="google-form-generator-v${VERSION}"
TEMP_DIR="distribution-temp"

# 既存の一時ディレクトリを削除
if [ -d "$TEMP_DIR" ]; then
    echo "🧹 既存の一時ディレクトリを削除..."
    rm -rf "$TEMP_DIR"
fi

# 配布用ディレクトリを作成
echo "📁 配布用ディレクトリを作成..."
mkdir -p "$TEMP_DIR/$DIST_DIR"

# 必要なファイルをコピー
echo "📄 ファイルをコピー中..."

# ドキュメント
cp "01_README.md" "$TEMP_DIR/$DIST_DIR/"
cp "02_Google_Apps_Script_セットアップ.md" "$TEMP_DIR/$DIST_DIR/"
cp "03_Chrome拡張機能_インストール.md" "$TEMP_DIR/$DIST_DIR/"
cp "04_動作確認.md" "$TEMP_DIR/$DIST_DIR/"
cp "05_ChatGPT連携方法.md" "$TEMP_DIR/$DIST_DIR/"
cp "09_アイコン作成ガイド.md" "$TEMP_DIR/$DIST_DIR/"

# サンプルファイル
cp "06_サンプルJSONファイル.json" "$TEMP_DIR/$DIST_DIR/"

# Chrome拡張機能
mkdir -p "$TEMP_DIR/$DIST_DIR/Chrome拡張機能"
cp "07_Chrome拡張機能ファイル/manifest.json" "$TEMP_DIR/$DIST_DIR/Chrome拡張機能/"
cp "07_Chrome拡張機能ファイル/popup.html" "$TEMP_DIR/$DIST_DIR/Chrome拡張機能/"
cp "07_Chrome拡張機能ファイル/popup.js" "$TEMP_DIR/$DIST_DIR/Chrome拡張機能/"

# Google Apps Scriptコード
cp "08_Google_Apps_Script_コード.js" "$TEMP_DIR/$DIST_DIR/"

# 配布用README
cat > "$TEMP_DIR/$DIST_DIR/はじめにお読みください.txt" << 'EOL'
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Googleフォーム自動作成ツール
  Google Form Generator v1.0.0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📖 インストール方法

1. 「01_README.md」を開いてください
2. 手順に従ってセットアップ（約30分）
3. すぐに使えます！

📚 ドキュメント

- 01_README.md
  → プロジェクト概要（まずここを読む）

- 02_Google_Apps_Script_セットアップ.md
  → Apps Scriptの詳細セットアップ

- 03_Chrome拡張機能_インストール.md
  → 拡張機能のインストール手順

- 04_動作確認.md
  → 動作確認とトラブルシューティング

- 05_ChatGPT連携方法.md
  → AIでフォームを生成する方法

- 09_アイコン作成ガイド.md
  → アイコンファイルの作成方法

📁 フォルダ構成

Chrome拡張機能/
  └── Chrome拡張機能のファイル

06_サンプルJSONファイル.json
  └── 動作確認用サンプル

08_Google_Apps_Script_コード.js
  └── Apps Script用コード

🎯 期待できる効果

フォーム作成時間を99%削減！
- 10問: 30分 → 3秒
- 50問: 150分 → 10秒

📞 サポート

GitHub: https://github.com/kyamafiddle60-wq/google-form-generator
Issues: https://github.com/kyamafiddle60-wq/google-form-generator/issues

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

まずは「01_README.md」を開いてください！

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOL

# ZIPファイルを作成
echo "🗜️  ZIPファイルを作成中..."
cd "$TEMP_DIR"

# macOSの隠しファイルを除外してZIP作成
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOSの場合
    zip -r "../${DIST_DIR}.zip" "$DIST_DIR" -x "*.DS_Store" -x "__MACOSX/*"
else
    # それ以外の場合
    zip -r "../${DIST_DIR}.zip" "$DIST_DIR"
fi

cd ..

# 一時ディレクトリを削除
echo "🧹 一時ファイルを削除..."
rm -rf "$TEMP_DIR"

# 完了メッセージ
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 配布用ZIPファイルの作成が完了しました！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📦 作成されたファイル:"
echo "   ${DIST_DIR}.zip"
echo ""
echo "📊 ファイルサイズ:"
du -h "${DIST_DIR}.zip"
echo ""
echo "🚀 配布方法:"
echo "   1. ZIPファイルをメールやファイル共有サービスで送信"
echo "   2. 受け取った人は「01_README.md」を参照"
echo "   3. 約30分でセットアップ完了"
echo ""
echo "💡 オンライン配布の場合:"
echo "   GitHub: https://github.com/kyamafiddle60-wq/google-form-generator"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 元のディレクトリに戻る
cd "$ORIGINAL_DIR"
