import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const runtime = 'nodejs'

export async function GET() {
  if (process.env.NODE_ENV !== 'development') return new Response(null, { status: 404 })
  const css = await readFile(join(process.cwd(), 'components/design-system/tokens.css'), 'utf8')
  return new Response(css, {
    headers: {
      'Content-Type': 'text/css; charset=utf-8',
      'Content-Disposition': 'attachment; filename="built-over-time.tokens.css"',
      'Cache-Control': 'no-store',
    },
  })
}
