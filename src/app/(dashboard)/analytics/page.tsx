"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Calendar,
  Filter,
  BarChart3,
  Dna,
  ShieldCheck,
  BrainCircuit,
  DownloadCloud,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const monthlyData = [
  { month: 'Jan', taken: 0, missed: 0 },
  { month: 'Feb', taken: 0, missed: 0 },
  { month: 'Mar', taken: 0, missed: 0 },
  { month: 'Apr', taken: 0, missed: 0 },
  { month: 'May', taken: 0, missed: 0 },
  { month: 'Jun', taken: 0, missed: 0 },
];

const medicineDistribution = [
  { name: 'Synched', value: 0, color: 'oklch(0.55 0.25 260)' },
  { name: 'Deferred', value: 0, color: 'oklch(0.6 0.2 190)' },
  { name: 'Anomaly', value: 0, color: '#ef4444' },
];

export default function AnalyticsPage() {
  const [isExporting, setIsExporting] = useState(false);

  const exportPDF = async () => {
    setIsExporting(true);
    // Let the button animate briefly
    toast("Compiling Biological Data...", { description: "Generating secure PDF report layout." });
    
    setTimeout(async () => {
      try {
        const element = document.getElementById("analytics-dashboard");
        if (!element) return;
        
        const canvas = await html2canvas(element, { 
          scale: 2, 
          useCORS: true,
          backgroundColor: "#ffffff",
        });
        
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("Neural_Diagnostics_Report.pdf");
        
        toast.success("Export Complete!", { description: "Report downloaded successfully."});
      } catch (err) {
        toast.error("Generation Failed", { description: "Could not export PDF report." });
      } finally {
        setIsExporting(false);
      }
    }, 500);
  };

  return (
    <div id="analytics-dashboard" className="space-y-10 p-2 bg-background">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6" data-html2canvas-ignore>
        {/* Wrapped header to hide buttons in PDF if needed, though they look cool */}
        <div>
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-5xl font-black text-foreground tracking-tighter uppercase"
          >
            Neural Diagnostics
          </motion.h1>
          <p className="text-foreground/50 font-bold tracking-tight mt-1 text-lg">
            Analytics Node: <span className="text-primary italic">ACTIVE</span> • Deep biological data analysis.
          </p>
        </div>
        <div className="flex gap-4">
          <Button 
            onClick={exportPDF} 
            disabled={isExporting} 
            className="bg-primary hover:bg-primary/90 text-white font-black rounded-2xl h-12 px-6 shadow-xl shadow-primary/20 transition-all"
          >
            {isExporting ? <Loader2 className="animate-spin mr-2" size={18} /> : <DownloadCloud size={18} className="mr-2" />}
            EXPORT PDF
          </Button>
          <Button variant="outline" className="glass-input border-foreground/10 text-foreground/60 font-bold rounded-2xl h-12">
            <Calendar size={18} className="mr-2" />
            HISTORY: 30D
          </Button>
          <Button variant="outline" className="hidden lg:flex glass-input border-foreground/10 text-foreground/60 font-bold rounded-2xl h-12">
            <Filter size={18} className="mr-2" />
            CATEGORY: ALL
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <Card className="border-none shadow-2xl bg-primary text-white overflow-hidden relative rounded-[2.5rem] h-full group">
              <div className="absolute -right-12 -bottom-12 opacity-10 rotate-12 transition-transform group-hover:scale-110">
                <Dna size={240} />
              </div>
              <CardContent className="p-10 relative z-10">
                <p className="text-white/60 font-black text-xs uppercase tracking-[0.2em]">Neural Adherence</p>
                <h3 className="text-7xl font-black mt-4 tracking-tighter italic">0%</h3>
                <div className="mt-8 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs font-black">
                  <TrendingUp size={14} className="text-accent" /> 0% IMPROVEMENT
                </div>
              </CardContent>
            </Card>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <Card className="glass-card border-none p-4 rounded-[2.5rem] h-full flex items-center">
              <CardContent className="p-6 flex items-center gap-8 w-full">
                <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-3xl flex items-center justify-center shrink-0 shadow-lg shadow-destructive/10">
                  <XCircle size={36} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">Anomalies</p>
                  <h3 className="text-4xl font-black mt-2 text-foreground tracking-tighter italic">0 MISSED</h3>
                  <p className="text-xs font-bold text-foreground/40 mt-1 uppercase tracking-wider">Last 720 Hours</p>
                </div>
              </CardContent>
            </Card>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            <Card className="glass-card border-none p-4 rounded-[2.5rem] h-full flex items-center">
              <CardContent className="p-6 flex items-center gap-8 w-full">
                <div className="w-20 h-20 bg-accent/10 text-accent rounded-3xl flex items-center justify-center shrink-0 shadow-lg shadow-accent/10">
                  <ShieldCheck size={36} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">Stability Streak</p>
                  <h3 className="text-4xl font-black mt-2 text-foreground tracking-tighter italic">00 DAYS</h3>
                  <p className="text-xs font-bold text-foreground/40 mt-1 uppercase tracking-wider">Best: 0D</p>
                </div>
              </CardContent>
            </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Card className="glass-card border-none p-10 rounded-[3rem]">
          <CardHeader className="px-0 pt-0 pb-10">
            <CardTitle className="text-2xl font-black tracking-tighter flex items-center gap-4 uppercase">
                <BarChart3 className="text-primary" />
                Biological Drift Trend
            </CardTitle>
            <CardDescription className="text-foreground/40 font-bold uppercase text-[10px] tracking-widest italic">Taken vs Missing Doses / 180 Day Horizon</CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="h-[380px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="oklch(0.2 0.1 260 / 0.05)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'oklch(0.2 0.1 260 / 0.3)', fontWeight: 800, fontSize: 10 }} dy={15} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '10px' }}
                  />
                  <Legend verticalAlign="top" height={40} iconType="circle" wrapperStyle={{ fontWeight: 'black', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }} />
                  <Line type="monotone" dataKey="taken" stroke="oklch(0.55 0.25 260)" strokeWidth={6} dot={{ r: 8, fill: 'oklch(0.55 0.25 260)', strokeWidth: 4, stroke: '#fff' }} activeDot={{ r: 12 }} />
                  <Line type="monotone" dataKey="missed" stroke="#ef4444" strokeWidth={6} dot={{ r: 8, fill: '#ef4444', strokeWidth: 4, stroke: '#fff' }} activeDot={{ r: 12 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-none p-10 rounded-[3rem]">
          <CardHeader className="px-0 pt-0 pb-10">
            <CardTitle className="text-2xl font-black tracking-tighter flex items-center gap-4 uppercase">
                <BrainCircuit className="text-primary" />
                Dose Composition
            </CardTitle>
            <CardDescription className="text-foreground/40 font-bold uppercase text-[10px] tracking-widest italic">Global Sector Analysis / Adherence Mix</CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0 flex flex-col items-center">
            <div className="h-[300px] w-full relative">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                        <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">Quality</p>
                        <p className="text-3xl font-black text-foreground tracking-tighter uppercase italic">00/100</p>
                    </div>
                </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={medicineDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={90}
                    outerRadius={120}
                    paddingAngle={10}
                    dataKey="value"
                  >
                    {medicineDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 w-full gap-8 mt-12 bg-foreground/5 p-8 rounded-[2rem]">
              {medicineDistribution.map((item, i) => (
                <div key={i} className="text-center">
                  <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">{item.name}</p>
                  <p className="text-2xl font-black text-foreground mt-2 tracking-tighter uppercase italic">{item.value}%</p>
                  <div className="w-full h-1 mt-3 rounded-full overflow-hidden bg-foreground/5">
                      <div className="h-full" style={{ backgroundColor: item.color, width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
