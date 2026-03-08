"use client";
import { Toaster } from "sonner";
import Socket from "./Socket";

function INIT({ children }) {
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
