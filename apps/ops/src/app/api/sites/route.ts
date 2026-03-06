import { NextResponse } from "next/server";
import { getClients, getSites } from "@/lib/data";

export async function GET() {
  const [clients, sites] = await Promise.all([getClients(), getSites()]);

  if (!clients.success) {
    return NextResponse.json({ error: clients.error }, { status: 500 });
  }

  if (!sites.success) {
    return NextResponse.json({ error: sites.error }, { status: 500 });
  }

  return NextResponse.json({ clients: clients.data, sites: sites.data });
}
