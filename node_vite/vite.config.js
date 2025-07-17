// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        minify: 'terser',
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom']
                }
            }
        }
    },
    server: {
        host: '0.0.0.0', // 明示的に書く
        port: 5173,
        watch: {
            usePolling: true, // ← 重要（特にWindows + Dockerで必要！）
            interval: 100, // ポーリング間隔（ミリ秒）
        },
        hmr: {
            host: 'localhost', // ホスト名を明示的に指定
            port: 5173, // HMRのポート番号
            protocol: 'ws', // WebSocketプロトコルを使用
        },
    }
})
