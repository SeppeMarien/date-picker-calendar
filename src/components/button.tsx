'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/tailwind';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 -950 -slate-800',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-content hover:bg-primary-focus',
        destructive: 'bg-red-500 text-slate-50 hover:bg-red-500/90',
        outline:
          'border border-primary bg-transparent text-primary hover:bg-primary-focus hover:text-primary-content',
        secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-100/80',
        ghost: 'text-primary hover:bg-primary hover:text-primary-content',
        link: 'text-primary underline-offset-4 hover:underline ',
      },
      size: {
        default: 'h-8 px-4',
        sm: 'h-7 rounded-md px-3',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
