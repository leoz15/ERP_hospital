"use client";

import { useApp } from "@/context/AppContext";
import {
  Bell,
  Building2,
  Check,
  ChevronDown,
  Home,
  Landmark,
  LayoutGrid,
  Menu,
  Package,
  PieChart,
  Search,
  ShoppingCart,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function Topbar({ sidebarOpen = false, onMenuClick }: Readonly<{ sidebarOpen?: boolean; onMenuClick?: () => void }>) {
  const pathname = usePathname();
  const { currentUser, selectedWarehouse, setSelectedWarehouse } = useApp();
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [showAppSwitcher, setShowAppSwitcher] = useState(false);
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isHome = pathname === "/";
  const isProcurement = pathname.startsWith("/procurement");
  const isHR = pathname.startsWith("/hr");
  const isBudget = pathname.startsWith("/budget");
  const isFinance = pathname.startsWith("/finance");
  const isInventory =
    !isHome && !isProcurement && !isHR && !isBudget && !isFinance;

  useEffect(() => {
    fetch("/api/warehouses")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setWarehouses(data);
      })
      .catch(console.error);

    fetch("/api/approvals")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPendingApprovalsCount(data.length);
      })
      .catch(console.error);
  }, []);

  // Keyboard shortcut Ctrl+K to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (isHome) {
    return null;
  }

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-[#E2EAF4] px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* 1. Left: Module Switcher */}
      <div className="flex items-center shrink-0">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="เปิดเมนูระบบงาน"
          aria-expanded={sidebarOpen}
          aria-controls="application-sidebar"
          className="flex xl:hidden items-center mr-3 p-2 rounded-xl hover:bg-slate-100 text-xs font-semibold text-[#14213D] transition-all shadow-2xs"
        >
          <Menu />
        </button>
        <div className="relative">
          <button type="button"
            onClick={() => setShowAppSwitcher(!showAppSwitcher)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-[#E2EAF4] bg-[#F5F8FC] hover:bg-slate-100 text-xs font-semibold text-[#14213D] transition-all shadow-2xs"
            title="คลิกเพื่อสลับระบบงาน (App Switcher)"
          >
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center text-white shadow-xs ${getIsHomeClassName(isHome, isProcurement, isHR, isBudget, isFinance)
                }`}
            >
              {getIsHomeContent(isHome, isProcurement, isHR, isBudget, isFinance)}
            </div>
            <div className="text-left hidden sm:block">
              <span className="font-bold text-xs text-[#14213D] block leading-tight">
                {getIsHomeText(isHome, isProcurement, isHR, isBudget, isFinance)}
              </span>
              <span className="text-[10px] text-[#94A3B8] font-normal block">
                {getIsHomeText2(isHome, isProcurement, isHR, isBudget, isFinance)}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] ml-0.5" />
          </button>

          {showAppSwitcher && (
            <>
              <button type="button" aria-label="ปิดรายการสลับระบบงาน"
                className="fixed inset-0 z-40"
                onClick={() => setShowAppSwitcher(false)}
              />
              <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#E2EAF4] p-2 z-50 animate-scale-up">
                <div className="px-3 py-2 border-b border-[#E2EAF4] text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                  สลับโมดูลระบบงาน (Hospital ERP Systems)
                </div>
                <div className="p-1 space-y-1">
                  {/* 1. ERP Center */}
                  <Link
                    href="/"
                    onClick={() => setShowAppSwitcher(false)}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors ${isHome
                      ? "bg-blue-50 font-bold text-[#2563EB]"
                      : "hover:bg-[#F5F8FC] text-[#64748B]"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center">
                        <Home className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-[#14213D]">
                          ERP Center (หน้าหลัก)
                        </div>
                        <div className="text-[10px] text-[#94A3B8]">
                          ศูนย์กลางการจัดการระบบทั้งหมด
                        </div>
                      </div>
                    </div>
                    {isHome && <Check className="w-4 h-4 text-[#2563EB]" />}
                  </Link>

                  {/* 2. Inventory */}
                  <Link
                    href="/inventory"
                    onClick={() => setShowAppSwitcher(false)}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors ${isInventory
                      ? "bg-blue-50 font-bold text-[#2563EB]"
                      : "hover:bg-[#F5F8FC] text-[#64748B]"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shadow-xs">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-[#14213D]">
                          คลังสินค้าและพัสดุ (Inventory)
                        </div>
                        <div className="text-[10px] text-[#94A3B8]">
                          รับเข้า เบิกจ่าย โอนย้าย และตรวจนับ
                        </div>
                      </div>
                    </div>
                    {isInventory && (
                      <Check className="w-4 h-4 text-[#2563EB]" />
                    )}
                  </Link>

                  {/* 3. Procurement */}
                  <Link
                    href="/procurement"
                    onClick={() => setShowAppSwitcher(false)}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors ${isProcurement
                      ? "bg-orange-50 font-bold text-[#F28C28]"
                      : "hover:bg-[#F5F8FC] text-[#64748B]"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#F28C28] text-white flex items-center justify-center shadow-xs">
                        <ShoppingCart className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-[#14213D]">
                          จัดซื้อจัดจ้าง (Procurement)
                        </div>
                        <div className="text-[10px] text-[#94A3B8]">
                          แผนจัดซื้อ (PP), ขอซื้อ (PR), สั่งซื้อ (PO)
                        </div>
                      </div>
                    </div>
                    {isProcurement && (
                      <Check className="w-4 h-4 text-[#F28C28]" />
                    )}
                  </Link>

                  {/* 4. HR & Personnel */}
                  <Link
                    href="/hr"
                    onClick={() => setShowAppSwitcher(false)}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors ${isHR
                      ? "bg-teal-50 font-bold text-[#0D9488]"
                      : "hover:bg-[#F5F8FC] text-[#64748B]"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#0D9488] text-white flex items-center justify-center shadow-xs">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-[#14213D]">
                          ทรัพยากรบุคคล (Hospital HRM)
                        </div>
                        <div className="text-[10px] text-[#94A3B8]">
                          บุคลากร ตารางเวร ใบประกอบวิชาชีพ เงินเดือน
                        </div>
                      </div>
                    </div>
                    {isHR && <Check className="w-4 h-4 text-[#0D9488]" />}
                  </Link>

                  {/* 5. Budget Management */}
                  <Link
                    href="/budget"
                    onClick={() => setShowAppSwitcher(false)}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors ${isBudget
                      ? "bg-emerald-50 font-bold text-[#059669]"
                      : "hover:bg-[#F5F8FC] text-[#64748B]"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#059669] text-white flex items-center justify-center shadow-xs">
                        <PieChart className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-[#14213D]">
                          ระบบบริหารงบประมาณ (Budget)
                        </div>
                        <div className="text-[10px] text-[#94A3B8]">
                          จัดทำงบประจำปี จัดสรรวงเงิน ควบคุมผูกพัน
                        </div>
                      </div>
                    </div>
                    {isBudget && <Check className="w-4 h-4 text-[#059669]" />}
                  </Link>

                  {/* 6. Finance & Accounting (Disabled / Not Ready) */}
                  <div
                    className="flex items-center justify-between p-2.5 rounded-xl text-xs bg-slate-50/70 text-slate-400 cursor-not-allowed opacity-75 select-none"
                    title="ระบบบริหารการเงินและบัญชียังไม่เปิดใช้งาน"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-300 text-white flex items-center justify-center">
                        <Landmark className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-500">
                          การเงินและบัญชี (Finance & Accounting)
                        </div>
                        <div className="text-[10px] text-slate-400">
                          ยังไม่พร้อมใช้งาน (อยู่ระหว่างพัฒนา)
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-500 text-[9px] font-bold">
                      ปิดไว้
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2. Center: Global Search Bar */}
      <div className="hidden md:flex items-center justify-center flex-1 max-w-md lg:max-w-lg mx-2">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="ค้นหาระบบงาน, เอกสาร, หรือพัสดุ..."
            className="w-full text-xs pl-10 pr-16 py-2 bg-[#F5F8FC] hover:bg-[#EEF3F9] focus:bg-white border border-[#E2EAF4] rounded-full text-[#14213D] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition-all shadow-2xs"
          />
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono text-[#94A3B8] bg-white border border-[#E2EAF4] rounded-md shadow-2xs absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            Ctrl+K
          </kbd>
        </div>
      </div>

      {/* 3. Right: Warehouse Selector, Pending Approvals, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Warehouse Selector (Prominent Card on Right) */}
        {isInventory && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F5F8FC] hover:bg-slate-100 border border-[#E2EAF4] rounded-xl text-xs transition-all shadow-2xs">
            <Building2 className="w-4 h-4 text-[#2563EB] shrink-0" />
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="text-xs font-semibold bg-transparent text-[#14213D] focus:outline-none cursor-pointer max-w-[150px] sm:max-w-[200px] truncate"
              title="เลือกคลังสินค้าปฏิบัติการ"
            >
              <option value="">🏢 ทุกคลังสินค้า (All Warehouses)</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.code} - {w.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Notifications / Pending Approval link */}
        <Link
          href="/approvals"
          className="relative p-2 rounded-xl text-[#64748B] hover:text-[#14213D] hover:bg-[#F5F8FC] border border-transparent hover:border-[#E2EAF4] transition-all"
          title="รายการรออนุมัติ"
        >
          <Bell className="w-4 h-4" />
          {pendingApprovalsCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#EF4444] text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-xs animate-pulse">
              {pendingApprovalsCount}
            </span>
          )}
        </Link>

        {/* User Card */}
        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-[#E2EAF4]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#164EAB] to-[#2563EB] text-white font-bold text-xs flex items-center justify-center shadow-sm">
            {currentUser?.name ? currentUser.name.slice(0, 2) : "WH"}
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-[#14213D] leading-tight">
              {currentUser?.name || "ผู้ใช้งาน"}
            </div>
            <div className="text-[10px] text-[#94A3B8] font-medium">
              {currentUser?.department?.name || "โรงพยาบาล"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function getIsHomeText2(isHome: boolean, isProcurement: boolean, isHR: boolean, isBudget: boolean, isFinance: boolean) {
  if (isHome) {
    return "หน้าหลักองค์กร";
  }
  if (isProcurement) {
    return "Procurement";
  }
  if (isHR) {
    return "Human Resource (HRM)";
  }
  if (isBudget) {
    return "Budget Management";
  }
  if (isFinance) {
    return "Finance & Accounting";
  }
  return "Inventory";

}

function getIsHomeText(isHome: boolean, isProcurement: boolean, isHR: boolean, isBudget: boolean, isFinance: boolean) {
  if (isHome) {
    return "ERP Center";
  }
  if (isProcurement) {
    return "ระบบจัดซื้อจัดจ้าง";
  }
  if (isHR) {
    return "ระบบบริหารทรัพยากรบุคคล";
  }
  if (isBudget) {
    return "ระบบบริหารงบประมาณ";
  }
  if (isFinance) {
    return "ระบบบริหารการเงินและบัญชี";
  }
  return "ระบบคลังสินค้าและพัสดุ";

}

function getIsHomeContent(isHome: boolean, isProcurement: boolean, isHR: boolean, isBudget: boolean, isFinance: boolean) {
  if (isHome) {
    return <LayoutGrid className="w-3.5 h-3.5" />;
  }
  if (isProcurement) {
    return <ShoppingCart className="w-3.5 h-3.5" />;
  }
  if (isHR) {
    return <Users className="w-3.5 h-3.5" />;
  }
  if (isBudget) {
    return <PieChart className="w-3.5 h-3.5" />;
  }
  if (isFinance) {
    return <Landmark className="w-3.5 h-3.5" />;
  }
  return <Package className="w-3.5 h-3.5" />;

}

function getIsHomeClassName(isHome: boolean, isProcurement: boolean, isHR: boolean, isBudget: boolean, isFinance: boolean) {
  if (isHome) {
    return "bg-[#2563EB]";
  }
  if (isProcurement) {
    return "bg-[#F28C28]";
  }
  if (isHR) {
    return "bg-[#0D9488]";
  }
  if (isBudget) {
    return "bg-[#059669]";
  }
  if (isFinance) {
    return "bg-[#0284C7]";
  }
  return "bg-[#2563EB]";

}
