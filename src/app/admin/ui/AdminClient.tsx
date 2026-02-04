'use client';

import type { Content, Project, Block, Aspect, TextColor, MediaType } from '@/lib/content';
import { useMemo, useState } from 'react';
import { nanoid } from 'nanoid';

const colorOptions: { value: TextColor; label: string }[] = [
  { value: 'charcoal', label: 'Charcoal Black' },
  { value: 'light-charcoal', label: 'Light Charcoal Black' },
];

const aspectOptions: { value: Aspect; label: string }[] = [
  { value: 'landscape', label: 'Landscape' },
  { value: 'portrait', label: 'Portrait' },
];

const mediaOptions: { value: MediaType; label: string }[] = [
  { value: 'embed', label: 'Embed URL' },
  { value: 'image', label: 'Image URL' },
  { value: 'video', label: 'Video URL' },
];

export default function AdminClient({ initial }: { initial: Content }) {
  const [content, setContent] = useState<Content>(initial);
  const [activeId, setActiveId] = useState(content.projects[0]?.id);
  const active = useMemo(
    () => content.projects.find(p => p.id === activeId) ?? content.projects[0],
    [content.projects, activeId],
  );

  async function save(next: Content) {
    setContent(next);
    await fetch('/api/admin/content', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(next),
    });
  }

  function updateProject(patch: Partial<Project>) {
    const next: Content = {
      ...content,
      projects: content.projects.map(p => (p.id === active?.id ? { ...p, ...patch } : p)),
    };
    void save(next);
  }

  function updateBlocks(blocks: Block[]) {
    updateProject({ blocks });
  }

  async function exportJSON() {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'projects.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function importJSON(file: File) {
    const text = await file.text();
    const next = JSON.parse(text);
    await save(next);
  }

  return (
    <main className="min-h-dvh bg-[#0b0b10] text-white">
      <div className="mx-auto max-w-[1200px] px-5 py-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-white/65">Admin</div>
            <h1 className="text-xl font-medium tracking-tight">Portfolio Editor</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportJSON()}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
            >
              Export JSON
            </button>
            <label className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 cursor-pointer">
              Import JSON
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) void importJSON(f);
                }}
              />
            </label>
            <button
              onClick={async () => {
                await fetch('/api/admin/github-sync', { method: 'POST' });
                alert('Requested GitHub sync (if configured).');
              }}
              className="rounded-xl bg-white text-black px-3 py-2 text-sm font-medium"
            >
              Sync to GitHub
            </button>
            <button
              onClick={async () => {
                await fetch('/api/admin/logout', { method: 'POST' });
                window.location.href = '/';
              }}
              className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-sm hover:bg-white/5"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[320px_1fr]">
          <div className="space-y-2">
            <div className="text-sm text-white/70">Projects</div>
            <div className="space-y-2">
              {content.projects.map(p => (
                <button
                  key={p.id}
                  onClick={() => setActiveId(p.id)}
                  className={`w-full text-left rounded-xl border px-3 py-2 bg-white/5 hover:bg-white/10 transition ${
                    p.id === active?.id ? 'border-white/20' : 'border-white/10'
                  }`}
                >
                  <div className="text-xs text-white/60">{p.year}</div>
                  <div className="text-sm">{p.title}</div>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                const id = nanoid(10);
                const next: Content = {
                  ...content,
                  projects: [
                    ...content.projects,
                    {
                      id,
                      title: 'New Project',
                      published: false,
                      blocks: [{ type: 'header', text: 'New Project', color: 'charcoal' }],
                    },
                  ],
                };
                void save(next);
                setActiveId(id);
              }}
              className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
            >
              + Add Project
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            {active ? (
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <div className="text-xs text-white/60">Title</div>
                    <input
                      value={active.title}
                      onChange={e => updateProject({ title: e.target.value })}
                      className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2"
                    />
                  </div>
                  <div>
                    <div className="text-xs text-white/60">Year</div>
                    <input
                      value={active.year || ''}
                      onChange={e => updateProject({ year: e.target.value })}
                      className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={active.published}
                      onChange={e => updateProject({ published: e.target.checked })}
                    />
                    Published
                  </label>
                </div>

                <div>
                  <div className="text-sm text-white/70">Blocks</div>
                  <div className="mt-3 space-y-3">
                    {active.blocks.map((b, idx) => (
                      <div key={idx} className="rounded-xl border border-white/10 bg-black/20 p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-white/60">{b.type.toUpperCase()}</div>
                          <button
                            onClick={() => {
                              const next = active.blocks.filter((_, i) => i !== idx);
                              updateBlocks(next);
                            }}
                            className="text-xs text-white/60 hover:text-white"
                          >
                            Remove
                          </button>
                        </div>

                        {b.type === 'header' || b.type === 'body' ? (
                          <>
                            <textarea
                              value={b.text}
                              onChange={e => {
                                const next = [...active.blocks];
                                (next[idx] as any).text = e.target.value;
                                updateBlocks(next);
                              }}
                              className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2"
                              rows={b.type === 'header' ? 2 : 4}
                            />
                            <div>
                              <div className="text-xs text-white/60">Text Color</div>
                              <select
                                value={(b as any).color || 'light-charcoal'}
                                onChange={e => {
                                  const next = [...active.blocks];
                                  (next[idx] as any).color = e.target.value;
                                  updateBlocks(next);
                                }}
                                className="mt-1 rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-sm"
                              >
                                {colorOptions.map(o => (
                                  <option key={o.value} value={o.value}>
                                    {o.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                              <div>
                                <div className="text-xs text-white/60">Media Type</div>
                                <select
                                  value={b.mediaType}
                                  onChange={e => {
                                    const next = [...active.blocks];
                                    (next[idx] as any).mediaType = e.target.value;
                                    updateBlocks(next);
                                  }}
                                  className="mt-1 rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-sm"
                                >
                                  {mediaOptions.map(o => (
                                    <option key={o.value} value={o.value}>
                                      {o.label}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <div className="text-xs text-white/60">Aspect</div>
                                <select
                                  value={b.aspect}
                                  onChange={e => {
                                    const next = [...active.blocks];
                                    (next[idx] as any).aspect = e.target.value;
                                    updateBlocks(next);
                                  }}
                                  className="mt-1 rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-sm"
                                >
                                  {aspectOptions.map(o => (
                                    <option key={o.value} value={o.value}>
                                      {o.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div>
                              <div className="text-xs text-white/60">Source URL</div>
                              <input
                                value={b.src}
                                onChange={e => {
                                  const next = [...active.blocks];
                                  (next[idx] as any).src = e.target.value;
                                  updateBlocks(next);
                                }}
                                className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2"
                              />
                            </div>

                            <div>
                              <div className="text-xs text-white/60">Caption (optional)</div>
                              <input
                                value={b.caption || ''}
                                onChange={e => {
                                  const next = [...active.blocks];
                                  (next[idx] as any).caption = e.target.value;
                                  updateBlocks(next);
                                }}
                                className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    ))}

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => updateBlocks([...active.blocks, { type: 'header', text: 'Header', color: 'charcoal' }])}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                      >
                        + Header
                      </button>
                      <button
                        onClick={() =>
                          updateBlocks([
                            ...active.blocks,
                            { type: 'body', text: 'Body copy', color: 'light-charcoal' },
                          ])
                        }
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                      >
                        + Body
                      </button>
                      <button
                        onClick={() =>
                          updateBlocks([
                            ...active.blocks,
                            {
                              type: 'media',
                              mediaType: 'embed',
                              src: 'https://example.com',
                              aspect: 'landscape',
                              caption: '',
                            },
                          ])
                        }
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                      >
                        + Media
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-white/60">No project selected.</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
