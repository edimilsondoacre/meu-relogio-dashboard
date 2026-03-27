"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function DigitalClock() {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="glass-panel p-12 text-center space-y-4 shadow-[0_0_50px_rgba(37,99,235,0.1)]">
        <h1 className="text-7xl md:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 drop-shadow-lg font-mono">
          {format(time, "HH:mm:ss")}
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 font-medium capitalize mt-4">
          {format(time, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </div>
    </div>
  );
}
