"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Plus, Pill, Clock, MoreVertical, Search, Edit2, Trash2, Calendar, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Medicine } from "@/types/medicine";
import { format } from "date-fns";
import { toast } from "sonner";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function MedicinesPage() {
  const queryClient = useQueryClient();
  const { data: medicines = [], isLoading } = useQuery<Medicine[]>({
    queryKey: ["medicines"],
    queryFn: async () => {
      const res = await axios.get("/api/medicine");
      return res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/medicine/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      toast.success("Medicine entry removed from Neural Cloud.");
    },
    onError: () => {
      toast.error("Failed to delete capsule record.");
    }
  });

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-5xl font-black text-foreground tracking-tighter uppercase"
          >
            Capsule Vault
          </motion.h1>
          <p className="text-foreground/50 font-bold tracking-tight mt-1 text-lg">
            Index: <span className="text-primary italic">{medicines.length} ACTIVE RECORDS</span>
          </p>
        </div>
        <Link href="/medicines/add">
          <Button className="glass-button rounded-2xl px-8 h-12 font-black shadow-xl shadow-primary/20">
            <Plus size={20} className="mr-2" />
            INITIALIZE NEW
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4 glass-card p-2 rounded-3xl">
        <div className="flex-1 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-primary transition-colors" size={20} />
          <Input 
            placeholder="Query biological database..." 
            className="pl-14 bg-transparent border-none h-14 font-bold text-lg focus-visible:ring-0 shadow-none"
          />
        </div>
        <div className="flex gap-2 pr-2">
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-foreground/5"><LayoutGrid size={20}/></Button>
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl"><List size={20}/></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full rounded-3xl opacity-20" />
          ))
        ) : medicines.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full py-40 glass-card bg-foreground/5 border-dashed border-2 border-foreground/10 flex flex-col items-center justify-center text-center rounded-[3rem]"
          >
            <div className="bg-background p-8 rounded-[2rem] shadow-xl text-primary/30 mb-8">
              <Pill size={64} />
            </div>
            <h3 className="text-3xl font-black text-foreground tracking-tighter">VAULT EMPTY</h3>
            <p className="text-foreground/40 mt-3 max-w-sm px-6 font-bold">No biological records found in the current sector.</p>
            <Link href="/medicines/add" className="mt-10">
              <Button className="glass-button rounded-2xl px-10 h-14 font-black">
                BEGIN INITIALIZATION
              </Button>
            </Link>
          </motion.div>
        ) : (
          medicines.map((med, idx) => (
            <motion.div
                key={med.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
            >
                <Card className="glass-card border-none hover:shadow-2xl hover:translate-y-[-8px] transition-all group rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-8 pb-4">
                    <div className="flex items-start justify-between">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-lg shadow-primary/10">
                        <Pill size={28} />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="h-10 w-10 text-foreground/20 hover:bg-foreground/5 rounded-xl flex items-center justify-center outline-none">
                            <MoreVertical size={20} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass-card border-none p-2 w-48 mt-2">
                        <DropdownMenuItem className="p-3 rounded-xl font-bold flex items-center gap-3 cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">
                            <Edit2 size={16} /> Edit Data
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            className="p-3 rounded-xl font-bold flex items-center gap-3 cursor-pointer hover:bg-destructive/10 text-destructive transition-colors"
                            onClick={() => deleteMutation.mutate(med.id)}
                        >
                            <Trash2 size={16} /> Wipe Record
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </div>
                    <div className="mt-8">
                    <h3 className="text-2xl font-black text-foreground tracking-tighter uppercase leading-none">{med.name}</h3>
                    <p className="text-xs font-black text-primary/60 tracking-widest mt-2 uppercase">{med.dosage}</p>
                    </div>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-6">
                    <div className="flex flex-wrap gap-2">
                    <Badge className="bg-foreground/5 text-foreground/60 border-none px-4 py-1.5 rounded-full font-bold text-[10px] tracking-widest uppercase">
                        {med.frequency}
                    </Badge>
                    {med.schedules.map((s, i) => (
                        <Badge key={i} variant="outline" className="border-primary/20 text-primary px-3 py-1.5 rounded-full font-black text-[10px] tracking-widest flex items-center gap-2">
                        <Clock size={12} /> {s.time}
                        </Badge>
                    ))}
                    </div>
                    
                    <div className="pt-6 border-t border-foreground/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-black text-foreground/30 tracking-widest uppercase">
                        <Calendar size={14} />
                        ACT: {format(new Date(med.startDate), "MMM dd")}
                    </div>
                    <div className="font-black text-[10px] text-emerald-500 bg-emerald-50 px-4 py-2 rounded-2xl uppercase tracking-widest shadow-sm">
                        SYNK OK
                    </div>
                    </div>
                </CardContent>
                </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
