import { NextRequest, NextResponse } from "next/server";
import { getClients, getSites } from "@/lib/data";
import { getSession, unauthorized, checkPermission } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return unauthorized();
  const deny = checkPermission(session, "sites:read");
  if (deny) return deny;

  const [clients, sites] = await Promise.all([getClients(), getSites()]);

  if (!clients.success) {
    return NextResponse.json({ error: clients.error }, { status: 500 });
  }

  if (!sites.success) {
    return NextResponse.json({ error: sites.error }, { status: 500 });
  }

  return NextResponse.json({ clients: clients.data, sites: sites.data });
}
