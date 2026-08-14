// source_handbook: week11-hackathon-preparation
import { Readable } from 'node:stream'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import { handleNvidiaRequest } from './api/nvidia.js'

function localNvidiaApi(apiKey) {
  return {
    name: 'local-nvidia-api',
    configureServer(server) {
      server.middlewares.use('/api/nvidia', async (request, response) => {
        const url = new URL(request.url || '/', 'http://localhost/api/nvidia')
        const webRequest = new Request(url, {
          method: request.method,
          headers: request.headers,
          ...(request.method !== 'GET' && request.method !== 'HEAD'
            ? { body: Readable.toWeb(request), duplex: 'half' }
            : {}),
        })
        const webResponse = await handleNvidiaRequest(webRequest, apiKey)

        response.statusCode = webResponse.status
        webResponse.headers.forEach((value, key) => response.setHeader(key, value))

        if (!webResponse.body) {
          response.end()
          return
        }

        Readable.fromWeb(webResponse.body).pipe(response)
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const localNvidiaKey = [env.NVIDIA_API_KEY, env.VITE_GITHUB_TOKEN]
    .find((value) => value?.startsWith('nvapi-'))
    || env.NVIDIA_API_KEY
    || env.VITE_GITHUB_TOKEN

  return {
    plugins: [
      localNvidiaApi(localNvidiaKey),
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
