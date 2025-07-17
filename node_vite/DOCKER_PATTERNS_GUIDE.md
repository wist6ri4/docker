# Docker環境の分け方

## パターン 1: docker-compose ファイルを分ける（推奨）

```
project/
├── docker-compose.yaml          # 開発環境用
├── docker-compose.prod.yaml     # 本番環境用
├── docker-compose.override.yaml # ローカル開発者別の設定
├── Dockerfile                   # 開発用
├── Dockerfile.prod             # 本番用
└── .dockerignore
```

### 使い方

```bash
# 開発環境
docker-compose up

# 本番環境
docker-compose -f docker-compose.prod.yaml up

# 複数ファイル組み合わせ
docker-compose -f docker-compose.yaml -f docker-compose.override.yaml up
```

## パターン 2: 環境変数で分岐

```yaml
# docker-compose.yaml
version: "3"
services:
    app:
        build:
            context: .
            dockerfile: ${DOCKERFILE:-Dockerfile}
        environment:
            - NODE_ENV=${NODE_ENV:-development}
```

## パターン 3: ディレクトリで分ける

```
project/
├── docker/
│   ├── development/
│   │   ├── docker-compose.yaml
│   │   └── Dockerfile
│   └── production/
│       ├── docker-compose.yaml
│       └── Dockerfile
└── src/
```

## パターン 4: Multi-stage Dockerfile のみ

```dockerfile
# 開発ステージ
FROM node:18 AS development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

# 本番ステージ
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
```

## 業界でよく使われる構成

### Netflix, Google, Microsoft などの大企業

-   環境ごとに完全に分離された Dockerfile
-   Kubernetes manifest も環境別
-   CI/CD パイプラインで自動切り替え

### スタートアップ・中小企業

-   docker-compose.yaml と docker-compose.prod.yaml の組み合わせ
-   環境変数での設定切り替え

### オープンソースプロジェクト

-   Multi-stage Dockerfile + 複数の docker-compose ファイル
-   開発者が簡単にセットアップできるように配慮
