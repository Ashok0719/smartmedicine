"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Pill, Shield, Bell, BarChart3, ChevronRight, TrendingUp, Sparkles, Activity, Heart, Clock } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/30">
      {/* Header */}
      <header className="px-6 lg:px-20 h-24 flex items-center justify-between fixed top-0 w-full z-50 backdrop-blur-md bg-background/30 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2.5 rounded-2xl text-white shadow-lg shadow-primary/30">
            <Pill size={24} />
          </div>
          <span className="text-2xl font-black text-foreground tracking-tighter">SmartMed</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-10 text-foreground/60 font-bold text-sm tracking-wide uppercase">
          <Link href="#features" className="hover:text-primary transition-all duration-300">Features</Link>
          <Link href="#how-it-works" className="hover:text-primary transition-all duration-300">Intelligence</Link>
          <Link href="#about" className="hover:text-primary transition-all duration-300">About</Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="font-bold text-foreground/70 hover:text-primary">Login</Button>
          </Link>
          <Link href="/register">
            <Button className="glass-button rounded-full px-8 font-bold">Start Free</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="px-6 lg:px-20 py-24 lg:py-40 relative flex flex-col items-center justify-center text-center overflow-hidden">
          {/* Animated Background Orbs */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[160px] animate-pulse -z-10" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[160px] animate-pulse delay-1000 -z-10" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 max-w-5xl"
          >
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-foreground/80 text-sm font-bold tracking-widest uppercase">
              <Sparkles size={16} className="text-accent animate-spin-slow" />
              The Future of Medication Management
            </div>
            
            <h1 className="text-6xl lg:text-9xl font-black text-foreground leading-[0.9] tracking-tighter italic">
              HEALTH<br />
              <span className="premium-gradient-text not-italic">WITHOUT</span><br />
              FORGETTING.
            </h1>
            
            <p className="text-xl lg:text-2xl text-foreground/60 max-w-3xl mx-auto font-medium leading-relaxed">
              Experience the world's most intelligent medicine companion. Powered by Neural AI to ensure 100% adherence for you and your family.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center pt-8">
              <Link href="/register">
                <Button size="lg" className="glass-button rounded-full px-12 h-16 text-xl font-black shadow-2xl shadow-primary/40 group">
                  Deploy SmartMed
                  <ChevronRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="rounded-full px-10 h-16 text-xl font-bold bg-white/5 border-white/10 text-foreground backdrop-blur-sm hover:bg-white/10 transition-all">
                Witness Demo
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Stats / Proof Section */}
        <section className="px-6 lg:px-20 py-12 relative z-10">
          <div className="glass-card max-w-7xl mx-auto rounded-[3rem] p-12 lg:p-16 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {[
              { label: "Active Users", value: "85K+", icon: Activity },
              { label: "Alerts Sent", value: "2M+", icon: Bell },
              { label: "Global Accuracy", value: "99.9%", icon: Shield },
              { label: "Life Score", value: "4.9/5", icon: Heart },
            ].map((stat, i) => (
              <div key={i} className="space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
                  <stat.icon size={24} />
                </div>
                <div className="text-4xl font-black text-foreground tracking-tighter">{stat.value}</div>
                <div className="text-sm font-bold text-foreground/40 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="px-6 lg:px-20 py-40">
          <div className="flex flex-col lg:flex-row items-end justify-between mb-24 gap-8">
            <div className="max-w-2xl space-y-6">
              <h2 className="text-5xl lg:text-7xl font-black text-foreground tracking-tighter leading-none">
                BUILT FOR THE <br/>
                <span className="text-primary italic">MODERN HUMAN.</span>
              </h2>
              <p className="text-xl text-foreground/50 font-medium">
                SmartMed isn't just an app; it's a precision medical instrument in your pocket.
              </p>
            </div>
            <div className="hidden lg:block pb-4">
              <Activity className="text-primary w-24 h-24 animate-pulse opacity-20" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { title: "Quantum Alerts", icon: Bell, desc: "Adaptive notifications that learn your schedule and nudge you perfectly.", color: "bg-blue-500" },
              { title: "Kinship Shield", icon: Shield, desc: "Seamlessly monitor family health with encrypted cross-account tracking.", color: "bg-indigo-500" },
              { title: "Neural Insights", icon: BarChart3, desc: "Deep analytical snapshots of your long-term health adherence patterns.", color: "bg-cyan-500" },
              { title: "AI Optimization", icon: Sparkles, desc: "Smart rescheduling that automatically adapts to your travel and time zones.", color: "bg-purple-500" },
              { title: "Precision Logs", icon: Clock, desc: "Millisecond tracking for clinical-grade health history reporting.", color: "bg-emerald-500" },
              { title: "Cloud Pulse", icon: Activity, desc: "Your medical data synced across all devices with zero-latency updates.", color: "bg-amber-500" }
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10 }}
                className="glass-card p-10 group"
              >
                <div className={`${feature.color} w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-inherit/20 mb-8 transition-all group-hover:scale-110 group-hover:rotate-6`}>
                  <feature.icon size={32} />
                </div>
                <h3 className="font-black text-2xl text-foreground mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-foreground/50 leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="px-6 lg:px-20 py-40">
          <div className="glass-card bg-primary text-white p-12 lg:p-32 rounded-[4rem] text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 max-w-4xl mx-auto space-y-10">
              <h2 className="text-6xl lg:text-8xl font-black tracking-tighter leading-none italic">
                READY TO BE <br/> UNSTOPPABLE?
              </h2>
              <p className="text-xl lg:text-2xl font-bold opacity-80">
                Join thousands of high-performers who trust SmartMed with their health core.
              </p>
              <Link href="/register">
                <Button size="lg" variant="secondary" className="bg-white text-primary rounded-full px-16 h-20 text-2xl font-black hover:bg-white/90 transition-all shadow-white/20 shadow-2xl uppercase tracking-widest">
                  Initialize Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 lg:px-20 py-24 bg-foreground text-background">
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-24">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-3 rounded-2xl text-white">
                <Pill size={32} />
              </div>
              <span className="text-4xl font-black tracking-tighter">SmartMed</span>
            </div>
            <p className="max-w-sm text-lg font-medium opacity-60 italic">
              Empowering human biology with neural precision.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-20">
            <div className="space-y-6 text-sm font-bold tracking-widest uppercase">
              <h4 className="text-primary">System</h4>
              <nav className="flex flex-col gap-4 opacity-70">
                <Link href="#" className="hover:opacity-100 italic transition-all">Status</Link>
                <Link href="#" className="hover:opacity-100 italic transition-all">Security</Link>
                <Link href="#" className="hover:opacity-100 italic transition-all">API Docs</Link>
              </nav>
            </div>
            <div className="space-y-6 text-sm font-bold tracking-widest uppercase">
              <h4 className="text-primary">Legal</h4>
              <nav className="flex flex-col gap-4 opacity-70">
                <Link href="#" className="hover:opacity-100 italic transition-all">Privacy</Link>
                <Link href="#" className="hover:opacity-100 italic transition-all">Terms</Link>
                <Link href="#" className="hover:opacity-100 italic transition-all">Cookies</Link>
              </nav>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-xs font-black tracking-[0.3em] uppercase opacity-40 border-t border-white/5 pt-12">
          <span>Neural Lab Project 2026</span>
          <span>Designed with Passion for Living</span>
        </div>
      </footer>
    </div>
  );
}
