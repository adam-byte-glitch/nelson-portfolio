import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import type { Content } from '@/lib/content';
import { writeContent, readContent } from '@/lib/content';

export async function GET() {
  const ok = await isAdmin();
  if (!ok) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const content = await readContent();
  return NextResponse.json(content);
}

export async function POST(req: Request) {
  const ok = await isAdmin();
  if (!ok) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const content = (await req.json()) as Content;
  await writeContent(content);

  return NextResponse.json({ ok: true });
}
