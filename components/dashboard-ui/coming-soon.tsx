"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Rocket, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ComingSoonComponent() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 space-y-8"
      >
        <div className="inline-flex p-5 bg-indigo-500/10 rounded-3xl border border-indigo-500/20 mb-4">
          <Rocket className="h-12 w-12 text-indigo-400 animate-bounce" />
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter">
            Coming{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Soon
            </span>
          </h1>
          <p className="text-gray-500 text-xl font-medium max-w-md mx-auto leading-relaxed">
            We're working hard to wrap things up. This feature will be live very
            soon!
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={() => router.back()}
            className="h-14 px-8 bg-white text-black hover:bg-gray-200 font-bold -xl flex items-center gap-3 active:scale-95 transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </Button>
        </motion.div>
      </motion.div>

      {/* Modern Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
    </div>
  );
}
