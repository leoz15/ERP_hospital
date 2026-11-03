"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MainContent } from "./MainContent";

export function ApplicationShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const isOpen = openPath === pathname && pathname !== "/";
  const contentRef = useRef<HTMLDivElement>(null);
  const closeSidebar = useCallback(() => setOpenPath(null), []);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1280px)");
    const close = () => setOpenPath(null);
    desktop.addEventListener("change", close);
    return () => desktop.removeEventListener("change", close);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    contentRef.current?.setAttribute("inert", "");
    return () => {
      document.body.style.overflow = previousOverflow;
      contentRef.current?.removeAttribute("inert");
    };
  }, [isOpen]);

  return (
    <div className="flex min-h-screen bg-[#F5F8FC]">
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/40 xl:hidden" onClick={() => setOpenPath(null)} aria-hidden="true" />
      )}
      <Sidebar mobileOpen={isOpen} onClose={closeSidebar} />
      <div ref={contentRef} className="flex-1 flex flex-col min-w-0">
        <Topbar sidebarOpen={isOpen} onMenuClick={() => setOpenPath(isOpen ? null : pathname)} />
        <MainContent>{children}</MainContent>
      </div>
    </div>
  );
}
