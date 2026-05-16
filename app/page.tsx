import { AppleHelloEnglishEffect } from "@/components/animations/apple-hello-effect";
import { ThemeToggle } from "@/components/theme/theme-toogle";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <AppleHelloEnglishEffect />
      </div>
    </main>
  );
}
