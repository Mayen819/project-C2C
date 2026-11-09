import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, projectRoot, '')
  const apiPort = env.PORT || process.env.PORT || 3001
  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      proxy: { '/api': { target: `http://localhost:${apiPort}`, changeOrigin: true } },
    },
  }
})
