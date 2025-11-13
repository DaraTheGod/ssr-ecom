'use client';

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState } from "react";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";

export default function SuccessButton() {
  const router = useRouter();
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    if (animating) return;
    setAnimating(true);

    // ---- Confetti (2.5 s) ----
    const duration = 2500;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();

    // ---- Navigate after animation ----
    setTimeout(() => {
      router.push("/");
    }, duration);
  };

  return (
    <Button
      variant="outline"
      className="mt-4 w-full flex items-center justify-center text-lg gap-2 text-gray-700 font-khmer-toch p-6 relative overflow-hidden"
      onClick={handleClick}
      disabled={animating}
    >
      {animating ? (
        <Check className="w-6 h-6 animate-ping" />
      ) : (
        <>បានទូទាត់រួច</>
      )}
    </Button>
  );
}