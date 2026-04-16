"use client";

import { useEffect, useState, useCallback } from "react";
import { Mic, MicOff, Settings, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    // Initialize Web Speech API
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = false;
        // Tamil and English language support
        recog.lang = navigator.language.includes("ta") ? "ta-IN" : "en-US";

        recog.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcriptValue = event.results[current][0].transcript.toLowerCase();
          setTranscript(transcriptValue);
          handleVoiceCommand(transcriptValue);
        };

        recog.onerror = (event: any) => {
          console.error("Voice Recognition Error", event.error);
          setIsListening(false);
          toast.error("Audio protocol failed. Please clear background noise.");
        };

        recog.onend = () => {
          setIsListening(false);
        };

        setRecognition(recog);
      } else {
        console.warn("Web Speech API not supported in this browser.");
      }
    }
  }, []);

  const handleVoiceCommand = useCallback((command: string) => {
    // Basic AI intent extraction
    if (command.includes("mark as taken") || command.includes("i took my medicine") || command.includes("மாத்திரை சாப்பிட்டேன்")) {
      toast.success("Voice Command Registered", {
        description: "Executing: Mark current dose as TAKEN."
      });
      // In full implementation, fire Axios patch to /api/log here
    } 
    else if (command.includes("skip") || command.includes("skip medicine") || command.includes("வேண்டாம்")) {
      toast.warning("Voice Command Registered", {
        description: "Executing: SKIPPED current dose."
      });
    }
    else if (command.includes("remind") || command.includes("later") || command.includes("அப்புறம் பார்க்கலாம்")) {
      toast.info("Voice Command Registered", {
        description: "Executing: Snoozing alert for 30 minutes."
      });
    }
    else {
      toast("Neural Voice Engine", {
        description: `Unrecognized phrase: "${command}". Please use targeted syntax.`,
      });
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) {
      toast.error("Voice engine incompatible with your hardware/browser.");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        // Recognition already started
        setIsListening(true);
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-4">
      <AnimatePresence>
        {isListening && (
          <motion.div 
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className="glass-card p-4 rounded-3xl flex items-center gap-4 bg-background/80 backdrop-blur-xl border border-primary/20 shadow-[0_10px_40px_rgba(var(--primary),0.2)]"
          >
            <div className="flex gap-1.5 h-6 items-center">
                <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 bg-primary rounded-full" />
                <motion.div animate={{ height: [12, 24, 12] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1.5 bg-primary rounded-full" />
                <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1.5 bg-primary rounded-full" />
            </div>
            <div className="flex flex-col mr-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Neural Voice Active</span>
                <span className="text-xs font-bold text-foreground/50 line-clamp-1 max-w-[120px]">Listening for directives...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div whileTap={{ scale: 0.9 }}>
        <Button 
          onClick={toggleListening}
          size="icon" 
          className={`h-16 w-16 rounded-[2rem] shadow-2xl transition-all duration-500 border border-white/10 ${
            isListening 
              ? "bg-primary hover:bg-primary shadow-primary/40 animate-pulse outline outline-4 outline-primary/20" 
              : "glass-card bg-foreground/5 hover:bg-primary/10 hover:border-primary/30"
          }`}
        >
          {isListening ? (
            <Activity className="h-6 w-6 text-white" />
          ) : (
            <Mic className="h-6 w-6 text-foreground" />
          )}
        </Button>
      </motion.div>
    </div>
  );
}
