"use client";

import { motion } from "framer-motion";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-5xl font-black tracking-tighter premium-gradient-text"
          >
            SmartMed
          </motion.h1>
          <p className="text-foreground/60 mt-2 font-medium tracking-wide">
            Your AI Intelligent Health Ally
          </p>
        </div>
        
        {children}
      </motion.div>
      
      {/* Footer Branding */}
      <div className="absolute bottom-6 text-foreground/40 text-xs font-semibold tracking-widest uppercase">
        Powered by Neural AI
      </div>
    </div>
  );
}
