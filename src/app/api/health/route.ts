import { NextResponse } from "next/server";

// export const runtime = 'edge'; // Removed for standard Node.js deployment

export async function GET() {
  const status: Record<string, unknown> = {
    ok: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };

  return NextResponse.json(status);
}


