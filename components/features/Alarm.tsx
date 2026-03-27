import { cn } from "@/lib/utils";
"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Bell, BellOff } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAudio } from "@/hooks/useAudio";
import { format } from "date-fns";

interface AlarmType {
  id: string;
  time: string; // HH:mm format
  isActive: boolean;
  label: string;
}

export function Alarm() {
  const [alarms, setAlarms, isClient] = useLocalStorage<AlarmType[]>("timeDashAlarms", []);
  const [newTime, setNewTime] = useState("08:00");
  const [newLabel, setNewLabel] = useState("");
  const { play, stop } = useAudio();
  const [ringingAlarmId, setRingingAlarmId] = useState<string | null>(null);

  useEffect(() => {
    if (!isClient) return;
    
    const checkAlarms = setInterval(() => {
      const now = new Date();
      const currentTimeStr = format(now, "HH:mm");
      const currentSeconds = now.getSeconds();

      if (currentSeconds === 0) { // Check only at the start of a minute
        const ringing = alarms.find(a => a.isActive && a.time === currentTimeStr);
        if (ringing) {
          play();
          setRingingAlarmId(ringing.id);
          // Optional: auto-disable or keep it active for next day
        }
      }
    }, 1000);

    return () => clearInterval(checkAlarms);
  }, [alarms, isClient, play]);

  const addAlarm = () => {
    const newAlarm: AlarmType = {
      id: Date.now().toString(),
      time: newTime,
      isActive: true,
      label: newLabel || "Alarme",
    };
    setAlarms([...alarms, newAlarm].sort((a, b) => a.time.localeCompare(b.time)));
    setNewLabel("");
  };

  const toggleAlarm = (id: string) => {
    setAlarms(alarms.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(alarms.filter(a => a.id !== id));
    if (ringingAlarmId === id) stopRinging();
  };

  const stopRinging = () => {
    stop();
    setRingingAlarmId(null);
  };

  if (!isClient) return null;

  return (
    <div className="h-full flex flex-col items-center justify-start p-4 md:p-8 animate-in fade-in duration-500 overflow-y-auto custom-scrollbar">
      <div className="glass-panel p-6 md:p-8 w-full max-w-2xl flex flex-col">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Bell className="text-blue-400" />
          Gerenciar Alarmes
        </h2>

        {ringingAlarmId && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center justify-between animate-pulse">
            <div>
              <p className="text-red-400 font-bold text-lg">Alarme tocando!</p>
              <p className="text-red-300">{alarms.find(a => a.id === ringingAlarmId)?.label}</p>
            </div>
            <button onClick={stopRinging} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-lg">
              Parar
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <input 
            type="time" 
            value={newTime} 
            onChange={(e) => setNewTime(e.target.value)}
            className="h-12 bg-slate-900 border border-slate-700 rounded-lg px-4 text-xl text-white outline-none focus:border-blue-500" 
          />
          <input 
            type="text" 
            placeholder="Rótulo (ex: Acordar)" 
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="h-12 flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 text-white outline-none focus:border-blue-500"
          />
          <button 
            onClick={addAlarm}
            className="h-12 px-6 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium whitespace-nowrap"
          >
            <Plus size={20} /> Adicionar
          </button>
        </div>

        <div className="space-y-3">
          {alarms.length === 0 ? (
            <p className="text-slate-400 text-center py-8">Nenhum alarme configurado.</p>
          ) : (
            alarms.map(alarm => (
              <div key={alarm.id} className={cn("flex items-center justify-between p-4 rounded-xl border transition-all", alarm.isActive ? "bg-slate-800/80 border-slate-700" : "bg-slate-800/30 border-slate-800 opacity-60")}>
                <div className="flex items-center gap-4">
                  <button onClick={() => toggleAlarm(alarm.id)} className={cn("p-2 rounded-full transition-colors", alarm.isActive ? "text-blue-400 hover:bg-blue-400/10" : "text-slate-500 hover:bg-slate-700")}>
                    {alarm.isActive ? <Bell size={24} /> : <BellOff size={24} />}
                  </button>
                  <div>
                    <div className="text-3xl font-mono text-white font-medium">{alarm.time}</div>
                    <div className="text-slate-400 text-sm mt-1">{alarm.label}</div>
                  </div>
                </div>
                <button onClick={() => deleteAlarm(alarm.id)} className="p-3 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
