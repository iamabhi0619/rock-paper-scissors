"use client";
import LoadingPage from "@/components/pages/LoadingPage";
import { useEffect } from "react";
import { Toaster } from "sonner";

import { useUserStore } from "@/store/user";
import Socket from "./Socket";

function INIT({ children }) {
  const { fetchUser, loading } = useUserStore();
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  
  if (loading) return <LoadingPage />;
  
  return (
    <Socket>
      <Toaster 
        position="top-right" 
        expand={true}
        richColors={true}
        closeButton={true}
      />
      {children}
    </Socket>
  );
}

export default INIT;
