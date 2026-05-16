import { AppleHelloEnglishEffect } from "@/components/animations/apple-hello-effect";
import { ThemeToggle } from "@/components/theme/theme-toogle";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <ThemeToggle />
      {/* <AppleHelloEnglishEffect color="red" /> */}
    </div>
  );
}
