"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Medicine } from "@/types/medicine";
import { format } from "date-fns";
import { toast } from "sonner";
import { Pill, AlertTriangle } from "lucide-react";

import { playContinuousAlarm, stopContinuousAlarm } from "@/lib/audio-engine";

export function AlarmSystem() {
    const { data: medicines = [] } = useQuery<Medicine[]>({
        queryKey: ["medicines"],
        queryFn: async () => {
            const res = await axios.get("/api/medicine");
            return res.data;
        },
        refetchInterval: 15000 // Check database every 15s instead of 60s
    });

    useEffect(() => {
        if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission();
        }

        const interval = setInterval(() => {
            const now = new Date();
            const currentTimeStr = format(now, "HH:mm");
            const todayStr = format(now, "yyyy-MM-dd");

            const triggeredKey = `alarms_triggered_${todayStr}`;
            const triggeredStrs = localStorage.getItem(triggeredKey);
            const triggered = triggeredStrs ? JSON.parse(triggeredStrs) : [];

            let alarmFired = false;

            console.log(`[AlarmSystem] Checking time: ${currentTimeStr} against ${medicines.length} medicines.`);

            medicines.forEach((med) => {
                if (med.schedules) {
                    med.schedules.forEach((schedule) => {
                        // Ensure we remove any whitespace just in case
                        const schedTime = schedule.time.trim();
                        
                        if (schedTime === currentTimeStr) {
                            const alarmId = `${med.id}_${schedTime}`;

                            if (!triggered.includes(alarmId)) {
                                console.log(`[AlarmSystem] MATCH FOUND! Firing alarm for ${med.name} at ${schedTime}`);
                                
                                triggered.push(alarmId);
                                alarmFired = true;

                                // Visual Web Toast
                                toast.custom((id) => (
                                    <div className="glass-card shadow-2xl p-6 flex flex-col gap-4 border-2 border-primary/50 relative overflow-hidden w-[350px] bg-white">
                                        <div className="absolute inset-0 bg-primary/10 animate-pulse pointer-events-none" />
                                        <div className="relative z-10 flex gap-4 items-center">
                                            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white shadow-[0_0_30px_rgba(var(--primary),0.8)] animate-bounce shrink-0">
                                                <Pill size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-black uppercase tracking-tighter text-xl text-slate-900 leading-none">DOSAGE ALARM</h3>
                                                <p className="font-bold text-xs uppercase tracking-widest text-primary/80 mt-1">{med.name} - {med.dosage}</p>
                                            </div>
                                        </div>
                                        <div className="relative z-10 p-3 bg-slate-100 rounded-xl flex items-center gap-2 text-slate-700 border border-slate-200">
                                            <AlertTriangle size={16} className="text-amber-500" />
                                            <span className="text-xs font-bold tracking-widest uppercase">Scheduled Time: {schedTime}</span>
                                        </div>
                                        <div className="relative z-10 flex gap-2">
                                            <button onClick={() => { toast.dismiss(id); stopContinuousAlarm(); }} className="flex-1 bg-primary text-white hover:bg-primary/90 rounded-xl h-10 font-black text-xs uppercase tracking-widest shadow-md transition-all">
                                                Log as Taken
                                            </button>
                                        </div>
                                    </div>
                                ), {
                                    duration: 60000, // Stays visible tracking for 60s
                                    position: "top-center"
                                });

                                // System Level Browser OS Notification
                                if ("Notification" in window && Notification.permission === "granted") {
                                    new Notification(`Time to take ${med.name}!`, {
                                        body: `Dosage: ${med.dosage} is scheduled for ${schedTime}.`,
                                        icon: "/favicon.ico",
                                        requireInteraction: true 
                                    });
                                }
                                
                                // Neural Voice Alerts (Text-to-Speech)
                                const voiceEnabled = localStorage.getItem("smart_med_voice_alerts") !== "false";
                                const lang = localStorage.getItem("smart_med_lang") || "en";
                                
                                if (voiceEnabled && "speechSynthesis" in window) {
                                    const synth = window.speechSynthesis;
                                    let utteranceText = `Alert: It is time to take your ${med.name}. Dosage is ${med.dosage}.`;
                                    
                                    if (lang === "ta") {
                                        // "Time to take your [medicine]" in Tamil
                                        utteranceText = `உங்கள் ${med.name} மாத்திரை சாப்பிடும் நேரம் வந்துவிட்டது.`;
                                    }
                                    
                                    const utterance = new SpeechSynthesisUtterance(utteranceText);
                                    utterance.lang = lang === "ta" ? "ta-IN" : "en-US";
                                    utterance.rate = 0.9;
                                    
                                    // Delay speech briefly so the ringtone starts first
                                    setTimeout(() => {
                                        synth.speak(utterance);
                                    }, 1000);
                                }
                            }
                        }
                    })
                }
            });

            if (alarmFired) {
                localStorage.setItem(triggeredKey, JSON.stringify(triggered));
                playContinuousAlarm();
            }

        }, 5000); // Check every 5 seconds for extreme reliability

        return () => clearInterval(interval);
    }, [medicines]);

    return null;
}
