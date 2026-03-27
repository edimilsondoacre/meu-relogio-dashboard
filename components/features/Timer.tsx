"use client";
import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useAudio } from "@/hooks/useAudio";
import { cn } from "@/lib/utils";

export function Timer() {
  const [initialTime, setInitialTime] = useState(300); // 5 minutes default
  const [time, setTime] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [inputHs, setInputHs] = useState("0");
  const [inputMs, setInputMs] = useState("5");
  const [inputSs, setInputSs] = useState("0");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { play, stop } = useAudio();

  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    } else if (time === 0 && isRunning) {
      setIsRunning(false);
      play();
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else if (!isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, time, play]);

  const handleStartPause = () => {
    if (time === 0) setTime(initialTime);
    setIsRunning(!isRunning);
    stop(); // stop any ringing alarm
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(initialTime);
    stop();
  };

  const applyTime = () => {
    const h = parseInt(inputHs) || 0;
    const m = parseInt(inputMs) || 0;
    const s = parseInt(inputSs) || 0;
    const totalSeconds = h * 3600 + m * 60 + s;
    if (totalSeconds > 0) {
      setInitialTime(totalSeconds);
      setTime(totalSeconds);
      setIsRunning(false);
      stop();
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progress = initialTime > 0 ? ((initialTime - time) / initialTime) * 100 : 0;
  const radius = 120;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="glass-panel p-8 md:p-12 w-full max-w-md flex flex-col items-center relative">
        {!isRunning && time === initialTime && (
          <div className="flex gap-4 mb-8">
            <div className="flex flex-col items-center">
              <label className="text-xs text-slate-400 mb-1">Horas</label>
              <input type="number" min="0" value={inputHs} onChange={(e) => setInputHs(e.target.value)} className="w-16 h-12 bg-slate-800/50 border border-slate-700 rounded-lg text-center text-xl text-white outline-none focus:border-blue-500" />
            </div>
            <div className="flex flex-col items-center">
              <label className="text-xs text-slate-400 mb-1">Minutos</label>
              <input type="number" min="0" max="59" value={inputMs} onChange={(e) => setInputMs(e.target.value)} className="w-16 h-12 bg-slate-800/50 border border-slate-700 rounded-lg text-center text-xl text-white outline-none focus:border-blue-500" />
            </div>
            <div className="flex flex-col items-center">
              <label className="text-xs text-slate-400 mb-1">Segundos</label>
              <input type="number" min="0" max="59" value={inputSs} onChange={(e) => setInputSs(e.target.value)} className="w-16 h-12 bg-slate-800/50 border border-slate-700 rounded-lg text-center text-xl text-white outline-none focus:border-blue-500" />
            </div>
            <div className="flex flex-col items-center justify-end">
              <button onClick={applyTime} className="h-12 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">Definir</button>
            </div>
          </div>
        )}

        <div className="relative flex items-center justify-center mb-10 w-64 h-64">
          <svg className="transform -rotate-90 w-64 h-64">
            <circle cx="128" cy="128" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-700/50" />
            <circle cx="128" cy="128" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className={cn("transition-all duration-1000 ease-linear", time === 0 ? "text-red-500" : "text-blue-500")} />
          </svg>
          <div className="absolute text-5xl md:text-6xl font-mono font-bold text-white tracking-tighter">
            {formatTime(time)}
          </div>
        </div>
        
        <div className="flex gap-6">
          <button onClick={handleStartPause} className={cn("w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg outline-none", isRunning ? "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 border border-amber-500/50" : "bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 border border-emerald-500/50")}>
            {isRunning ? <Pause size={32} /> : <Play size={32} className="ml-2" />}
          </button>
          
          <button onClick={handleReset} className="w-20 h-20 rounded-full flex items-center justify-center bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-600 transition-all outline-none">
            <RotateCcw size={28} />
          </button>
        </div>
      </div>
    </div>
  );
}
