# EC2 でのデプロイ手順

## 前提条件

-   AWS EC2 インスタンス（Amazon Linux 2 または Ubuntu 推奨）
-   セキュリティグループでポート 80（HTTP）を開放
-   SSH 接続用のキーペア

## 手動デプロイ手順

### 1. EC2 に SSH 接続

```bash
ssh -i your-key.pem ec2-user@your-ec2-ip
```

### 2. 自動デプロイスクリプトの実行

```bash
# スクリプトをダウンロード
curl -O https://raw.githubusercontent.com/wist6ri4/realmomotetsu-v2/main/deploy-ec2.sh

# 実行権限を付与
chmod +x deploy-ec2.sh

# デプロイ実行
./deploy-ec2.sh
```

### 3. 手動デプロイ（詳細手順）

#### Docker のインストール

```bash
# Amazon Linux 2の場合
sudo yum update -y
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker $USER

# Ubuntu の場合
sudo apt update
sudo apt install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker $USER
```

#### リポジトリのクローン

```bash
cd ~
git clone https://github.com/wist6ri4/realmomotetsu-v2.git
cd realmomotetsu-v2
```

#### 本番環境でのビルド・起動

```bash
# 本番用Docker Composeでビルド・起動
docker-compose -f docker-compose.prod.yaml up --build -d

# ログの確認
docker-compose -f docker-compose.prod.yaml logs -f
```

## アクセス方法

アプリケーションは以下の URL でアクセス可能：

```
http://your-ec2-public-ip
```

## 管理コマンド

### アプリケーションの停止

```bash
docker-compose -f docker-compose.prod.yaml down
```

### アプリケーションの再起動

```bash
docker-compose -f docker-compose.prod.yaml restart
```

### ログの確認

```bash
docker-compose -f docker-compose.prod.yaml logs -f
```

### アップデート

```bash
git pull origin main
docker-compose -f docker-compose.prod.yaml up --build -d
```

## トラブルシューティング

### ポートが使用できない場合

```bash
# 使用中のポートを確認
sudo netstat -tlnp | grep :80

# プロセスを停止
sudo pkill -f nginx
```

### Docker の権限エラー

```bash
# 再ログインするか、以下を実行
newgrp docker
```

### セキュリティグループの設定

-   EC2 コンソールでセキュリティグループを編集
-   インバウンドルールでポート 80（HTTP）を 0.0.0.0/0 から許可

## SSL/HTTPS 設定（オプション）

Let's Encrypt を使用して HTTPS 化する場合は、別途 Certbot の設定が必要です。
