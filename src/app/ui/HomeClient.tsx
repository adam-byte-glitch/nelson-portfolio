'use client';

import { Blocks } from '@/components/Blocks';
import { GlassItem } from '@/components/GlassItem';
import { PreviewFloat } from '@/components/PreviewFloat';
import type { Block, Project } from '@/lib/content';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';

type EmbedBlock = Extract<Block, { type: 'media'; mediaType: 'embed' }>;
function isEmbedBlock(b: Block): b is EmbedBlock {
  return b.type === 'media' && b.mediaType === 'embed';
}

export default function HomeClient({ projects }: { projects: Project[] }) {
  const [activeId, setActiveId] = useState(projects[0]?.id);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const active = useMemo(() => projects.find(p => p.id === activeId) ?? projects[0], [projects, activeId]);
  const hovered = useMemo(() => projects.find(p => p.id === hoverId), [projects, hoverId]);

  const previewUrl = hovered?.blocks.find(isEmbedBlock)?.src;

  return (
    <div className="relative">
      {/* subtle background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-40 top-20 h-[520px] w-[520px] rounded-full bg-fuchsia-500/10 blur-[90px]" />
        <div className="absolute -right-40 bottom-10 h-[520px] w-[520px] rounded-full bg-indigo-500/10 blur-[90px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.06),transparent_55%)]" />
      </div>

      <PreviewFloat show={!!hovered} title={hovered?.title} url={previewUrl} />

      <main className="mx-auto max-w-[1200px] px-5 py-10 md:py-14">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[360px_1fr] md:gap-12">
          {/* Left: list */}
          <div className="space-y-4">
            <div className="text-sm text-white/70">Projects</div>
            <div className="space-y-2">
              {projects.map(p => (
                <GlassItem
                  key={p.id}
                  active={p.id === active?.id}
                  onHoverStart={() => setHoverId(p.id)}
                  onHoverEnd={() => setHoverId(null)}
                  onClick={() => setActiveId(p.id)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[13px] text-white/65">{p.year}</div>
                      <div className="text-[15px] text-white/90 tracking-tight">{p.title}</div>
                      {p.tags?.length ? (
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {p.tags.slice(0, 3).map(t => (
                            <span
                              key={t}
                              className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/70"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <div className="h-9 w-9 rounded-full bg-white/5 border border-white/10 grid place-items-center text-white/60">
                      ↗
                    </div>
                  </div>
                </GlassItem>
              ))}
            </div>
          </div>

          {/* Right: detail */}
          <div className="rounded-3xl bg-white/[0.85] text-black border border-black/10 shadow-[0_30px_100px_rgba(0,0,0,0.35)] overflow-hidden">
            <div className="px-6 py-5 border-b border-black/10 bg-white/60 backdrop-blur-2xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[12px] text-black/50">Selected</div>
                  <div className="text-lg font-medium tracking-tight">{active?.title}</div>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-black/50"
                >
                  system-ui
                </motion.div>
              </div>
            </div>
            <div className="p-6">
              {active?.blocks ? <Blocks blocks={active.blocks} /> : null}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
