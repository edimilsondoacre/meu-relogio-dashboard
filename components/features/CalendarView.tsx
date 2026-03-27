"use client";
import { useState } from "react";
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  eachDayOfInterval, isSameMonth, isSameDay, 
  addYears, subYears, eachMonthOfInterval, startOfYear, endOfYear, 
  startOfWeek, endOfWeek, addWeeks, subWeeks, addDays, subDays 
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ViewType = "year" | "month" | "week" | "day";

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>("month");

  const views: { id: ViewType; label: string }[] = [
    { id: "day", label: "Dia" },
    { id: "week", label: "Semana" },
    { id: "month", label: "Mês" },
    { id: "year", label: "Ano" },
  ];

  const handlePrevious = () => {
    if (view === "month") setCurrentDate(subMonths(currentDate, 1));
    if (view === "year") setCurrentDate(subYears(currentDate, 1));
    if (view === "week") setCurrentDate(subWeeks(currentDate, 1));
    if (view === "day") setCurrentDate(subDays(currentDate, 1));
  };

  const handleNext = () => {
    if (view === "month") setCurrentDate(addMonths(currentDate, 1));
    if (view === "year") setCurrentDate(addYears(currentDate, 1));
    if (view === "week") setCurrentDate(addWeeks(currentDate, 1));
    if (view === "day") setCurrentDate(addDays(currentDate, 1));
  };

  const renderHeader = () => {
    let title = "";
    if (view === "month") title = format(currentDate, "MMMM yyyy", { locale: ptBR });
    if (view === "year") title = format(currentDate, "yyyy");
    if (view === "week") {
      const start = startOfWeek(currentDate, { locale: ptBR });
      const end = endOfWeek(currentDate, { locale: ptBR });
      title = `${format(start, "d MMM", { locale: ptBR })} - ${format(end, "d MMM yyyy", { locale: ptBR })}`;
    }
    if (view === "day") title = format(currentDate, "EEEE, d 'de' MMMM yyyy", { locale: ptBR });

    return (
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white capitalize flex items-center gap-3 tracking-tight">
          <CalendarIcon className="text-blue-400" size={28} />
          {title}
        </h2>
        <div className="flex bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/50 shadow-lg hidden md:flex">
          {views.map((v) => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                view === v.id ? "bg-blue-600 text-white shadow-md shadow-blue-900/50" : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={handlePrevious} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors border border-slate-700 text-slate-300">
            <ChevronLeft size={20} />
          </button>
          <button onClick={handleNext} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors border border-slate-700 text-slate-300">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  const renderDaysOfWeek = () => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const days = isMobile ? ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] : ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    return (
      <div className="grid grid-cols-7 gap-2 mb-4">
        {days.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-slate-500 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderMonthView = () => {
    const start = startOfWeek(startOfMonth(currentDate), { locale: ptBR });
    const end = endOfWeek(endOfMonth(currentDate), { locale: ptBR });
    const days = eachDayOfInterval({ start, end });

    return (
      <div className="w-full h-full flex flex-col animate-in fade-in duration-300">
        {renderDaysOfWeek()}
        <div className="grid grid-cols-7 gap-2 flex-1 auto-rows-fr">
          {days.map((day, idx) => {
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentDate);
            return (
              <div
                key={idx}
                className={cn(
                  "p-2 rounded-xl border transition-all flex flex-col items-center justify-center relative min-h-[60px] md:min-h-[80px]",
                  isCurrentMonth ? "bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/80" : "bg-transparent border-transparent opacity-40 text-slate-600",
                  isToday && "bg-blue-600/20 border-blue-500/50 text-blue-100 shadow-[0_0_15px_rgba(37,99,235,0.1)] ring-1 ring-blue-500/50"
                )}
              >
                <span className={cn("text-lg", isToday ? "font-bold text-blue-400" : "font-medium")}>{format(day, "d")}</span>
                {isToday && <div className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,1)]"></div>}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderYearView = () => {
    const months = eachMonthOfInterval({
      start: startOfYear(currentDate),
      end: endOfYear(currentDate),
    });

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in duration-300">
        {months.map((month, idx) => {
          const isCurrentMonth = isSameMonth(month, new Date());
          return (
            <div
              key={idx}
              onClick={() => {
                setCurrentDate(month);
                setView("month");
              }}
              className={cn(
                "p-6 rounded-2xl border flex items-center justify-center cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl",
                isCurrentMonth ? "bg-blue-600/20 border-blue-500/50 text-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.15)] ring-1 ring-blue-500/30" : "bg-slate-800/40 border-slate-700/50 text-slate-300 hover:bg-slate-800"
              )}
            >
              <span className="text-xl font-medium capitalize">{format(month, "MMMM", { locale: ptBR })}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const start = startOfWeek(currentDate, { locale: ptBR });
    const end = endOfWeek(currentDate, { locale: ptBR });
    const days = eachDayOfInterval({ start, end });

    return (
      <div className="flex flex-col h-full animate-in fade-in duration-300">
        <div className="grid grid-cols-7 gap-4 flex-1">
          {days.map((day, idx) => {
            const isToday = isSameDay(day, new Date());
            return (
              <div key={idx} className={cn("flex flex-col items-center p-4 rounded-2xl border transition-all", isToday ? "bg-blue-600/20 border-blue-500/50 shadow-lg text-blue-100" : "bg-slate-800/40 border-slate-700/50 text-slate-300")}>
                <span className="text-sm uppercase tracking-wider text-slate-500 mb-2">{format(day, "EEE", { locale: ptBR })}</span>
                <span className={cn("text-3xl font-bold rounded-full w-12 h-12 flex items-center justify-center", isToday ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]" : "")}>{format(day, "d")}</span>
                
                {/* Placeholder for week events */}
                <div className="flex-1 w-full mt-6 border-t border-slate-700/50 pt-4 flex flex-col gap-2">
                  <div className="w-full h-px bg-slate-800 border-b border-dashed border-slate-700/50 mb-4"></div>
                  <div className="w-full h-px bg-slate-800 border-b border-dashed border-slate-700/50 mb-4"></div>
                  <div className="w-full h-px bg-slate-800 border-b border-dashed border-slate-700/50"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    return (
      <div className="flex flex-col h-full animate-in fade-in duration-300 p-8 glass-panel border border-slate-700/50 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none"></div>
        <div className="flex items-end gap-6 mb-8">
          <span className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">{format(currentDate, "d")}</span>
          <div className="flex flex-col mb-2">
            <span className="text-3xl font-medium text-slate-300 capitalize">{format(currentDate, "MMMM", { locale: ptBR })}</span>
            <span className="text-xl text-slate-500">{format(currentDate, "yyyy")}</span>
          </div>
        </div>
        
        <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-800 p-6 flex flex-col overflow-y-auto custom-scrollbar">
          <p className="text-slate-400 text-center mt-20 italic">Agenda diária em breve.</p>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8 overflow-hidden">
      <div className="glass-panel p-6 md:p-8 w-full max-w-6xl mx-auto flex-1 flex flex-col min-h-0 bg-opacity-70">
        {renderHeader()}
        
        {/* Mobile view selector */}
        <div className="flex md:hidden bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/50 mb-6 overflow-x-auto custom-scrollbar">
          {views.map((v) => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                view === v.id ? "bg-blue-600 text-white" : "text-slate-400"
              )}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar md:pr-2">
          {view === "year" && renderYearView()}
          {view === "month" && renderMonthView()}
          {view === "week" && renderWeekView()}
          {view === "day" && renderDayView()}
        </div>
      </div>
    </div>
  );
}
