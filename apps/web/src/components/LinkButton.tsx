import Link from 'next/link';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { buttonVariants, cn } from '@opencaribe/ui';
import type { VariantProps } from 'class-variance-authority';

type LinkButtonProps = VariantProps<typeof buttonVariants> &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    children?: ReactNode;
  };

/**
 * Anchor styled with the shared button system. Prefer this over nesting a
 * <Button> inside a <Link>, which produces invalid interactive markup.
 */
export function LinkButton({ href, className, variant, size, children, ...props }: LinkButtonProps) {
  return (
    <Link href={href} className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
    </Link>
  );
}
