import { createServer } from 'https'
import { parse } from 'url'
import next from 'next'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

try {
  const sslKeyPath = join(__dirname, './ssl/localhost-key.pem')
  const sslCertPath = join(__dirname, './ssl/localhost.pem')

  const httpsOptions = {
    key: readFileSync(sslKeyPath),
    cert: readFileSync(sslCertPath),
  }

  app.prepare().then(() => {
    createServer(httpsOptions, async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true)
        await handle(req, res, parsedUrl)
      } catch (err) {
        console.error('Error occurred handling', req.url, err)
        res.statusCode = 500
        res.end('internal server error')
      }
    }).listen(3000, (err) => {
      if (err) throw err
      console.log('> Ready on https://localhost:3000')
    })
  }).catch(err => {
    console.error('Error during app preparation:', err)
  })
} catch (err) {
  console.error('Error setting up server:', err)
}
