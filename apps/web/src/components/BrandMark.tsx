import type { CSSProperties } from 'react';

/**
 * OpenCaribe brand mark: a small sailship over two waves, in the product
 * teal/navy palette. Original vector artwork, no external assets.
 */
export function BrandMark({ size = 36, className = '' }: { size?: number; className?: string }) {
  const style: CSSProperties = { width: size, height: size, display: 'inline-block' };
  return (
    <span aria-hidden="true" className={`grid place-items-center overflow-hidden rounded-xl bg-teal-700 dark:bg-teal-500 ${className}`} style={style}>
      <svg viewBox="0 0 48 48" width={size} height={size} role="presentation">
        <rect width="48" height="48" rx="12" fill="#0f766e" />
        <path d="M21.5 8 L21.5 27 L9 27 Z" fill="#f0fdfa" />
        <path d="M27.5 12 L27.5 27 L39 27 Z" fill="#99f6e4" />
        <rect x="24.4" y="6" width="2.2" height="23" rx="1.1" fill="#134e4a" />
        <path d="M8 29 L40 29 L35.5 37.5 L12.5 37.5 Z" fill="#f0fdfa" />
        <path d="M9 41.5 Q12.5 38.5 16 41.5 T23 41.5 T30 41.5 T37 41.5" stroke="#2dd4bf" strokeWidth="3" strokeLinecap="round" fill="none" />
      </svg>
    </span>
  );
}
