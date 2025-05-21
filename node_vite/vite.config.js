// vite.config.js
export default {
    server: {
        host: '0.0.0.0', // 明示的に書く
        port: 5173,
        watch: {
            usePolling: true // ← 重要（特にWindows + Dockerで必要！）
        },
    }
}
