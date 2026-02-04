'use client';

import { AnimatePresence, motion } from 'framer-motion';

export function PreviewFloat({
  show,
  title,
  url,
}: {
  show: boolean;
  title?: string;
  url?: string;
}) {
  return (
    <AnimatePresence>
      {show && url ? (
        <motion.div
          key="preview"
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          className="pointer-events-none fixed left-1/2 top-1/2 z-50 hidden -translate-x-[52%] -translate-y-[52%] md:block"
        >
          <div className="w-[440px] overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-2xl shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
            <div className="px-4 py-3 text-xs text-white/70">{title}</div>
            <div className="h-[260px] bg-black/30">
              <iframe
                src={url}
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
