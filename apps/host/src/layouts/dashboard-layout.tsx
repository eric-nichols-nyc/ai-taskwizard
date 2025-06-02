import React, { useState } from "react";
import { Sidebar } from "../components/sidebar";
import { useMediaQuery } from "../hooks/use-media-query";
import { IconMenu } from "@tabler/icons-react";

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [overlayOpen, setOverlayOpen] = useState(false);

  return (
    <div className="flex h-screen w-full relative">
      {isDesktop ? (
        <Sidebar />
      ) : (
        <>
          <button
            className="fixed top-4 left-4 z-50 p-2 rounded-md bg-[#18181b] text-gray-300 shadow-lg"
            onClick={() => setOverlayOpen(true)}
            aria-label="Open navigation"
          >
            <IconMenu size={28} />
          </button>
          {overlayOpen && (
            <Sidebar variant="overlay" onClose={() => setOverlayOpen(false)} />
          )}
        </>
      )}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
};