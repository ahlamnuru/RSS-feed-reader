import { defineConfig, type Plugin } from 'vite'
import tailwindcss from '@tailwindcss/vite'

function feedProxy(): Plugin {
  return {
    name: 'feed-proxy',
    configureServer(server) {
      server.middlewares.use('/api/feed', async (req, res) => {
        try {
          const target = new URL(req.url ?? '', 'http://localhost').searchParams.get('url')

          if (!target) {
            res.statusCode = 400
            res.end('Missing url')
            return
          }

          const parsed = new URL(target)

          if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            res.statusCode = 400
            res.end('Invalid protocol')
            return
          }

          const upstream = await fetch(parsed, {
            headers: {
              'user-agent': 'Mozilla/5.0 (compatible; FrontpageReader/1.0)',
              accept:
                'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
            },
            signal: AbortSignal.timeout(10000),
          })

          const body = await upstream.text()
          res.statusCode = upstream.status
          res.setHeader('content-type', 'text/xml; charset=utf-8')
          res.end(body)
        } catch {
          res.statusCode = 502
          res.end('Unable to fetch feed')
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [tailwindcss(), feedProxy()],
})