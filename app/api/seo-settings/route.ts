import { NextRequest, NextResponse } from "next/server"
import { kv } from "@vercel/kv"

const KEY = "seo-settings"

export async function GET() {
  const settings = await kv.get(KEY)
  return NextResponse.json(settings || {})
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  await kv.set(KEY, data)
  return NextResponse.json({ ok: true })
}