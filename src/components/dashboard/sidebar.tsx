"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Pill, 
  BarChart3, 
  Settings, 
  PlusCircle,
  Activity,
  LogOut,
  Users
} from "lucide-react";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";

const routes = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "My Medicines",
    icon: Pill,
    href: "/medicines",
  },
  {
    label: "Add Medicine",
    icon: PlusCircle,
    href: "/medicines/add",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    href: "/analytics",
  },
  {
    label: "Family / Caregivers",
    icon: Users,
    href: "/caregivers",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex flex-col w-72 bg-white/40 backdrop-blur-xl border-r border-foreground/5 h-full">
      <div className="p-8 pb-10">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="bg-primary p-2.5 rounded-2xl text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <Activity size={24} />
          </div>
          <span className="text-2xl font-black text-foreground tracking-tighter">SmartMed</span>
        </Link>
      </div>
      
      <div className="flex-1 px-4 space-y-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-4 px-6 py-4 rounded-3xl transition-all duration-300 group relative overflow-hidden",
              pathname === route.href 
                ? "bg-primary text-white shadow-lg shadow-primary/25" 
                : "text-foreground/50 hover:bg-foreground/5 hover:text-foreground"
            )}
          >
            <route.icon size={22} className={cn(
              "transition-transform group-hover:scale-110",
              pathname === route.href ? "text-white" : "text-primary/70"
            )} />
            <span className="font-bold tracking-tight">{route.label}</span>
            
            {pathname === route.href && (
              <motion.div 
                layoutId="active-pill"
                className="absolute right-2 w-1 h-6 bg-white/40 rounded-full"
              />
            )}
          </Link>
        ))}
      </div>

      <div className="p-6 border-t border-foreground/5">
        <button 
          onClick={() => signOut()}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-3xl text-foreground/40 hover:text-destructive hover:bg-destructive/5 transition-all duration-300 group"
        >
          <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold tracking-tight">System Logout</span>
        </button>
      </div>
    </div>
  );
}
