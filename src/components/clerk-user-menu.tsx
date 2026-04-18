"use client";

import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function ClerkUserMenu() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex h-9 w-[140px] shrink-0 items-center justify-end">
        <span className="text-xs text-slate-500 dark:text-slate-400">…</span>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-2">
      {!isSignedIn ? (
        <>
          <SignInButton mode="redirect" forceRedirectUrl="/">
            <Button variant="outline" size="sm" className="border-slate-300 dark:border-slate-600">
              Sign in
            </Button>
          </SignInButton>
          <SignUpButton mode="redirect" forceRedirectUrl="/">
            <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
              Sign up
            </Button>
          </SignUpButton>
        </>
      ) : (
        <UserButton afterSignOutUrl="/" />
      )}
    </div>
  );
}
