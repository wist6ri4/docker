# 🚀 Vite + React + Docker 開発環境構築手順書

## ✅ 1. プロジェクト初期化（ホスト側で1回だけやる）
Node.js & npm をホストにインストールしている場合：
```bash
npm create vite@latest .  # テンプレートは「react」を選択
npm install
```

Node.js をホストに入れたくない場合は、以下のいずれかの方法で初期化：
### 方法A：Node入りDockerで初期化（ホストを汚さない）
```bash
docker run --rm -it -v ${PWD}:/app -w /app node:18 bash
```

その中で以下を実行：
```bash
npm create vite@latest .
npm install
exit
```

### 方法B：手動で package.json などを作成（ファイル構成は下記参照）
---

## ✅ 2. ファイル構成
```
my-vite-app/
├── Dockerfile
├── docker-compose.yml
├── vite.config.js
├── index.html
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── App.css
    └── index.css
```

---
## ✅ 3. ファイル内容
### 📄 Dockerfile

```Dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]
```

### 📄 docker-compose.yml
```yaml
version: "3"
services:
    vite:
        build: .
        ports:
            - "5173:5173"
        volumes:
            - .:/app
            - node_modules:/app/node_modules
        environment:
            - HOST=0.0.0.0
            - CHOKIDAR_USEPOLLING=true

volumes:
    node_modules:
```

### 📄 vite.config.js
```js
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: "dist",
        assetsDir: "assets",
        sourcemap: false,
        minify: "esbuild",
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["react", "react-dom"],
                },
            },
        },
    },
    server: {
        host: "0.0.0.0", // 明示的に書く
        port: 5173,
        watch: {
            usePolling: true, // ← 重要（特にWindows + Dockerで必要！）
            interval: 100, // ポーリング間隔（ミリ秒）
        },
        hmr: {
            host: "localhost", // ホスト名を明示的に指定
            port: 5173, // HMRのポート番号
            protocol: "ws", // WebSocketプロトコルを使用
        },
    },
});
```

## ✅ 4. 開発環境の起動
```bash
docker compose up --build
```

ブラウザでアクセス：
```
http://localhost:5173
```

→ JSX/CSS を変更するとホットリロードされる

---

## ✅ 5. 開発終了時のコンテナ停止手順
### 一時停止だけなら（再開もすぐ）
```bash
Ctrl + C
docker compose down
```

### 完全クリーン終了（volumeも削除）
```bash
docker compose down --volumes --remove-orphans
```

---

## ✅ 6. 再開手順

```bash
docker compose up
```
