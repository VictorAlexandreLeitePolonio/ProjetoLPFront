"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

interface SidebarLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  collapsed?: boolean;
}

export function SidebarLink({ href, label, icon, collapsed }: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <motion.div 
      whileHover={{ x: collapsed ? 0 : 2 }} 
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Link
        href={href}
        title={collapsed ? label : undefined}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-all
          ${collapsed ? "justify-center" : ""}
          ${isActive
            ? "bg-[#1a4a3a] text-white border-2 border-[#143d2f] shadow-[2px_2px_0_0_#143d2f]"
            : "text-[#1a2a4a] hover:bg-[#e2ebe6] border-2 border-transparent"
          }`}
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {icon}
        {!collapsed && <span>{label}</span>}
      </Link>
    </motion.div>
  );
}
