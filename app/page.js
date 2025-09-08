"use client";
import GamePage from "@/components/pages/GamePage";
import { useUserStore } from "@/store/user";

export default function Home() {
  const { isAuthenticated } = useUserStore();
  
  if (!isAuthenticated) {
    return null;
  }
  
  return <GamePage />;
}
