import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

try {
  app.prepare().then(() => {
    createServer((req, res) => {
      try {
        const parsedUrl = parse(req.url, true)
        handle(req, res, parsedUrl)
      } catch (err) {
        console.error('Error occurred handling', req.url, err)
        res.statusCode = 500
        res.end('internal server error')
      }
    }).listen(3000, (err) => {
      if (err) throw err
      console.log('> Ready on http://localhost:3000')
    })
  }).catch(err => {
    console.error('Error during app preparation:', err)
  })
} catch (err) {
  console.error('Error setting up server:', err)
}
