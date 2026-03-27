"use client";
import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Flag } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stopwatch() {
  const [time, setTime] = useState(0); // in milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10);
    } else if (!isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
  };

  const handleStartPause = () => setIsRunning(!isRunning);
  
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    setLaps((prev) => [time, ...prev]);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="glass-panel p-8 md:p-12 w-full max-w-md flex flex-col items-center">
        <div className="text-5xl md:text-7xl font-mono font-bold text-white mb-10 tracking-tighter">
          {formatTime(time)}
        </div>
        
        <div className="flex gap-6 mb-8">
          <button
            onClick={handleStartPause}
            className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg outline-none",
              isRunning 
                ? "bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/50" 
                : "bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 border border-emerald-500/50"
            )}
          >
            {isRunning ? <Pause size={32} /> : <Play size={32} className="ml-2" />}
          </button>
          
          <button
            onClick={isRunning ? handleLap : handleReset}
            disabled={!isRunning && time === 0}
            className="w-20 h-20 rounded-full flex items-center justify-center bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all outline-none"
          >
            {isRunning ? <Flag size={28} /> : <RotateCcw size={28} />}
          </button>
        </div>

        {laps.length > 0 && (
          <div className="w-full max-h-[40vh] overflow-y-auto custom-scrollbar border-t border-slate-700 pt-6">
            {laps.map((lapTime, index) => {
              const previousLap = laps[index + 1] || 0;
              const diff = lapTime - previousLap;
              return (
                <div key={index} className="flex justify-between items-center py-3 border-b border-slate-700/50 text-slate-300">
                  <span className="font-medium text-slate-400">Volta {laps.length - index}</span>
                  <span className="font-mono text-sm">+{formatTime(diff)}</span>
                  <span className="font-mono font-medium text-white">{formatTime(lapTime)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
