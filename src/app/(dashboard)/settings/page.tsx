"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings2, Music, Upload, Play, Square, CheckCircle2, Languages, Volume2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RINGTONES, playContinuousAlarm, stopContinuousAlarm } from "@/lib/audio-engine";

export default function SettingsPage() {
  const [selectedRingTone, setSelectedRingTone] = useState<string>("default1");
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [customUploadedName, setCustomUploadedName] = useState<string>("No custom file uploaded");
  const [voiceAlerts, setVoiceAlerts] = useState<boolean>(true);
  const [lang, setLang] = useState<string>("en");

  useEffect(() => {
    const saved = localStorage.getItem("smart_med_ringtone");
    if (saved) setSelectedRingTone(saved);
    
    const hasCustom = localStorage.getItem("smart_med_custom_audio");
    if (hasCustom) setCustomUploadedName("Active Device Audio.mp3");

    const savedVoice = localStorage.getItem("smart_med_voice_alerts");
    if (savedVoice !== null) setVoiceAlerts(savedVoice === "true");
    
    const savedLang = localStorage.getItem("smart_med_lang");
    if (savedLang) setLang(savedLang);

  }, []);

  const handleSelect = (id: string) => {
    setSelectedRingTone(id);
    localStorage.setItem("smart_med_ringtone", id);
    toast.success("Ringtone Updated");
    stopAudio();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be under 2MB for browser local storage.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Audio = event.target?.result as string;
      localStorage.setItem("smart_med_custom_audio", base64Audio);
      setCustomUploadedName(file.name);
      handleSelect("custom");
      toast.success(`Custom Audio "${file.name}" uploaded correctly!`);
    };
    reader.readAsDataURL(file);
  };

  const previewAudio = (id: string) => {
    setIsPlaying(id);
    playContinuousAlarm(id);
  };

  const stopAudio = () => {
    setIsPlaying(null);
    stopContinuousAlarm();
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-5xl font-black text-foreground tracking-tighter uppercase"
          >
            System Tuning
          </motion.h1>
          <p className="text-foreground/50 font-bold tracking-tight mt-1 text-lg">
            Configure alarms, notifications & platform preferences.
          </p>
        </div>
      </div>

      <Card className="glass-card border-none rounded-[2rem] overflow-hidden">
        <CardHeader className="bg-primary/5 pb-8">
          <CardTitle className="text-2xl font-black tracking-tighter flex items-center gap-3 uppercase text-foreground">
            <Music className="text-primary" size={28} />
            Active Alarm Ringtone
          </CardTitle>
          <p className="text-foreground/50 font-bold italic text-sm mt-2">
            The alarm will ring repetitively until you log the medicine as taken.
          </p>
        </CardHeader>
        
        <CardContent className="p-8 space-y-8">
          {/* Default Synthetic Ringtones */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {RINGTONES.filter(r => r.id !== "custom").map((tone) => (
              <div 
                key={tone.id} 
                className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${selectedRingTone === tone.id ? "border-primary bg-primary/10 shadow-lg shadow-primary/10" : "border-foreground/5 bg-foreground/5 hover:border-foreground/20"}`}
                onClick={() => handleSelect(tone.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${selectedRingTone === tone.id ? "bg-primary animate-pulse" : "bg-foreground/20"}`} />
                  <span className={`font-black tracking-tight ${selectedRingTone === tone.id ? "text-primary" : "text-foreground"}`}>
                    {tone.name}
                  </span>
                </div>
                
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={(e) => { e.stopPropagation(); isPlaying === tone.id ? stopAudio() : previewAudio(tone.id); }}
                  className="rounded-full w-10 h-10 hover:bg-foreground/10"
                >
                  {isPlaying === tone.id ? <Square size={16} className="text-destructive fill-destructive" /> : <Play size={16} className="text-foreground/60 fill-foreground/60" />}
                </Button>
              </div>
            ))}
          </div>

          <div className="w-full h-[1px] bg-foreground/10 my-4" />

          {/* Custom Upload Section */}
          <div className="flex flex-col gap-4">
             <h3 className="font-black text-xl tracking-tighter text-foreground uppercase">Upload From Device</h3>
             <div 
                className={`p-6 border-dashed border-2 rounded-2xl transition-all ${selectedRingTone === "custom" ? "border-primary bg-primary/5" : "border-foreground/20 bg-foreground/5 hover:border-primary/50"}`}
             >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                   <div className="flex items-center gap-4 w-full">
                       <label className="cursor-pointer glass-button bg-primary text-white font-black px-6 py-3 rounded-xl shadow-lg shrink-0 flex items-center gap-2 hover:bg-primary/90 transition-colors">
                           <Upload size={18} />
                           CHOOSE AUDIO
                           <input type="file" accept="audio/*" className="hidden" onChange={handleFileUpload} />
                       </label>
                       <div>
                           <p className="font-bold text-sm text-foreground/40 uppercase tracking-widest leading-tight">Current File:</p>
                           <p className="font-black text-lg text-foreground truncate max-w-[200px]">{customUploadedName}</p>
                       </div>
                   </div>

                   {/* Custom Selected Status */}
                   {selectedRingTone === "custom" ? (
                       <div className="flex items-center gap-2 text-emerald-500 font-black bg-emerald-50 px-4 py-2 rounded-xl shrink-0">
                           <CheckCircle2 size={18} /> ACTIVE RINGTONE
                       </div>
                   ) : (
                       <Button variant="outline" onClick={() => handleSelect("custom")} disabled={customUploadedName === "No custom file uploaded"} className="rounded-xl font-bold border-foreground/20 shrink-0">
                           SET AS ALARM
                       </Button>
                   )}
                   
                   <Button 
                      size="icon" 
                      variant="ghost" 
                      disabled={customUploadedName === "No custom file uploaded"}
                      onClick={(e) => { e.stopPropagation(); isPlaying === "custom" ? stopAudio() : previewAudio("custom"); }}
                      className="rounded-full w-12 h-12 hover:bg-foreground/10 shrink-0 ml-auto bg-foreground/5"
                    >
                      {isPlaying === "custom" ? <Square size={20} className="text-destructive fill-destructive" /> : <Play size={20} className="text-foreground fill-foreground" />}
                    </Button>
                </div>
             </div>
             <p className="text-xs font-bold text-foreground/40 italic">* File size strictly limited to 2MB. Stored locally on this browser.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-none rounded-[2rem] overflow-hidden mt-8">
        <CardHeader className="bg-primary/5 pb-8">
          <CardTitle className="text-2xl font-black tracking-tighter flex items-center gap-3 uppercase text-foreground">
            <Languages className="text-primary" size={28} />
            Neural AI Voice Settings
          </CardTitle>
          <p className="text-foreground/50 font-bold italic text-sm mt-2">
            The platform will physically speak your reminders out loud using AI synthesis.
          </p>
        </CardHeader>
        
        <CardContent className="p-8 space-y-8">
            <div className="flex flex-col gap-6">
                
                <div className="flex items-center justify-between p-4 rounded-2xl border-2 border-foreground/10 bg-foreground/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                            <Volume2 size={24} />
                        </div>
                        <div>
                            <h3 className="font-black text-lg tracking-tight uppercase">AI Voice Alerts</h3>
                            <p className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Enable Text-to-Speech dictation</p>
                        </div>
                    </div>
                    <Button 
                        variant={voiceAlerts ? "default" : "outline"}
                        onClick={() => {
                            const state = !voiceAlerts;
                            setVoiceAlerts(state);
                            localStorage.setItem("smart_med_voice_alerts", String(state));
                            toast.success(`Voice Alerts ${state ? 'ENABLED' : 'DISABLED'}`);
                        }}
                        className={`rounded-xl px-8 font-black ${voiceAlerts ? "bg-primary text-white shadow-lg shadow-primary/20" : ""}`}
                    >
                        {voiceAlerts ? "ENABLED" : "OFF"}
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                        onClick={() => {
                            setLang("en");
                            localStorage.setItem("smart_med_lang", "en");
                            toast.success("Language set to English");
                        }}
                        className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${lang === "en" ? "border-primary bg-primary/10" : "border-foreground/10 bg-foreground/5 hover:border-foreground/30"}`}
                    >
                        <div className={`w-4 h-4 rounded-full ${lang === "en" ? "bg-primary" : "bg-foreground/20"}`} />
                        <h3 className="font-black tracking-tighter text-xl">ENGLISH (US)</h3>
                    </div>

                    <div 
                        onClick={() => {
                            setLang("ta");
                            localStorage.setItem("smart_med_lang", "ta");
                            toast.success("Language set to Tamil");
                        }}
                        className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${lang === "ta" ? "border-primary bg-primary/10" : "border-foreground/10 bg-foreground/5 hover:border-foreground/30"}`}
                    >
                        <div className={`w-4 h-4 rounded-full ${lang === "ta" ? "bg-primary" : "bg-foreground/20"}`} />
                        <div>
                            <h3 className="font-black tracking-tighter text-xl">TAMIL (TA)</h3>
                            <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest mt-1">தமிழ்</p>
                        </div>
                    </div>
                </div>

            </div>
        </CardContent>
      </Card>
    </div>
  );
}
