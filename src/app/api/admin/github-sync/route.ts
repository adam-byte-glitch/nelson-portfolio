import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { readContent } from '@/lib/content';

export async function POST() {
  const ok = await isAdmin();
  if (!ok) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!token || !owner || !repo) {
    return NextResponse.json({ error: 'GitHub sync not configured' }, { status: 400 });
  }

  const content = await readContent();
  const pathInRepo = 'content/projects.json';

  const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(pathInRepo)}`;

  // Get current SHA (if exists)
  const currentRes = await fetch(`${apiBase}?ref=${branch}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      Accept: 'application/vnd.github+json',
    },
  });

  let sha: string | undefined;
  if (currentRes.ok) {
    const currentJson = await currentRes.json();
    sha = currentJson.sha;
  }

  const body = {
    message: `Update content/projects.json (${new Date().toISOString()})`,
    content: Buffer.from(JSON.stringify(content, null, 2) + '\n', 'utf8').toString('base64'),
    branch,
    sha,
  };

  const putRes = await fetch(apiBase, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!putRes.ok) {
    const text = await putRes.text();
    return NextResponse.json({ error: 'GitHub update failed', details: text }, { status: 500 });
  }

  const out = await putRes.json();
  return NextResponse.json({ ok: true, commit: out.commit?.sha });
}
