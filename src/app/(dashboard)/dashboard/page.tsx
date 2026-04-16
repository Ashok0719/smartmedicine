"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Pill,
  Calendar as CalendarIcon,
  Plus,
  Zap,
  BrainCircuit,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { format } from "date-fns";
import { Medicine } from "@/types/medicine";
import Link from "next/link";
import { motion } from "framer-motion";

const data = [
  { name: "Mon", score: 85 },
  { name: "Tue", score: 70 },
  { name: "Wed", score: 90 },
  { name: "Thu", score: 85 },
  { name: "Fri", score: 95 },
  { name: "Sat", score: 80 },
  { name: "Sun", score: 88 },
];

export default function DashboardPage() {
  const { data: medicines = [], isLoading: loadingMeds, refetch: refetchMeds } = useQuery<Medicine[]>({
    queryKey: ["medicines-today"],
    queryFn: async () => {
      const res = await axios.get("/api/medicine");
      return res.data;
    }
  });

  const { data: logs = [], isLoading: loadingLogs, refetch: refetchLogs } = useQuery<any[]>({
    queryKey: ["all-logs"],
    queryFn: async () => {
      const res = await axios.get("/api/log");
      return res.data;
    }
  });

  const noData = medicines.length === 0;

  // Real Stats Calculations
  const totalSchedules = medicines.reduce((acc, med) => acc + (med.schedules?.length || 0), 0);
  const takenTodayCount = logs.filter(log => 
    log.status === "taken" && 
    format(new Date(log.timestamp), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
  ).length;

  const successRate = totalSchedules > 0 
    ? Math.round((takenTodayCount / totalSchedules) * 100) 
    : 0;

  const stats = [
    { 
      label: "Today's Target", 
      value: totalSchedules.toString(), 
      sub: `${medicines.length} Medicines Active`, 
      icon: Pill, 
      color: "text-blue-600", 
      bg: "bg-blue-100" 
    },
    { 
      label: "Success Rate", 
      value: `${successRate}%`, 
      sub: successRate > 0 ? "Daily Fulfillment" : "No logs today", 
      icon: CheckCircle2, 
      color: "text-emerald-600", 
      bg: "bg-emerald-100" 
    },
    { 
      label: "Live Alerts", 
      value: totalSchedules.toString(), 
      sub: "Active reminders", 
      icon: AlertCircle, 
      color: "text-amber-600", 
      bg: "bg-amber-100" 
    },
    { 
      label: "Health Score", 
      value: successRate >= 90 ? "A+" : successRate >= 70 ? "B" : "C-", 
      sub: `Neural Score: ${successRate}`, 
      icon: BrainCircuit, 
      color: "text-purple-600", 
      bg: "bg-purple-100" 
    },
  ];

  // Behavior Chart: Last 7 Days
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayLabel = days[d.getDay()];
    const dateStr = format(d, "yyyy-MM-dd");
    const count = logs.filter(l => l.status === "taken" && format(new Date(l.timestamp), "yyyy-MM-dd") === dateStr).length;
    return { name: dayLabel, score: count, fullDate: dateStr };
  });

  const handleLogAction = async (medicineId: string) => {
    try {
      await axios.post("/api/log", { medicineId, status: "taken" });
      refetchLogs();
      refetchMeds();
    } catch (err) {
      console.error("LOG_ERROR", err);
    }
  };

  const nextEvents = medicines
    .flatMap(med => med.schedules?.map(s => ({ 
      id: med.id,
      time: s.time, 
      name: med.name, 
      dose: med.dosage, 
      type: med.frequency, 
      priority: "HIGH" 
    })) || [])
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 5);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-5xl font-black text-foreground tracking-tighter uppercase"
          >
            Vital Core
          </motion.h1>
          <p className="text-foreground/50 font-bold tracking-tight mt-1 text-lg">
            {noData ? "Bio-Database: EMPTY • Waiting for neural input." : "Status: OPTIMAL • Welcome back to your health nexus."}
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="hidden lg:flex glass-input border-foreground/10 text-foreground/60 font-bold rounded-2xl h-12">
            <CalendarIcon size={18} className="mr-2" />
            {format(new Date(), "EEE, MMM dd")}
          </Button>
          <Link href="/medicines/add">
            <Button className="glass-button rounded-2xl px-6 h-12 font-black shadow-xl shadow-primary/20">
              <Plus size={20} className="mr-2" />
              ADD DOSE
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="glass-card border-none hover:translate-y-[-5px] transition-all cursor-default group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black text-foreground/40 uppercase tracking-widest">{stat.label}</p>
                    <h3 className="text-3xl font-black mt-2 text-foreground tracking-tighter">{stat.value}</h3>
                    <p className="text-[10px] font-bold text-foreground/30 uppercase mt-1 tracking-wider">{stat.sub}</p>
                  </div>
                  <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12`}>
                    <stat.icon size={22} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glass-card border-none overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-8">
            <CardTitle className="text-xl font-black tracking-tighter flex items-center gap-3">
              <TrendingUp className="text-primary" size={24} />
              NEURAL ADHERENCE FLOW
            </CardTitle>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <div className="w-3 h-3 rounded-full bg-foreground/10" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last7Days}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.55 0.25 260)" />
                      <stop offset="100%" stopColor="oklch(0.55 0.25 260 / 0.5)" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="oklch(0.2 0.1 260 / 0.05)" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'oklch(0.2 0.1 260 / 0.4)', fontSize: 12, fontWeight: 800 }} 
                    dy={15}
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'oklch(0.2 0.1 260 / 0.02)' }}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255,255,255,0.8)', 
                      backdropFilter: 'blur(10px)',
                      borderRadius: '20px', 
                      border: '1px solid rgba(255,255,255,0.2)', 
                      boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                      fontWeight: 'bold'
                    }}
                  />
                  <Bar dataKey="score" radius={[8, 8, 8, 8]} barSize={40}>
                    {last7Days.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.score > 0 ? 'url(#barGradient)' : 'oklch(0.2 0.1 260 / 0.1)'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-none flex flex-col h-full overflow-hidden">
          <CardHeader className="bg-primary/5 pb-6">
            <CardTitle className="text-xl font-black tracking-tighter flex items-center gap-3 uppercase">
              <Clock className="text-primary" size={24} />
              Next Events
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col">
            <div className="flex-1 p-6 space-y-8">
              {nextEvents.length === 0 ? (
                 <div className="flex-1 flex flex-col items-center text-center justify-center py-10 opacity-50">
                     <div className="w-16 h-16 bg-foreground/5 rounded-full flex items-center gap-2 justify-center text-foreground/40 mb-4">
                        <Pill size={24} />
                     </div>
                     <p className="font-black text-foreground/60 tracking-tighter uppercase text-lg">No Events</p>
                     <p className="font-bold text-[10px] text-foreground/40 tracking-widest uppercase mt-2">Initialize a dose to map timeline</p>
                 </div>
              ) : (
                  nextEvents.map((dose, i) => (
                    <div key={i} className="flex gap-6 relative group">
                    <div className="flex flex-col items-center">
                        <div className={cn(
                        "w-4 h-4 rounded-full border-4 border-background shadow-lg z-10",
                        dose.priority === "HIGH" ? "bg-primary" : "bg-accent"
                        )} />
                        <div className="w-0.5 h-full bg-foreground/5 absolute top-2 group-last:hidden" />
                    </div>
                    <div className="flex-1 pb-2">
                        <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black text-primary tracking-widest">{dose.time}</span>
                        <span className="text-[8px] font-black bg-foreground/5 px-2 py-0.5 rounded uppercase">{dose.priority}</span>
                        </div>
                        <h4 className="font-extrabold text-foreground tracking-tight text-lg leading-tight uppercase">{dose.name}</h4>
                        <p className="text-[10px] font-bold text-foreground/40 tracking-wider">
                        {dose.dose} • {dose.type}
                        </p>
                        <div className="mt-4 flex gap-2">
                        <Button onClick={() => handleLogAction(dose.id)} size="sm" className="glass-button h-9 rounded-xl px-4 text-[10px] font-black tracking-widest">LOG DOSE</Button>
                        <Button size="sm" variant="secondary" className="bg-foreground/5 hover:bg-foreground/10 text-foreground/50 h-9 rounded-xl px-4 text-[10px] font-black tracking-widest border-none">SNOOZE</Button>
                        </div>
                    </div>
                    </div>
                  ))
              )}
            </div>
            
            <div className="p-6 pt-0 mt-auto">
              <div className="p-5 rounded-3xl bg-accent/10 border border-accent/20 flex items-center gap-4">
                <Zap className="text-accent h-6 w-6 animate-pulse" />
                <div>
                  <p className="text-[10px] font-black text-accent uppercase tracking-widest">Neural Insight</p>
                  <p className="text-xs font-bold text-foreground/70">
                    {takenTodayCount === 0 ? "Awaiting sufficient biological data points." : `You have successfully taken ${takenTodayCount} doses today.`}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
