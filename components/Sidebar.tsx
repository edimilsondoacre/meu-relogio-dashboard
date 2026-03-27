import { 
  Clock, 
  Calendar as CalendarIcon, 
  Timer as TimerIcon, 
  Hourglass, 
  AlarmClock 
} from "lucide-react";
import { cn } from "@/lib/utils";

export type Tab = "clock" | "calendar" | "stopwatch" | "timer" | "alarm";

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const tabs = [
    { id: "clock", label: "Relógio", icon: Clock },
    { id: "calendar", label: "Calendário", icon: CalendarIcon },
    { id: "stopwatch", label: "Cronômetro", icon: TimerIcon },
    { id: "timer", label: "Timer", icon: Hourglass },
    { id: "alarm", label: "Alarme", icon: AlarmClock },
  ];

  return (
    <nav className="flex md:flex-col gap-2 p-4 md:w-64 glass-panel m-4 md:h-[calc(100vh-2rem)] overflow-x-auto custom-scrollbar z-10">
      <div className="hidden md:block mb-8 mt-4 px-4 text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
        TimeDash
      </div>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 md:justify-start justify-center flex-shrink-0 min-w-[120px] md:min-w-0 outline-none",
              isActive 
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.15)] bg-opacity-50" 
                : "hover:bg-white/5 text-slate-400 hover:text-slate-200"
            )}
          >
            <Icon size={20} className={cn(isActive && "drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]")} />
            <span className="font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
