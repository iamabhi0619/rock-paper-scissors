"use client";
import LoadingPage from "@/components/pages/LoadingPage";
import { useEffect } from "react";
import { Toaster } from "sonner";

import { useUserStore } from "@/store/user";
import AuthForm from "@/components/pages/Auth";
import Socket from "./Socket";

function INIT({ children }) {
  const { fetchUser, loading, isAuthenticated } = useUserStore();
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  
  if (loading) return <LoadingPage />;
  if (!isAuthenticated) return <AuthForm />;
  
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
