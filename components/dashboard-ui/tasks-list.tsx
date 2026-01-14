"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Plus,
  Search,
  X,
  LayoutGrid,
  Check,
  Trash2,
  ArrowUpCircle,
  Circle,
  Filter,
  List as ListIcon,
  Calendar,
  History,
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
    color: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    label: "Low",
  },
  medium: {
    color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    label: "Medium",
  },
  high: {
    color: "text-rose-400 bg-rose-400/10 border-rose-400/20",
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
    new Date().toISOString().split("T")[0]
  );
  const [isAdding, setIsAdding] = useState(false);

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
    supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error?.message.includes("API key"))
          alert("Supabase API Key Error: Check your .env.local");
        if (data)
          setTasks(
            data.map((t: any) => ({ ...t, createdAt: new Date(t.created_at) }))
          );
      });
  }, [user?.id]);

  const handleAction = async (
    type: "add" | "toggle" | "delete",
    id?: string
  ) => {
    const supabase = createClient();
    if (type === "add") {
      if (!newTask.title.trim()) return;
      const tempId = crypto.randomUUID();
      const task = {
        id: tempId,
        ...newTask,
        completed: false,
        createdAt: new Date(),
      };
      setTasks([task, ...tasks]);
      setIsAdding(false);
      setNewTask({ title: "", description: "", priority: "medium" });
      const { data } = await supabase
        .from("tasks")
        .insert({ user_id: user.id || user.sub, ...newTask, completed: false })
        .select()
        .single();
      if (data)
        setTasks((prev) =>
          prev.map((t) =>
            t.id === tempId
              ? { ...t, id: data.id, createdAt: new Date(data.created_at) }
              : t
          )
        );
    } else if (type === "toggle" && id) {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      setTasks(
        tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
      await supabase
        .from("tasks")
        .update({ completed: !task.completed })
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
        : new Date(t.createdAt).toISOString().split("T")[0] === selectedDate;
    return matchesFilter && matchesSearch && matchesTimeframe;
  });

  const counts = {
    pending: tasks.filter((t) => !t.completed).length,
    done: tasks.filter((t) => t.completed).length,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 font-sans">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-[#1a1a1a] rounded-lg border border-white/5 shadow-xl">
            <LayoutGrid className="h-5 w-5 text-gray-400" />
          </div>
          <nav className="text-sm font-medium">
            <Link
              href="/"
              className="text-gray-500 hover:text-white transition-colors"
            >
              Home
            </Link>
            <span className="mx-2 text-gray-700">/</span>
            <Link
              href="/dashboard"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
          </nav>
        </div>
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold shadow-lg border border-white/10">
          G
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold">
              Task{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            <p className="text-gray-500">
              You have{" "}
              <span className="text-white font-semibold">
                {counts.pending} pending
              </span>{" "}
              tasks.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="relative md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600" />
              <Input
                placeholder="Search tasks..."
                className="bg-[#121212] border-white/5 pl-12 h-14 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              onClick={() => setIsAdding(!isAdding)}
              className="h-14 px-8 bg-white text-black hover:bg-gray-200 rounded-xl font-bold"
            >
              {isAdding ? (
                <X className="mr-2 h-5 w-5" />
              ) : (
                <Plus className="mr-2 h-5 w-5" />
              )}{" "}
              {isAdding ? "Cancel" : "New Task"}
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between py-6 border-b border-white/5 gap-6">
          <div className="flex items-center gap-3">
            <div className="flex p-1.5 bg-[#121212] rounded-2xl border border-white/5">
              {(["all", "active", "completed"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    filter === f
                      ? "bg-[#1d1d1d] text-white shadow-lg"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-12 w-12 rounded-2xl bg-[#121212] border-white/5"
                >
                  <Filter
                    className={`h-5 w-5 ${
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
                className="w-64 bg-[#0f0f0f] border-white/10 text-white z-50 rounded-2xl"
              >
                <DropdownMenuLabel className="px-4 py-3 text-xs uppercase text-gray-400">
                  Timeframe
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuRadioGroup
                  value={timeframe}
                  onValueChange={(v: any) => setTimeframe(v)}
                >
                  <DropdownMenuRadioItem
                    value="all"
                    className="flex gap-3 py-3 px-4 focus:bg-white/5"
                  >
                    <ListIcon className="h-4 w-4" /> All Time
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="today"
                    className="flex gap-3 py-3 px-4 focus:bg-white/5"
                  >
                    <Calendar className="h-4 w-4 text-emerald-400" /> Today Only
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="past"
                    className="flex gap-3 py-3 px-4 focus:bg-white/5"
                  >
                    <History className="h-4 w-4 text-amber-400" /> Past Tasks
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="custom"
                    className="flex gap-3 py-3 px-4 focus:bg-white/5"
                  >
                    <Search className="h-4 w-4 text-indigo-400" /> Pick Date
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                {timeframe === "custom" && (
                  <div className="p-4 border-t border-white/5">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-[#1a1a1a] rounded-lg px-3 py-2 text-white [color-scheme:dark]"
                    />
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex gap-8 text-sm font-bold">
            <div className="flex items-center gap-2 text-emerald-400">
              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-lg" />{" "}
              {counts.done} Done
            </div>
            <div className="flex items-center gap-2 text-amber-400">
              <div className="h-2 w-2 rounded-full bg-amber-500 shadow-lg" />{" "}
              {counts.pending} Pending
            </div>
          </div>
        </div>

        {isAdding && (
          <Card className="bg-[#121212] border-white/5 rounded-3xl animate-in slide-in-from-top-4">
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-8 gap-6 flex flex-col">
                <Input
                  placeholder="Task Title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="bg-[#1a1a1a] border-white/10 h-14 text-lg rounded-xl"
                />
                <Input
                  placeholder="Description (Optional)"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  className="bg-[#1a1a1a] border-white/10 h-14 rounded-xl"
                />
              </div>
              <div className="md:col-span-4 flex flex-col justify-between gap-6">
                <div className="flex gap-2">
                  {(["low", "medium", "high"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setNewTask({ ...newTask, priority: p })}
                      className={`flex-1 py-3 rounded-xl text-xs font-black border uppercase ${
                        newTask.priority === p
                          ? PRIORITY[p].color + " border-white/10"
                          : "bg-[#1a1a1a] text-gray-500 border-transparent"
                      }`}
                    >
                      {PRIORITY[p].label}
                    </button>
                  ))}
                </div>
                <Button
                  onClick={() => handleAction("add")}
                  className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 font-black rounded-xl"
                >
                  Create Task
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 pb-24">
          {filteredTasks.length ? (
            filteredTasks.map((t) => (
              <div
                key={t.id}
                className={`group flex items-center justify-between p-6 bg-[#121212] rounded-3xl border border-white/5 transition-all hover:bg-[#161616] ${
                  t.completed ? "opacity-40" : ""
                }`}
              >
                <div className="flex items-center gap-6 flex-1 min-w-0">
                  <Checkbox
                    checked={t.completed}
                    onCheckedChange={() => handleAction("toggle", t.id)}
                    className="h-7 w-7 rounded-full data-[state=checked]:bg-emerald-500 transition-all"
                  />
                  <div className="min-w-0">
                    <h3
                      className={`text-xl font-bold truncate ${
                        t.completed
                          ? "line-through text-gray-600"
                          : "text-gray-100"
                      }`}
                    >
                      {t.title}
                    </h3>
                    {t.description && (
                      <p className="text-gray-500 text-sm mt-1 truncate max-w-lg">
                        {t.description}
                      </p>
                    )}
                    <div className="flex gap-4 mt-3">
                      <Badge
                        variant="outline"
                        className={`${
                          PRIORITY[t.priority].color
                        } border-none font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full ring-1 ring-inset`}
                      >
                        {PRIORITY[t.priority].label}
                      </Badge>
                      <span className="text-[10px] text-gray-600 font-bold uppercase flex items-center gap-1.5">
                        <Circle className="h-2 w-2 fill-gray-800" />{" "}
                        {new Date(t.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleAction("toggle", t.id)}
                    className="h-10 w-10 text-gray-500 hover:text-white rounded-xl"
                  >
                    {t.completed ? (
                      <ArrowUpCircle className="h-4 w-4" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleAction("delete", t.id)}
                    className="h-10 w-10 text-rose-500 hover:bg-rose-600 hover:text-white rounded-xl"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-gray-600 text-lg">
              No tasks found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
