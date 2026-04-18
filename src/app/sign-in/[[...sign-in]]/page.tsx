import { SignIn } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";

export default function SignInPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 dark:from-slate-950 dark:to-slate-900">
      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>
      <SignIn routing="path" path="/sign-in" />
    </div>
  );
}
