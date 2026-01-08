import CheckoutForm from "@/components/stripe/CheckoutForm";

export const metadata = {
  title: "Donate | Support Our Project",
  description:
    "Your support helps us maintain and improve this project. Every donation matters!",
};

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-neutral-950 to-neutral-950">
      <div className="max-w-2xl w-full text-center space-y-8 mb-12">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-4">
          Support <span className="text-indigo-500">Us</span> 💖
        </h1>
        <p className="text-xl text-gray-400 max-w-lg mx-auto leading-relaxed">
          Your contributions help us build better tools for everyone. Become a
          part of our journey today.
        </p>
      </div>

      <CheckoutForm />

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full">
        {[
          { icon: "🚀", title: "Fast", desc: "Instant processing via Stripe" },
          { icon: "🔒", title: "Secure", desc: "PCI-compliant checkout" },
          { icon: "🌍", title: "Global", desc: "Supports all major cards" },
        ].map((feature, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center"
          >
            <div className="text-3xl mb-3">{feature.icon}</div>
            <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
            <p className="text-sm text-gray-400">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
