"use client";

import { useSession } from "next-auth/react";
import { 
  Bell, 
  Search, 
  User,
  Settings,
  Sparkles,
  Menu
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="h-24 px-6 md:px-10 flex items-center justify-between border-b border-foreground/5 bg-background/50 backdrop-blur-md sticky top-0 z-40">
      <div className="flex-1 max-w-xl hidden md:flex items-center relative group">
        <Search className="absolute left-4 text-foreground/30 group-focus-within:text-primary transition-colors" size={18} />
        <Input 
          placeholder="Search prescriptions or AI insights..." 
          className="glass-input h-12 pl-12 rounded-2xl w-full border-none shadow-sm focus-visible:ring-1 focus-visible:ring-primary/20"
        />
        <div className="absolute right-4 text-[10px] font-black tracking-widest text-foreground/20 border border-foreground/10 px-2 py-1 rounded bg-foreground/5 uppercase">
          Ctrl + K
        </div>
      </div>

      {/* Mobile Menu Icon */}
      <Button variant="ghost" size="icon" className="lg:hidden">
        <Menu size={24} />
      </Button>

      <div className="flex items-center gap-6">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="ghost" size="icon" className="relative group p-0 w-12 h-12 rounded-2xl bg-foreground/5 hover:bg-primary/10 transition-colors">
            <Bell size={20} className="text-foreground/60 group-hover:text-primary transition-colors" />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-accent rounded-full border-2 border-background animate-pulse" />
          </Button>
        </motion.div>

        <div className="h-8 w-[1px] bg-foreground/5 mx-2" />

        <DropdownMenu>
          <DropdownMenuTrigger className="p-0.5 rounded-2xl hover:bg-foreground/5 transition-all outline-none">
              <div className="flex items-center gap-3 pr-2">
                <Avatar className="h-11 w-11 rounded-xl shadow-md border border-white/20">
                  <AvatarImage src={session?.user?.image || ""} />
                  <AvatarFallback className="bg-primary text-white font-black text-xs uppercase">
                    {session?.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start leading-none gap-1">
                  <p className="font-black text-sm text-foreground tracking-tight">
                    {session?.user?.name}
                  </p>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest opacity-70">
                    Pro Patient
                  </p>
                </div>
              </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 glass-card border-none mt-2 p-2">
            <DropdownMenuLabel className="p-3 font-black text-xs uppercase tracking-widest opacity-40">Account Profile</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-foreground/5" />
            <DropdownMenuItem className="p-3 rounded-xl font-bold flex items-center gap-3 cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">
              <User size={18} /> My Account
            </DropdownMenuItem>
            <DropdownMenuItem className="p-3 rounded-xl font-bold flex items-center gap-3 cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">
              <Sparkles size={18} className="text-accent" /> Neural AI Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="p-3 rounded-xl font-bold flex items-center gap-3 cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors text-foreground/60">
              <Settings size={18} /> Security
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
