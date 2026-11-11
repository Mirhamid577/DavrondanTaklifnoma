import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

/* `api/` papkasi Vercel serverless funksiyalari uchun.
 * Lokal `npm run dev` da ular ishlashi uchun shu kichik middleware. */
function wishesApi() {
  return {
    name: 'wishes-api',
    configureServer(server) {
      server.middlewares.use('/api/wishes', async (req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'POST') return next()
        try {
          const { default: handler } = await server.ssrLoadModule('/api/wishes.js')
          await handler(req, res)
        } catch (error) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ enabled: false, error: String(error) }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  /* .env / .env.local dagi barcha o'zgaruvchilarni (VITE_ prefiksisiz ham)
   * serverless funksiyalar uchun process.env ga uzatamiz. */
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  return {
    plugins: [react(), tailwindcss(), wishesApi()],
  }
})
