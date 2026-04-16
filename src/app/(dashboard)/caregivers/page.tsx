"use client";

import { motion } from "framer-motion";
import { Users, Link as LinkIcon, PhoneCall, ShieldAlert, HeartPulse, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function CaregiverPage() {
    const [email, setEmail] = useState("");
    const [linkedUsers, setLinkedUsers] = useState<any[]>([]);

    const handleLink = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        toast.success(`Invitation Sent to ${email}`, { description: "Once accepted, their schedules will sync here." });
        
        // Mock linking a new user locally
        setLinkedUsers([...linkedUsers, {
            id: Math.random(),
            name: email.split("@")[0].toUpperCase(),
            status: "Linked • No Data",
            statusColor: "text-amber-500",
            adherence: "0%",
            lastActive: "Just now"
        }]);

        setEmail("");
    };

    return (
        <div className="space-y-10 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <motion.h1 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="text-5xl font-black text-foreground tracking-tighter uppercase"
                    >
                        Family Node
                    </motion.h1>
                    <p className="text-foreground/50 font-bold tracking-tight mt-1 text-lg">
                        Caregiver network: <span className="text-primary italic">ONLINE</span> • Real-time patient monitoring.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button variant="default" className="bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl h-12">
                        <ShieldAlert size={18} className="mr-2" />
                        Trigger Emergency Broadcast
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-2 mb-6">
                        <HeartPulse size={24} className="text-primary" />
                        <h2 className="text-2xl font-black tracking-tighter uppercase">My Patients</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {linkedUsers.length === 0 ? (
                            <div className="col-span-1 md:col-span-2 py-10 border-2 border-dashed border-foreground/10 rounded-3xl flex flex-col items-center justify-center text-center opacity-60">
                                <Users size={48} className="mb-4 text-foreground/40" />
                                <h3 className="font-black tracking-tighter text-2xl uppercase">No Patients Linked</h3>
                                <p className="font-bold text-xs mt-2 uppercase tracking-widest">Send a connection code to begin monitoring</p>
                            </div>
                        ) : (
                            linkedUsers.map((user) => (
                            <motion.div 
                                key={user.id}
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <Card className="glass-card border-none rounded-[2rem] overflow-hidden group cursor-pointer hover:shadow-2xl hover:shadow-primary/10 transition-all">
                                    <CardContent className="p-8">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center text-2xl font-black text-foreground">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-foreground/5 ${user.statusColor}`}>
                                                {user.status}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-black text-2xl tracking-tight text-foreground truncate">{user.name}</h3>
                                            <p className="font-bold text-sm text-foreground/40 mt-1 uppercase tracking-widest">{user.lastActive}</p>
                                        </div>
                                        
                                        <div className="mt-8 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-emerald-500 font-black text-xl italic">{user.adherence}</span>
                                                <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Adherence</span>
                                            </div>
                                            <Button variant="ghost" size="icon" className="group-hover:bg-primary group-hover:text-white rounded-full h-10 w-10 transition-colors">
                                                <ExternalLink size={18} />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-6">
                        <LinkIcon size={24} className="text-primary" />
                        <h2 className="text-2xl font-black tracking-tighter uppercase">Link Patient</h2>
                    </div>

                    <Card className="glass-card border-none rounded-[2rem] p-8">
                        <form onSubmit={handleLink} className="space-y-6">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50">
                                    Patient Email or Link Code
                                </label>
                                <Input 
                                    className="h-14 rounded-2xl bg-white border-none shadow-inner" 
                                    placeholder="Enter connection code..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest hover:bg-primary/90 shadow-xl shadow-primary/20">
                                Send Invite
                            </Button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-foreground/5 space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-foreground/40 text-center">Your Caregiver ID</h3>
                            <div className="bg-foreground/5 rounded-2xl py-4 flex items-center justify-center gap-4 cursor-pointer hover:bg-foreground/10" onClick={() => {
                                navigator.clipboard.writeText("CG-9482-XA");
                                toast("ID Copied to clipboard");
                            }}>
                                <span className="font-mono text-2xl font-black text-foreground tracking-widest">CG-9482-XA</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="glass-card border-none rounded-[2rem] p-8 bg-primary text-white relative overflow-hidden">
                        <div className="absolute -right-8 -bottom-8 opacity-10">
                            <Users size={180} />
                        </div>
                        <div className="relative z-10">
                            <PhoneCall size={32} className="mb-4" />
                            <h3 className="text-xl font-black tracking-tight mb-2">Emergency Contacts</h3>
                            <p className="text-white/70 font-bold text-sm mb-6">
                                Adding a caregiver ensures that someone is always notified if multiple doses are highly delayed.
                            </p>
                            <Button variant="secondary" className="w-full h-12 rounded-xl font-black bg-white text-primary hover:bg-white/90">
                                Manage Contacts
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
