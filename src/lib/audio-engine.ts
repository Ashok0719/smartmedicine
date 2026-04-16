"use client";

export const RINGTONES = [
  { id: "default1", name: "Classic Beep" },
  { id: "default2", name: "Urgent Pulse" },
  { id: "default3", name: "Gentle Chime" },
  { id: "default4", name: "Sci-Fi Scan" },
  { id: "default5", name: "Radar Sweep" },
  { id: "default6", name: "Digital Watch" },
  { id: "default7", name: "Sonar Ping" },
  { id: "default8", name: "Retro Arcade" },
  { id: "default9", name: "Emergency Siren" },
  { id: "default10", name: "Soft Marimba" },
  { id: "custom", name: "Custom Device Upload" }
];

let activeCustomAudio: HTMLAudioElement | null = null;
let synthInterval: NodeJS.Timeout | null = null;

export const stopContinuousAlarm = () => {
    if (activeCustomAudio) {
        activeCustomAudio.pause();
        activeCustomAudio.currentTime = 0;
        activeCustomAudio = null;
    }
    if (synthInterval) {
        clearInterval(synthInterval);
        synthInterval = null;
    }
};

export const playContinuousAlarm = (previewToneId?: string) => {
    stopContinuousAlarm(); 

    const selected = previewToneId || localStorage.getItem("smart_med_ringtone") || "default1";
    
    // Handle Custom Uploads First
    if (selected === "custom") {
        const customBase64 = localStorage.getItem("smart_med_custom_audio");
        if (customBase64) {
            activeCustomAudio = new Audio(customBase64);
            activeCustomAudio.loop = true; // Loops until stopped
            activeCustomAudio.play().catch(e => console.error("Custom Audio Blocked", e));
            return;
        }
    }

    // Web Audio Synthesizer Engine for Defaults
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const triggerSynthSequence = () => {
        const now = ctx.currentTime;

        const playNote = (freq: number, type: OscillatorType, startTime: number, duration: number) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = type;
            osc.frequency.setValueAtTime(freq, startTime);
            
            gain.gain.setValueAtTime(1, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
            
            osc.start(startTime);
            osc.stop(startTime + duration);
        };

        switch(selected) {
            case "default2": // Urgent Pulse
                playNote(600, 'sawtooth', now, 0.1);
                playNote(800, 'sawtooth', now + 0.15, 0.1);
                playNote(600, 'sawtooth', now + 0.3, 0.1);
                break;
            case "default3": // Gentle Chime
                playNote(880, 'sine', now, 0.4);
                playNote(1108, 'sine', now + 0.2, 0.4); // Major 3rd
                break;
            case "default4": // Sci-Fi Scan
                playNote(400, 'sine', now, 0.1);
                playNote(1200, 'sine', now + 0.1, 0.1);
                playNote(400, 'sine', now + 0.2, 0.1);
                break;
            case "default5": // Radar Sweep
                playNote(900, 'triangle', now, 0.05);
                break;
            case "default6": // Digital Watch
                playNote(2000, 'square', now, 0.05);
                playNote(2000, 'square', now + 0.1, 0.05);
                break;
            case "default7": // Sonar Ping
                playNote(1200, 'sine', now, 0.6);
                break;
            case "default8": // Retro Arcade
                playNote(300, 'square', now, 0.1);
                playNote(450, 'square', now + 0.1, 0.1);
                playNote(600, 'square', now + 0.2, 0.1);
                break;
            case "default9": // Emergency Siren
                playNote(800, 'sawtooth', now, 0.4);
                playNote(500, 'sawtooth', now + 0.4, 0.4);
                break;
            case "default10": // Soft Marimba
                playNote(523, 'sine', now, 0.2); // C5
                playNote(659, 'sine', now + 0.2, 0.2); // E5
                playNote(783, 'sine', now + 0.4, 0.2); // G5
                break;
            default: // default1 (Classic Beep)
                playNote(880, 'sine', now, 0.2);
                break;
        }
    }

    triggerSynthSequence();
    
    // Set continuous loop!
    const loopIntervals: Record<string, number> = {
        "default1": 1000,
        "default2": 800,
        "default3": 2000,
        "default4": 1500,
        "default5": 2000,
        "default6": 1000,
        "default7": 3000,
        "default8": 1500,
        "default9": 800,
        "default10": 2000,
    };
    
    synthInterval = setInterval(() => {
        triggerSynthSequence();
    }, loopIntervals[selected] || 1500); 
};
