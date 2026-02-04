'use client';

import type { Block } from '@/lib/content';
import clsx from 'clsx';

const COLORS: Record<string, string> = {
  charcoal: 'text-[#1a1a1a]',
  'light-charcoal': 'text-[#2a2a2a]',
};

function AspectBox({ aspect, children }: { aspect: 'landscape' | 'portrait'; children: React.ReactNode }) {
  const ratio = aspect === 'portrait' ? 'aspect-[3/4]' : 'aspect-[16/9]';
  return (
    <div className={clsx('w-full overflow-hidden rounded-2xl border border-black/10 bg-black/[0.03]', ratio)}>
      {children}
    </div>
  );
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((b, idx) => {
        if (b.type === 'header') {
          return (
            <h2
              key={idx}
              className={clsx(
                'text-xl md:text-2xl font-medium tracking-tight',
                COLORS[b.color || 'charcoal'],
              )}
            >
              {b.text}
            </h2>
          );
        }

        if (b.type === 'body') {
          return (
            <p key={idx} className={clsx('text-[15px] leading-6', COLORS[b.color || 'light-charcoal'])}>
              {b.text}
            </p>
          );
        }

        if (b.type === 'media') {
          const common = 'h-full w-full';
          return (
            <div key={idx} className="space-y-2">
              <AspectBox aspect={b.aspect}>
                {b.mediaType === 'embed' ? (
                  <iframe
                    src={b.src}
                    className={common}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                  />
                ) : b.mediaType === 'image' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.src} alt={b.caption || ''} className={clsx(common, 'object-cover')} />
                ) : (
                  <video src={b.src} className={clsx(common, 'object-cover')} controls playsInline />
                )}
              </AspectBox>
              {b.caption ? <div className="text-xs text-black/50">{b.caption}</div> : null}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
