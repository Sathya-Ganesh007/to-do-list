"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  List as ListIcon,
  X,
  Edit2,
  Trash2,
  Check,
  ArrowRightCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  Circle,
  LayoutGrid,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: Date;
}

const priorityConfig = {
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

export default function TasksList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [isAdding, setIsAdding] = useState(false);

  // Form state
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<
    "low" | "medium" | "high"
  >("medium");

  // Load/Save
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) {
      setTasks(
        JSON.parse(saved).map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt),
        }))
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim(),
      completed: false,
      priority: newTaskPriority,
      createdAt: new Date(),
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setIsAdding(false);
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "active"
        ? !t.completed
        : t.completed;
    const matchesSearch = t.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const activeCount = tasks.filter((t) => !t.completed).length;
  const doneCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 font-sans">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-[#1a1a1a] rounded-lg border border-white/5 shadow-xl">
            <LayoutGrid className="h-5 w-5 text-gray-400" />
          </div>
          <nav className="text-sm font-medium">
            <Link
              href="/"
              className="text-gray-500 hover:text-white transition-colors cursor-pointer"
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

        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg border border-white/10">
          G
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-10">
        {/* Main Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Task{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            <p className="text-gray-500 text-lg">
              You have{" "}
              <span className="text-white font-semibold">
                {activeCount} pending
              </span>{" "}
              tasks to complete.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1 md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
              <Input
                placeholder="Search tasks..."
                className="bg-[#121212] border-white/5 pl-12 h-14 text-base focus-visible:ring-1 focus-visible:ring-indigo-500/50 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              onClick={() => setIsAdding(!isAdding)}
              className="h-14 px-8 bg-white text-black hover:bg-gray-200 rounded-xl font-bold text-base shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:scale-[1.02]"
            >
              {isAdding ? (
                <X className="h-5 w-5 mr-3" />
              ) : (
                <Plus className="h-5 w-5 mr-3" />
              )}
              {isAdding ? "Cancel" : "New Task"}
            </Button>
          </div>
        </div>

        {/* Filters and Stats Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between py-6 border-b border-white/5 gap-6">
          <div className="flex items-center gap-1 p-1.5 bg-[#121212] rounded-2xl border border-white/5">
            {(["all", "active", "completed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  filter === f
                    ? "bg-[#1d1d1d] text-white shadow-lg border border-white/5"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-8 text-sm font-bold tracking-tight">
            <div className="flex items-center gap-2.5 text-emerald-400">
              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span>{doneCount} Done</span>
            </div>
            <div className="flex items-center gap-2.5 text-amber-400">
              <div className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              <span>{activeCount} Pending</span>
            </div>
          </div>
        </div>

        {/* Task Form (Conditional) */}
        {isAdding && (
          <Card className="bg-[#121212] border-white/5 overflow-hidden animate-in fade-in slide-in-from-top-4 rounded-3xl">
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">
                      Task Title
                    </label>
                    <Input
                      placeholder="What needs to be done?"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="bg-[#1a1a1a] border-white/10 h-14 text-lg font-medium rounded-xl text-white focus-visible:ring-indigo-500/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">
                      Description (Optional)
                    </label>
                    <Input
                      placeholder="Add more context..."
                      value={newTaskDescription}
                      onChange={(e) => setNewTaskDescription(e.target.value)}
                      className="bg-[#1a1a1a] border-white/10 h-14 rounded-xl text-white focus-visible:ring-indigo-500/30"
                    />
                  </div>
                </div>
                <div className="md:col-span-4 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">
                      Priority
                    </label>
                    <div className="flex gap-2">
                      {(["low", "medium", "high"] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => setNewTaskPriority(p)}
                          className={`flex-1 py-3 rounded-xl text-xs font-black border transition-all uppercase tracking-tighter ${
                            newTaskPriority === p
                              ? priorityConfig[p].color +
                                " scale-105 border-white/10"
                              : "bg-[#1a1a1a] text-gray-500 border-transparent hover:text-gray-300"
                          }`}
                        >
                          {priorityConfig[p].label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={addTask}
                    className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl text-base shadow-lg shadow-indigo-600/20"
                  >
                    Create Task
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content Area */}
        <div className="grid grid-cols-1 text-center gap-4 pb-24">
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-15 animate-in fade-in duration-700">
              <div className="h-24 w-24 bg-[#121212] rounded-full flex items-center justify-center mb-8 border border-white/5 shadow-2xl">
                <ListIcon className="h-10 w-10 text-gray-700" />
              </div>
              <h3 className="text-2xl font-bold mb-3">No tasks found</h3>
              <p className="text-gray-600 max-w-sm text-lg leading-relaxed">
                Ready to be productive? Start by adding a new task!
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`group flex items-center justify-between p-6 bg-[#121212] rounded-3xl border border-white/5 transition-all hover:border-white/10 hover:bg-[#161616] ${
                  task.completed ? "opacity-40" : ""
                }`}
              >
                <div className="flex items-center gap-6 flex-1 min-w-0">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="h-7 w-7 rounded-full border-gray-700 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-none transition-all scale-110"
                  />
                  <div className="min-w-0">
                    <h3
                      className={`text-xl font-bold truncate transition-all ${
                        task.completed
                          ? "line-through text-gray-600"
                          : "text-gray-100"
                      }`}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-gray-500 text-sm mt-1 truncate max-w-lg">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-3">
                      <Badge
                        variant="outline"
                        className={`${
                          priorityConfig[task.priority].color
                        } border-none font-black text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full ring-1 ring-inset`}
                      >
                        {priorityConfig[task.priority].label}
                      </Badge>
                      <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <Circle className="h-2 w-2 fill-gray-800 border-none" />
                        {new Date(task.createdAt).toLocaleDateString(
                          undefined,
                          { month: "short", day: "numeric" }
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 text-gray-500 hover:text-white rounded-xl hover:bg-white/5"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteTask(task.id)}
                    className="h-10 w-10 text-rose-500/50 hover:text-rose-500 rounded-xl hover:bg-rose-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
