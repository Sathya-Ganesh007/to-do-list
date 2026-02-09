"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { createClient } from "@/lib/supabase/client";
import {
  Plus,
  Search,
  X,
  Check,
  Trash2,
  ArrowUpCircle,
  Circle,
  Filter,
  List as ListIcon,
  Calendar,
  History,
  Bell,
  Share2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: Date;
}

const PRIORITY = {
  low: {
    color: "text-slate-400 bg-slate-400/10 border-slate-400/20",
    label: "Low",
  },
  medium: {
    color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    label: "Medium",
  },
  high: {
    color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    label: "High",
  },
};

export default function TasksList({ user }: { user: any }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [timeframe, setTimeframe] = useState<
    "all" | "today" | "past" | "custom"
  >("all");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [isAdding, setIsAdding] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [undoTask, setUndoTask] = useState<Task | null>(null);
  const [quickAddTitle, setQuickAddTitle] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  // New task form state
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
  }>({
    title: "",
    description: "",
    priority: "medium",
  });

  useEffect(() => {
    if (!user?.id) return;
    const supabase = createClient();

    // Initial fetch
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error?.message.includes("API key")) {
        alert("Supabase API Key Error: Check your .env.local");
      }
      if (data) {
        setTasks(
          data.map((t: any) => ({ ...t, createdAt: new Date(t.created_at) })),
        );
      }
    };

    fetchTasks();

    // Real-time Subscription (Fix for "Real-time Sync")
    const channel = supabase
      .channel("tasks-real-time")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newTask = {
              ...payload.new,
              createdAt: new Date(payload.new.created_at),
            } as Task;
            setTasks((prev) => [
              newTask,
              ...prev.filter((t) => t.id !== payload.new.id),
            ]);
          } else if (payload.eventType === "UPDATE") {
            setTasks((prev) =>
              prev.map((t) =>
                t.id === payload.new.id
                  ? {
                      ...t,
                      ...payload.new,
                      createdAt: new Date(payload.new.created_at),
                    }
                  : t,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setTasks((prev) => prev.filter((t) => t.id !== payload.old.id));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const handleAction = async (
    type: "add" | "toggle" | "delete",
    id?: string,
  ) => {
    const supabase = createClient();
    if (type === "add") {
      const title = quickAddTitle.trim() || newTask.title.trim();
      if (!title) return;

      const tempId = crypto.randomUUID();
      const taskData = {
        title: title,
        description: quickAddTitle.trim() ? "" : newTask.description,
        priority: quickAddTitle.trim() ? "medium" : newTask.priority,
      };

      const task = {
        id: tempId,
        ...taskData,
        completed: false,
        createdAt: new Date(),
      };

      setTasks([task, ...tasks]);
      setIsAdding(false);
      setNewTask({ title: "", description: "", priority: "medium" });

      const { data } = await supabase
        .from("tasks")
        .insert({
          user_id: user.id || user.sub,
          ...taskData,
          completed: false,
        })
        .select()
        .single();
      if (data)
        setTasks((prev) =>
          prev.map((t) =>
            t.id === tempId
              ? { ...t, id: data.id, createdAt: new Date(data.created_at) }
              : t,
          ),
        );
    } else if (type === "toggle" && id) {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      const willBeCompleted = !task.completed;
      setTasks(
        tasks.map((t) =>
          t.id === id ? { ...t, completed: willBeCompleted } : t,
        ),
      );

      if (willBeCompleted) {
        setUndoTask(task);
        setTimeout(() => setUndoTask(null), 5000);
      }

      await supabase
        .from("tasks")
        .update({ completed: willBeCompleted })
        .eq("id", id);
    } else if (type === "delete" && id) {
      if (!confirm("Delete this task?")) return;
      setTasks(tasks.filter((t) => t.id !== id));
      await supabase.from("tasks").delete().eq("id", id);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesFilter =
      filter === "all" || (filter === "active" ? !t.completed : t.completed);
    const matchesSearch = t.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const isToday =
      new Date(t.createdAt).toDateString() === new Date().toDateString();
    const matchesTimeframe =
      timeframe === "all"
        ? true
        : timeframe === "today"
          ? isToday
          : timeframe === "past"
            ? !isToday
            : new Date(t.createdAt).toISOString().split("T")[0] ===
              selectedDate;
    return matchesFilter && matchesSearch && matchesTimeframe;
  });

  // Task grouping logic
  const groupedTasks = {
    today: filteredTasks.filter(
      (t) => new Date(t.createdAt).toDateString() === new Date().toDateString(),
    ),
    tomorrow: filteredTasks.filter((t) => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return new Date(t.createdAt).toDateString() === tomorrow.toDateString();
    }),
    upcoming: filteredTasks.filter((t) => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return new Date(t.createdAt) > tomorrow;
    }),
    past: filteredTasks.filter((t) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(t.createdAt) < today;
    }),
  };

  const getSmartDateLabel = (date: Date) => {
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.toDateString() === today.toDateString())
      return <span className="text-emerald-400">Today</span>;
    if (d.toDateString() === tomorrow.toDateString())
      return <span className="text-blue-400">Tomorrow</span>;
    if (d < today && d.toDateString() !== today.toDateString())
      return <span className="text-rose-500">Overdue</span>;

    return `In ${Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))} days`;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      if (e.key.toLowerCase() === "n") {
        e.preventDefault();
        setIsAdding(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      if (e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleUndo = async () => {
    if (!undoTask) return;
    const supabase = createClient();
    setTasks(
      tasks.map((t) => (t.id === undoTask.id ? { ...t, completed: false } : t)),
    );
    await supabase
      .from("tasks")
      .update({ completed: false })
      .eq("id", undoTask.id);
    setUndoTask(null);
  };

  const counts = {
    pending: tasks.filter((t) => !t.completed).length,
    done: tasks.filter((t) => t.completed).length,
  };

  return (
    <div className="w-full text-white font-sans overflow-x-hidden">
      <div className="space-y-6 md:space-y-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-center justify-between">
          <div className="flex items-center gap-5 md:gap-8">
            <div className="relative h-14 w-14 md:h-20 md:w-20 group/progress shrink-0">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-indigo-500/10 blur-xl rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity" />

              <svg className="h-14 w-14 md:h-16 md:w-16 -rotate-90 relative z-10">
                <circle
                  cx="50%"
                  cy="50%"
                  r="24"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-white/5 md:r-[28]"
                />
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="24"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray="150.8"
                  initial={{ strokeDashoffset: 150.8 }}
                  animate={{
                    strokeDashoffset:
                      150.8 - 150.8 * (counts.done / (tasks.length || 1)),
                  }}
                  className={`${
                    counts.done === tasks.length && tasks.length > 0
                      ? "text-emerald-500"
                      : "text-indigo-500"
                  } md:r-[28] md:strokeDasharray-[175.9]`}
                  strokeLinecap="round"
                  style={{ filter: "drop-shadow(0 0 4px currentColor)" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center relative z-10">
                <span
                  className={`text-[11px] md:text-[13px] font-black transition-colors ${
                    counts.done === tasks.length && tasks.length > 0
                      ? "text-emerald-400"
                      : "text-white"
                  }`}
                >
                  {Math.round((counts.done / (tasks.length || 1)) * 100)}%
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                Task{" "}
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Dashboard
                </span>
              </h1>
              <div className="flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] font-black uppercase tracking-wider">
                <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 text-emerald-400 -full border border-emerald-500/20 whitespace-nowrap">
                  <Check className="h-2.5 w-2.5" /> {counts.done} Done
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 text-amber-400 -full border border-amber-500/20 whitespace-nowrap">
                  <History className="h-2.5 w-2.5" /> {counts.pending} Pending
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
              <Input
                ref={searchRef}
                placeholder="Search tasks... (/)"
                className="bg-[#121212] border-white/5 pl-11 h-11 -xl focus:ring-indigo-500/20 text-xs md:text-sm w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              onClick={() => setIsAdding(!isAdding)}
              className="hidden md:flex h-11 px-6 bg-indigo-600 hover:bg-indigo-500 text-white -xl font-bold text-sm shadow-xl shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 group"
            >
              {isAdding ? (
                <X className="mr-2 h-4 w-4" />
              ) : (
                <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
              )}{" "}
              {isAdding ? "Cancel" : "New Task"}
            </Button>
          </div>
        </div>

        {/* Quick Add Inline */}
        <div className="relative group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2">
            <Plus className="h-4 w-4 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <Input
            placeholder="Quick add task..."
            value={quickAddTitle}
            onChange={(e) => setQuickAddTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && quickAddTitle.trim()) {
                handleAction("add");
                setQuickAddTitle("");
              }
            }}
            className="h-12 pl-12 bg-[#121212]/50 border-white/5 -xl text-sm focus:bg-[#161616] focus:border-indigo-500/30 transition-all shadow-sm"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between py-6 border-b border-white/5 gap-6">
          <div className="flex items-center gap-3">
            <div className="flex p-1 bg-[#121212] -xl border border-white/5 w-full md:w-auto overflow-x-auto scrollbar-hide no-scrollbar">
              {(["all", "active", "completed"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 md:flex-none px-4 md:px-8 py-2.5 -lg text-[11px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    filter === f
                      ? "bg-[#1d1d1d] text-white shadow-lg"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-12 w-12 -2xl bg-[#121212] border-white/5 hover:bg-white/5 transition-all"
                >
                  <Filter
                    className={`h-5 w-5 transition-colors ${
                      timeframe !== "all" ? "text-indigo-400" : "text-gray-500"
                    }`}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side="bottom"
                sideOffset={12}
                avoidCollisions={false}
                className="w-64 bg-black/80 backdrop-blur-xl border-white/10 text-white z-50 -2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-200 overflow-y-auto max-h-[80vh] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20"
              >
                <DropdownMenuLabel className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Timeframe
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5 mx-2" />
                <DropdownMenuRadioGroup
                  value={timeframe}
                  onValueChange={(v: any) => setTimeframe(v)}
                  className="p-1"
                >
                  <DropdownMenuRadioItem
                    value="all"
                    className="flex gap-3 py-3 px-4 -xl focus:bg-white/5 cursor-pointer"
                  >
                    <ListIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">All Time</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="today"
                    className="flex gap-3 py-3 px-4 -xl focus:bg-white/5 cursor-pointer"
                  >
                    <Calendar className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm font-medium">Today Only</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="past"
                    className="flex gap-3 py-3 px-4 -xl focus:bg-white/5 cursor-pointer"
                  >
                    <History className="h-4 w-4 text-amber-400" />
                    <span className="text-sm font-medium">Past Tasks</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="custom"
                    className="flex gap-3 py-3 px-4 -xl focus:bg-white/5 cursor-pointer"
                  >
                    <Search className="h-4 w-4 text-indigo-400" />
                    <span className="text-sm font-medium">Pick Date</span>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                {timeframe === "custom" && (
                  <div className="p-3 mt-1 bg-white/5 -xl border border-white/5 transition-all animate-in slide-in-from-top-2">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-transparent text-sm font-bold text-white focus:outline-none [color-scheme:dark]"
                    />
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {isAdding && (
          <Card className="bg-[#121212] border-white/5 -2xl animate-in slide-in-from-top-4 overflow-hidden">
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8 gap-4 flex flex-col">
                <Input
                  placeholder="Task Title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="bg-[#1a1a1a] border-white/10 h-11 text-sm -xl"
                />
                <Input
                  placeholder="Description (Optional)"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  className="bg-[#1a1a1a] border-white/10 h-11 text-sm -xl"
                />
              </div>
              <div className="md:col-span-4 flex flex-col justify-between gap-4">
                <div className="flex gap-2">
                  {(["low", "medium", "high"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setNewTask({ ...newTask, priority: p })}
                      className={`flex-1 py-2.5 -xl text-[10px] font-black border uppercase transition-all ${
                        newTask.priority === p
                          ? PRIORITY[p].color + " border-white/10"
                          : "bg-[#1a1a1a] text-gray-600 border-transparent"
                      }`}
                    >
                      {PRIORITY[p].label}
                    </button>
                  ))}
                </div>
                <Button
                  onClick={() => handleAction("add")}
                  className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-sm font-bold -xl shadow-lg shadow-indigo-500/20"
                >
                  Create Task
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-12 pb-32">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-24 text-gray-500 flex flex-col items-center gap-6 bg-[#121212]/40 -[40px] border border-dashed border-white/5">
              <div className="p-6 bg-[#1a1a1a] -2xl border border-white/5">
                {searchQuery ? (
                  <Search className="h-10 w-10 text-gray-700" />
                ) : (
                  <ListIcon className="h-10 w-10 text-indigo-500" />
                )}
              </div>
              <p className="text-xl font-bold max-w-md">
                {searchQuery
                  ? `No matches for "${searchQuery}"`
                  : filter === "completed"
                    ? "No completed tasks yet. Finish one to see it here 🎯"
                    : "📝 No tasks yet. Click “New Task” to add one."}
              </p>
              {searchQuery && (
                <Button
                  variant="link"
                  onClick={() => setSearchQuery("")}
                  className="text-indigo-400 font-bold"
                >
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            Object.entries(groupedTasks).map(([group, tasks]) => {
              if (tasks.length === 0) return null;
              return (
                <div key={group} className="space-y-2">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-4">
                    <span>{group}</span>
                    <div className="h-px flex-1 bg-white/5" />
                    <span className="bg-white/5 px-2 py-0.5 -md">
                      {tasks.length}
                    </span>
                  </h3>
                  <div className="grid gap-3">
                    {tasks.map((t) => (
                      <motion.div
                        layout
                        key={t.id}
                        onClick={() => setEditingTask(t)}
                        className={`group relative overflow-hidden flex items-center justify-between py-5 px-5 md:px-8 bg-[#121212]/80 backdrop-blur-sm -2xl border border-white/5 transition-all hover:bg-[#161616] hover:border-white/10 hover:shadow-2xl hover:shadow-indigo-500/5 cursor-pointer active:scale-[0.99] ${
                          t.completed ? "opacity-40 grayscale-[0.5]" : ""
                        }`}
                      >
                        {/* Background Hover Glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        {/* Priority Border Indicator */}
                        <div
                          className={`absolute left-0 top-3 bottom-3 w-1 -full ${
                            t.priority === "high"
                              ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]"
                              : t.priority === "medium"
                                ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                                : "bg-slate-500/40"
                          }`}
                        />

                        <div className="flex items-center gap-5 flex-1 min-w-0">
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="shrink-0"
                          >
                            <Checkbox
                              checked={t.completed}
                              onCheckedChange={() =>
                                handleAction("toggle", t.id)
                              }
                              className="h-5 w-5 md:h-6 md:w-6 -full data-[state=checked]:bg-emerald-500 transition-all"
                            />
                          </div>
                          <div className="min-w-0">
                            <h4
                              className={`text-sm font-semibold truncate ${t.completed ? "line-through text-gray-600" : "text-gray-100"}`}
                            >
                              {t.title}
                            </h4>
                            <div className="flex items-center gap-4 mt-2">
                              <Badge
                                variant="outline"
                                className={`${PRIORITY[t.priority].color} border-none font-black text-[9px] uppercase px-2 py-0.5 -full ring-1 ring-inset`}
                              >
                                {t.priority}
                              </Badge>
                              <span className="text-[10px] text-gray-500 font-bold uppercase flex items-center gap-1.5">
                                <Circle className="h-1.5 w-1.5 fill-current opacity-20" />{" "}
                                {getSmartDateLabel(t.createdAt)}
                              </span>
                              {new Date(t.createdAt).toDateString() ===
                                new Date().toDateString() &&
                                !t.completed && (
                                  <motion.div
                                    animate={{
                                      scale: [1, 1.1, 1],
                                      opacity: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                      repeat: Infinity,
                                      duration: 2,
                                    }}
                                    className="flex items-center gap-1 text-[8px] md:text-[9px] font-black text-amber-500 uppercase tracking-tight ml-0 md:ml-2 mt-1 md:mt-0"
                                  >
                                    <Bell className="h-2.5 w-2.5 md:h-3 md:w-3 fill-amber-500/20" />{" "}
                                    Due Today
                                  </motion.div>
                                )}
                            </div>
                          </div>
                        </div>

                        <div
                          className="flex gap-1 md:gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all transform translate-x-0 md:translate-x-4 md:group-hover:translate-x-0 shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                `${window.location.origin}/task/${t.id}`,
                              );
                              alert(
                                "Task link copied! Share it with your team.",
                              );
                            }}
                            className="h-10 w-10 text-gray-500 hover:text-indigo-400 hover:bg-indigo-400/10 -xl"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleAction("delete", t.id)}
                            className="h-10 w-10 text-rose-500 hover:bg-rose-500/10 -xl"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Mobile FAB */}
      <Button
        onClick={() => setIsAdding(true)}
        className="fixed bottom-8 right-8 h-16 w-16 -full bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xl md:hidden z-40"
      >
        <Plus className="h-8 w-8" />
      </Button>

      {/* Undo Toast */}
      <AnimatePresence>
        {undoTask && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 bg-[#1a1a1a] border border-white/10 px-4 md:px-6 py-3 md:py-4 -xl md:-2xl shadow-2xl flex items-center gap-4 md:gap-6 z-50 w-[90%] md:w-auto min-w-[280px] md:min-w-[320px]"
          >
            <span className="text-sm font-medium">Task marked as done</span>
            <Button
              variant="link"
              onClick={handleUndo}
              className="text-indigo-400 font-bold ml-auto"
            >
              Undo
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side Drawer */}
      <AnimatePresence>
        {editingTask && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingTask(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-[#0d0d0d] border-l border-white/5 z-[70] p-6 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black uppercase tracking-widest">
                  Edit Task
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingTask(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
                    Title
                  </label>
                  <Input
                    value={editingTask.title}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, title: e.target.value })
                    }
                    className="h-11 bg-white/5 border-white/5 -xl text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
                    Description
                  </label>
                  <textarea
                    value={editingTask.description || ""}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        description: e.target.value,
                      })
                    }
                    className="w-full min-h-[100px] bg-white/5 border-white/5 -xl p-3 text-sm text-white focus:outline-none focus:bg-white/10 transition-all resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
                    Priority
                  </label>
                  <div className="flex gap-2">
                    {(["low", "medium", "high"] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() =>
                          setEditingTask({ ...editingTask, priority: p })
                        }
                        className={`flex-1 py-3 -xl text-[9px] font-black border uppercase transition-all ${
                          editingTask.priority === p
                            ? PRIORITY[p].color + " border-white/10 shadow-lg"
                            : "bg-white/5 text-gray-600 border-transparent"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <Users className="h-4 w-4 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
                          Team Collaboration
                        </p>
                        <p className="text-[9px] text-gray-600 font-bold">
                          Only you can see this currently
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-[9px] font-black uppercase border-white/5 bg-white/5 hover:bg-white/10 active:scale-95"
                      onClick={() => alert("Team invites coming soon!")}
                    >
                      Invite
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <Button
                    variant="outline"
                    className="flex-1 h-12 border-rose-500/20 bg-rose-500/5 text-rose-500 hover:bg-rose-500/10 font-bold text-sm -xl"
                    onClick={async () => {
                      if (!confirm("Delete this task?")) return;
                      await handleAction("delete", editingTask.id);
                      setEditingTask(null);
                    }}
                  >
                    Delete Task
                  </Button>
                  <Button
                    className="flex-[2] h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm -xl"
                    onClick={async () => {
                      const supabase = createClient();
                      setTasks(
                        tasks.map((t) =>
                          t.id === editingTask.id ? editingTask : t,
                        ),
                      );
                      await supabase
                        .from("tasks")
                        .update({
                          title: editingTask.title,
                          description: editingTask.description,
                          priority: editingTask.priority,
                        })
                        .eq("id", editingTask.id);
                      setEditingTask(null);
                    }}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
