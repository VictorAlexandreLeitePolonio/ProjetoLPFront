"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useAuth } from "@/contexts/AuthContext";
import { useLogout } from "@/app/(public)/login/hooks/logout";
import { useRouter } from "next/navigation";
import { SidebarLink } from "./SidebarLink";
import logo from "@/../public/logoLaiza.png";
import {
  Home,
  Users,
  Calendar,
  FileText,
  CreditCard,
  ClipboardList,
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BarChart2,
} from "lucide-react";
import Image from "next/image";

const baseModules = [
  { href: "/bem-vindo", label: "Início", icon: <Home size={18} /> },
  { href: "/pacientes", label: "Pacientes", icon: <Users size={18} /> },
  { href: "/agenda", label: "Agenda", icon: <Calendar size={18} /> },
  { href: "/prontuarios", label: "Prontuários", icon: <FileText size={18} /> },
];

const adminModules = [
  { href: "/pagamentos", label: "Pagamentos", icon: <CreditCard size={18} /> },
  { href: "/financeiro", label: "Financeiro", icon: <BarChart2 size={18} /> },
  { href: "/usuarios", label: "Usuários", icon: <Shield size={18} /> },
  { href: "/planos", label: "Planos", icon: <ClipboardList size={18} /> },
];

export function Sidebar() {
  const { user, setUser } = useAuth();
  const { logoutUser } = useLogout();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const modules = user?.role === "Admin"
    ? [...baseModules, ...adminModules]
    : baseModules;

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    router.replace("/login");
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="flex flex-col min-h-screen bg-[#f0f4f2] border-r-2 border-[#1a2a4a] px-3 py-6 overflow-hidden"
    >
      {/* Logo + botão colapsar */}
      <div className={`flex items-center mb-8 px-1 ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed && (
          <div 
            className="w-10 h-10 rounded-sm flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #1a4a3a 0%, #143d2f 100%)",
              border: "2px solid #1a2a4a",
              boxShadow: "2px 2px 0 0 #1a2a4a",
            }}
          >
           <Image src={logo} alt="Logo" width={40} height={40} className="object-contain" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-sm text-[#1a2a4a] hover:bg-[#e2ebe6] transition-colors border border-transparent hover:border-[#1a2a4a]/20"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Módulos */}
      <nav className="flex flex-col gap-1 flex-1">
        {modules.map((mod) => (
          <SidebarLink key={mod.href} {...mod} collapsed={collapsed} />
        ))}
      </nav>

      {/* Divisor */}
      <div className="h-px bg-[#1a2a4a]/20 my-4 mx-2" />

      {/* Sair */}
      <motion.button
        whileHover={{ x: collapsed ? 0 : 2 }}
        onClick={handleLogout}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-semibold uppercase tracking-wider
          text-red-700 hover:bg-red-50 transition-colors border-2 border-transparent hover:border-red-200
          ${collapsed ? "justify-center" : ""}`}
        style={{ fontFamily: "var(--font-serif)" }}
        title={collapsed ? "Sair" : undefined}
      >
        <LogOut size={18} />
        {!collapsed && <span>Sair</span>}
      </motion.button>
    </motion.aside>
  );
}
