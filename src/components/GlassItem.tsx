'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';

export function GlassItem({
  children,
  className,
  onHoverStart,
  onHoverEnd,
  onClick,
  active,
}: {
  children: React.ReactNode;
  className?: string;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <motion.div
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onClick={onClick}
      whileHover={{ y: -1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      className={clsx(
        'group cursor-pointer select-none rounded-xl px-3 py-2',
        'bg-white/[0.03] hover:bg-white/[0.06]',
        'border border-white/[0.06] hover:border-white/[0.10]',
        'backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.05)_inset]',
        active && 'bg-white/[0.07] border-white/[0.14]',
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
