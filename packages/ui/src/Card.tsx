import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from './utils';

export function Container({ className, children, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div className={cn('mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8', className)} {...props}>{children}</div>;
}

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div className={cn('rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900', className)} {...props}>{children}</div>;
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div className={cn('p-5 pb-3', className)} {...props}>{children}</div>;
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div className={cn('p-5 pt-0', className)} {...props}>{children}</div>;
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div className={cn('p-5 pt-0', className)} {...props}>{children}</div>;
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement> & { children?: ReactNode }) {
  return <h3 className={cn('text-lg font-semibold text-slate-900 dark:text-slate-50', className)} {...props}>{children}</h3>;
}

export function SectionTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement> & { children?: ReactNode }) {
  return <h2 className={cn('text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50', className)} {...props}>{children}</h2>;
}

export function Muted({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement> & { children?: ReactNode }) {
  return <p className={cn('text-sm text-slate-600 dark:text-slate-400', className)} {...props}>{children}</p>;
}
