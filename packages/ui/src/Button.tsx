import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from './utils';

export const buttonVariants = cva(
  [
    'inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold',
    'transition-[background-color,border-color,color,box-shadow,transform] duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2',
    'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
    'dark:focus-visible:ring-offset-slate-900',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: 'bg-teal-700 text-white shadow-sm hover:bg-teal-800 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400',
        secondary: 'border border-slate-300 bg-white text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
        ghost: 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
        coral: 'bg-coral-600 text-white shadow-sm hover:bg-coral-700 dark:bg-coral-500 dark:text-slate-950 dark:hover:bg-coral-400',
        danger: 'bg-rose-600 text-white shadow-sm hover:bg-rose-700',
        outlineLight: 'border border-white/40 bg-white/10 text-white hover:bg-white/20',
      },
      size: {
        xs: 'h-8 px-2.5 text-xs',
        sm: 'h-9 px-3',
        md: 'min-h-11 px-5',
        lg: 'min-h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children?: ReactNode;
}

export function Button({ className, variant, size, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
