"use client";

import React, { useState, FormEvent } from "react";

import { fetchPostJSON } from "@/lib/api-helpers";

const CheckoutForm = () => {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({ customDonation: 50 });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: Number(e.target.value) });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create a Checkout Session.
      const checkoutSession = await fetchPostJSON("/api/checkout_sessions", {
        amount: input.customDonation,
      });

      if (checkoutSession.statusCode === 500) {
        console.error(checkoutSession.message);
        setLoading(false);
        return;
      }

      // Redirect to Checkout.
      if (checkoutSession.url) {
        window.location.href = checkoutSession.url;
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="customDonation"
            className="block text-sm font-medium text-gray-200"
          >
            Donation Amount (USD)
          </label>
          <input
            id="customDonation"
            type="number"
            name="customDonation"
            value={input.customDonation}
            onChange={handleInputChange}
            min="1"
            step="1"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Donate Now"
          )}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-gray-400">
        Secure payment processed by Stripe
      </p>
    </div>
  );
};

export default CheckoutForm;
