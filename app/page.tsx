"use client";
import { useState } from "react";
import { Sidebar, Tab } from "@/components/Sidebar";
import { DigitalClock } from "@/components/features/DigitalClock";
import { Stopwatch } from "@/components/features/Stopwatch";
import { Timer } from "@/components/features/Timer";
import { Alarm } from "@/components/features/Alarm";
import { CalendarView } from "@/components/features/CalendarView";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("clock");

  return (
    <main className="flex flex-col md:flex-row h-screen bg-slate-950 text-slate-50 overflow-hidden relative selection:bg-blue-500/30">
      {/* Background decorations for Glassmorphism feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-[40%] left-[60%] w-[20%] h-[20%] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none mix-blend-screen" />

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 relative overflow-hidden z-10 transition-all duration-300">
        {activeTab === "clock" && <DigitalClock />}
        {activeTab === "calendar" && <CalendarView />}
        {activeTab === "stopwatch" && <Stopwatch />}
        {activeTab === "timer" && <Timer />}
        {activeTab === "alarm" && <Alarm />}
      </div>
    </main>
  );
}
