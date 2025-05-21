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

---

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
      - /app/node_modules
    environment:
      - HOST=0.0.0.0
      - CHOKIDAR_USEPOLLING=true
```

---

### 📄 vite.config.js

```js
export default {
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true
    }
  }
}
```

---

### 📄 index.html

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <title>Vite + React</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

### 📄 src/main.jsx

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

---

### 📄 src/App.jsx

```jsx
import React, { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <h1>🚀 Vite + React サンプル</h1>
      <p>現在のカウント：</p>
      <h2>{count}</h2>
      <button onClick={() => setCount(count + 1)}>+1する</button>
    </div>
  );
}

export default App;
```

---

### 📄 src/index.css (または App.css)

```css
body {
  margin: 0;
  font-family: sans-serif;
  text-align: center;
}

button {
  font-size: 1.2rem;
  padding: 0.5rem 1rem;
  background-color: #646cff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
```

---

## ✅ 4. 開発開始

```bash
docker compose up --build
```

ブラウザでアクセス：

```
http://localhost:5173
```

→ JSX/CSS を変更するとホットリロードされる✨

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

## ✅ 6. 翌日からの再開手順

```bash
docker compose up
```

これだけで即再開できます！

---

Happy Hacking! 💻✨