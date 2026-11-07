// app/api/notify/route.ts
import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    { error: "As notificações são enviadas automaticamente pelos eventos da aplicação." },
    { status: 410 },
  )
}