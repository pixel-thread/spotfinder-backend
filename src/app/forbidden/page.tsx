'use client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <div
      className={cn('min-h-screen flex flex-col items-center justify-center bg-background px-4')}
    >
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <svg width="64" height="64" fill="none" viewBox="0 0 24 24" className="text-destructive">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path
              d="M9.17 9.17a3.001 3.001 0 0 1 5.66 0m-5.66 5.66a3.001 3.001 0 0 0 5.66 0"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold mb-2 text-destructive">403 Forbidden</h1>
        <p className="text-muted-foreground mb-6">
          You do not have permission to access this page.
          <br />
          Please contact your administrator if you believe this is a mistake.
        </p>
        <Link href="/">
          <Button variant="default" className="w-full">
            Go to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
