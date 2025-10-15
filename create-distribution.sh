#!/bin/bash

# Googleフォーム自動作成ツール - 配布用パッケージ作成スクリプト
# バージョン: 1.0

echo "📦 配布用パッケージを作成します..."
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

# Chrome拡張機能
cp -r "google-form-generator" "$TEMP_DIR/$DIST_DIR/"

# Code.gsは配布パッケージには含めない（別途セットアップするため）
# ただし、説明書には含める
mkdir -p "$TEMP_DIR/$DIST_DIR/docs"
cp "google-form-generator/Code.gs" "$TEMP_DIR/$DIST_DIR/docs/"

# ドキュメント
cp "README.md" "$TEMP_DIR/$DIST_DIR/"
cp "INSTALL.md" "$TEMP_DIR/$DIST_DIR/"
cp "初心者向けセットアップガイド.md" "$TEMP_DIR/$DIST_DIR/"
cp "セットアップ確認チェックリスト.md" "$TEMP_DIR/$DIST_DIR/"
cp "ChatGPT用プロンプト.md" "$TEMP_DIR/$DIST_DIR/"

# サンプルファイル
cp "sample-survey.json" "$TEMP_DIR/$DIST_DIR/"

# ライセンス（もしあれば）
if [ -f "LICENSE" ]; then
    cp "LICENSE" "$TEMP_DIR/$DIST_DIR/"
fi

# 配布用README
cat > "$TEMP_DIR/$DIST_DIR/はじめにお読みください.txt" << 'EOL'
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Googleフォーム自動作成ツール
  Google Form Generator v1.0.0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📖 インストール方法

1. 「INSTALL.md」を開いてください
2. 手順に従ってセットアップ（約30分）
3. すぐに使えます！

📚 ドキュメント

- INSTALL.md
  → クイックインストールガイド（まずここを読む）

- 初心者向けセットアップガイド.md
  → 詳細なセットアップ手順

- セットアップ確認チェックリスト.md
  → 正しく設定できているか確認

- ChatGPT用プロンプト.md
  → AIでフォームを生成する方法

- README.md
  → プロジェクト概要

📁 フォルダ構成

google-form-generator/
  └── Chrome拡張機能のファイル

docs/
  └── Code.gs（Google Apps Script用）

sample-survey.json
  └── 動作確認用サンプル

🎯 期待できる効果

フォーム作成時間を99%削減！
- 10問: 30分 → 3秒
- 50問: 150分 → 10秒

📞 サポート

GitHub: https://github.com/kyamafiddle60-wq/google-form-generator
Issues: https://github.com/kyamafiddle60-wq/google-form-generator/issues

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

まずは「INSTALL.md」を開いてください！

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
echo "✅ 配布用パッケージの作成が完了しました！"
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
echo "   2. 受け取った人は「INSTALL.md」を参照"
echo "   3. 約30分でセットアップ完了"
echo ""
echo "💡 オンライン配布の場合:"
echo "   GitHub: https://github.com/kyamafiddle60-wq/google-form-generator"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 元のディレクトリに戻る
cd "$ORIGINAL_DIR"

