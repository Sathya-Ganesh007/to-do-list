"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ResultPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-white text-center">
      <div className="max-w-md w-full p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Thank you for your generous donation. Your support makes a real
          difference!
        </p>

        {sessionId && (
          <div className="p-4 bg-white/5 rounded-xl text-left mb-8">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Session ID
            </p>
            <code className="text-indigo-400 break-all text-sm font-mono">
              {sessionId}
            </code>
          </div>
        )}

        <Link
          href="/"
          className="inline-block w-full py-4 px-6 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-all active:scale-[0.98]"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
