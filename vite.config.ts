import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import type { Connect, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const STATE_DIR = '.data'
const STATE_FILE = path.resolve(STATE_DIR, 'whoosh-csirt-state.json')

// State bersama lintas browser (mis. input di Edge, dibuka di Chrome) disimpan
// sebagai file JSON di sisi server dev/preview. Tanpa server (hosting statis),
// aplikasi otomatis jatuh kembali ke localStorage masing-masing browser.
function whooshStateStore(): Plugin {
  const middleware: Connect.NextHandleFunction = (req, res, next) => {
    if (req.url !== '/api/whoosh-state') return next()
    res.setHeader('Content-Type', 'application/json')
    if (req.method === 'GET') {
      try {
        res.end(fs.existsSync(STATE_FILE) ? fs.readFileSync(STATE_FILE, 'utf8') : 'null')
      } catch {
        res.end('null')
      }
      return
    }
    if (req.method === 'PUT') {
      let body = ''
      req.on('data', (chunk) => {
        body += chunk
      })
      req.on('end', () => {
        try {
          JSON.parse(body)
          fs.mkdirSync(STATE_DIR, { recursive: true })
          const tmp = `${STATE_FILE}.tmp`
          fs.writeFileSync(tmp, body, 'utf8')
          fs.renameSync(tmp, STATE_FILE)
          res.end('{"ok":true}')
        } catch {
          res.statusCode = 500
          res.end('{"ok":false}')
        }
      })
      return
    }
    return next()
  }
  return {
    name: 'whoosh-state-store',
    configureServer: (server) => {
      server.middlewares.use(middleware)
    },
    configurePreviewServer: (server) => {
      server.middlewares.use(middleware)
    },
  }
}

// NVD menolak CORS preflight (OPTIONS) dari browser, sehingga header apiKey
// tidak bisa dikirim langsung. Proxy dev/preview meneruskan key dari sisi server;
// di hosting statis tanpa proxy, nvdService otomatis fallback ke request tanpa key.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const base =
    env.VITE_NVD_API_BASE_URL || 'https://services.nvd.nist.gov/rest/json/cves/2.0'
  // parse tanpa constructor URL/process agar lolos tsc tanpa @types/node
  const m = base.match(/^(https?:\/\/[^/]+)(\/.*)?$/)
  const target = m?.[1] ?? 'https://services.nvd.nist.gov'
  const prefix = (m?.[2] ?? '/rest/json/cves/2.0').replace(/\/cves\/2\.0\/?$/, '')
  const nvdProxy = {
    '/nvd-proxy': {
      target,
      changeOrigin: true,
      rewrite: (path: string) => path.replace(/^\/nvd-proxy/, prefix),
    },
  }

  return {
    plugins: [react(), tailwindcss(), whooshStateStore()],
    server: { proxy: nvdProxy },
    preview: { proxy: nvdProxy },
  }
})