#!/bin/bash

# EC2環境でのデプロイスクリプト
# 使用方法: ./deploy-ec2.sh

set -e

echo "🚀 EC2環境でのデプロイを開始します..."

# 1. システムの更新
echo "📦 システムパッケージを更新中..."
sudo yum update -y

# 2. Dockerのインストール（Amazon Linux 2の場合）
echo "🐳 Dockerをインストール中..."
if ! command -v docker &> /dev/null; then
    sudo yum install -y docker
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -a -G docker $USER
    echo "✅ Dockerがインストールされました。再ログインが必要な場合があります。"
fi

# 3. Docker Composeのインストール
echo "🔧 Docker Composeをインストール中..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "✅ Docker Composeがインストールされました。"
fi

# 4. Gitのインストール（必要に応じて）
echo "📁 Gitをインストール中..."
if ! command -v git &> /dev/null; then
    sudo yum install -y git
    echo "✅ Gitがインストールされました。"
fi

# 5. リポジトリのクローン（既存の場合は更新）
REPO_URL="https://github.com/wist6ri4/docker.git"
PROJECT_DIR="$HOME/docker"

if [ -d "$PROJECT_DIR" ]; then
    echo "📥 既存のリポジトリを更新中..."
    cd "$PROJECT_DIR"
    git pull origin main
else
    echo "📥 リポジトリをクローン中..."
    cd "$HOME"
    git clone "$REPO_URL"
    cd "$PROJECT_DIR"
fi

# 6. 本番環境用のビルドとデプロイ
echo "🏗️  アプリケーションをビルド・デプロイ中..."

# Dockerグループのチェック
check_docker_permission() {
    if ! docker ps &> /dev/null; then
        echo "⚠️  Dockerの権限が不足しています。sudoを使用します。"
        return 1
    fi
    return 0
}

# Docker実行のラッパー関数
run_docker() {
    if check_docker_permission; then
        "$@"
    else
        sudo "$@"
    fi
}

# 古いコンテナとイメージを削除
run_docker docker-compose -f docker-compose.prod.yaml down --remove-orphans || true
run_docker docker system prune -f

# キャッシュを無効にしてビルド
run_docker docker-compose -f docker-compose.prod.yaml build --no-cache
run_docker docker-compose -f docker-compose.prod.yaml up -d

# 7. セキュリティグループとファイアウォールの確認
echo "🔒 セキュリティ設定を確認してください:"
echo "   - EC2セキュリティグループでポート80を開放"
echo "   - 必要に応じてHTTPS（ポート443）も設定"

# 8. 完了メッセージ
echo "✨ デプロイが完了しました！"
echo "🌐 アプリケーションは以下でアクセス可能です:"
echo "   http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"

# 9. ログの確認方法を表示
echo "📋 ログの確認方法:"
echo "   docker-compose -f docker-compose.prod.yaml logs -f"
