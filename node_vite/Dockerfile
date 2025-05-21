# Node.jsベース
FROM node:18

# 作業ディレクトリ作成
WORKDIR /app

# package.jsonとlockファイルだけ先にコピー
COPY package*.json ./

# 依存関係インストール
RUN npm install

# 全ファイルをコピー（後にすることでキャッシュ効かせる）
COPY . .

# ホットリロード用にポート公開
EXPOSE 5173

# ホットリロードのためにViteを起動
CMD ["npm", "run", "dev"]
