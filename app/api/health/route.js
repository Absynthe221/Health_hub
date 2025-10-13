import { NextResponse } from 'next/server'

export async function GET() {
  const now = new Date()
  const uptimeSeconds = Math.round(process.uptime())
  const memory = process.memoryUsage()

  const payload = {
    ok: true,
    status: 'healthy',
    timestamp: now.toISOString(),
    uptimeSeconds,
    env: {
      node: process.version,
      appUrl: process.env.APP_URL || 'http://localhost:3000',
      runtime: 'nextjs-app-router',
    },
    resources: {
      memory: {
        rss: memory.rss,
        heapTotal: memory.heapTotal,
        heapUsed: memory.heapUsed,
        external: memory.external,
      },
    },
  }

  return NextResponse.json(payload)
}




