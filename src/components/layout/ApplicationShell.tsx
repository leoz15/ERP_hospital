"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { MainContent } from "./MainContent";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function ApplicationShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const isOpen = openPath === pathname && pathname !== "/";
  const contentRef = useRef<HTMLDivElement>(null);
  const closeSidebar = useCallback(() => setOpenPath(null), []);

  useEffect(() => setOpenPath(null), [pathname]);

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
      {isOpen ? (
        <dialog open aria-label="เมนูระบบงาน" aria-modal="true" className="fixed inset-0 z-50 m-0 h-[100dvh] max-h-none w-[17rem] max-w-[85vw] border-0 bg-transparent p-0 overflow-visible xl:hidden">
          <Sidebar mobileOpen onClose={closeSidebar} />
        </dialog>
      ) : <Sidebar onClose={closeSidebar} />}
      <div ref={contentRef} className="flex-1 flex flex-col min-w-0">
        <Topbar sidebarOpen={isOpen} onMenuClick={() => setOpenPath(isOpen ? null : pathname)} />
        <MainContent>{children}</MainContent>
      </div>
    </div>
  );
}
