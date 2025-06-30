import { NextRequest, NextResponse } from "next/server"
import { kv } from "@vercel/kv" // ou outro storage

export async function GET() {
  const settings = await kv.get("seo-settings")
  return NextResponse.json(settings || {})
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  await kv.set("seo-settings", data)
  return NextResponse.json({ ok: true })
}