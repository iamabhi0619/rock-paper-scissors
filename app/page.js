"use client";
import { Suspense } from "react";
import GamePage from "@/components/pages/GamePage";

export default function Home() {
  return (
    <Suspense>
      <GamePage />
    </Suspense>
  );
}
