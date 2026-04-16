"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle2, Loader2, ScanLine } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Tesseract from "tesseract.js";
import { motion, AnimatePresence } from "framer-motion";

export function OCRScanner({ onExtracted }: { onExtracted: (data: any) => void }) {
    const [isScanning, setIsScanning] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsScanning(true);
        setProgress(0);

        try {
            const result = await Tesseract.recognize(
                file,
                'eng',
                { logger: m => {
                    if (m.status === 'recognizing text') {
                        setProgress(Math.round(m.progress * 100));
                    }
                }}
            );

            const text = result.data.text.toLowerCase();
            console.log("OCR Extracted Text:", text);

            let name = "";
            let dosage = "";
            let frequency = "daily";

            const doseMatch = text.match(/\b\d+\s*(mg|ml|mcg|g)\b/);
            if (doseMatch) dosage = doseMatch[0].toUpperCase();

            if (text.includes("twice") || text.includes("bd") || text.includes("b.i.d")) frequency = "twice daily";
            else if (text.includes("thrice") || text.includes("tds")) frequency = "thrice daily";
            else if (text.includes("weekly")) frequency = "weekly";

            const lines = text.split('\n').filter(l => l.trim() !== "");
            if (lines.length > 0) {
                const doseLine = lines.find(l => l.includes("mg") || l.includes("ml"));
                if (doseLine) {
                    const tokens = doseLine.trim().split(' ');
                    const matchIdx = tokens.findIndex(t => t.toLowerCase().includes("mg") || t.toLowerCase().includes("ml"));
                    if (matchIdx > 0) {
                        name = tokens[matchIdx - 1].replace(/[^a-zA-Z]/g, '').toUpperCase();
                    } else {
                        name = tokens[0].toUpperCase();
                    }
                } else {
                    name = lines[0].split(' ')[0].toUpperCase();
                }
            }

            toast.success("Prescription Analyzed!", {
                description: `System Detected: ${name || "Unknown Meds"} | ${dosage || "Unknown Dose"}`
            });

            onExtracted({ name, dosage, frequency });
        } catch (error) {
            toast.error("OCR Extraction Failed.");
        } finally {
            setIsScanning(false);
        }
    }

    return (
        <div className="w-full glass-card border-dashed border-2 p-8 rounded-[2rem] relative overflow-hidden group hover:border-primary/50 transition-colors shadow-none mb-8">
            <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleUpload}
                disabled={isScanning}
            />
            
            <div className="flex flex-col items-center justify-center text-center gap-4">
                <AnimatePresence mode="wait">
                    {isScanning ? (
                        <motion.div 
                            key="scanning"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="relative flex items-center justify-center"
                        >
                            <ScanLine size={48} className="text-primary animate-pulse" />
                            <div className="absolute inset-0 ring-4 ring-primary/20 rounded-full animate-ping" />
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="idle"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform"
                        >
                            <UploadCloud size={32} />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div>
                    <h3 className="font-black text-xl tracking-tighter text-foreground uppercase">
                        {isScanning ? `NEURAL SCANNING DATA... ${progress}%` : "Auto-Fill via Prescription"}
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-foreground/40 mt-1">
                        {isScanning ? "Extracting physical parameters to cloud" : "Drag & Drop Image or Click to Scan"}
                    </p>
                </div>
                
                {isScanning && (
                    <div className="w-full h-2 bg-foreground/5 rounded-full overflow-hidden mt-4">
                        <motion.div 
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
