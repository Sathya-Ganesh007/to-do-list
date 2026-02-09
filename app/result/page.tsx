import { Suspense } from "react";
import { NavbarSection } from "@/components/Home/navbar-section";
import { Footer } from "@/components/Home/footer";
import { ResultContent } from "@/components/result/result-content";

export default function ResultPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarSection />
      <Suspense
        fallback={
          <div className="flex-1 bg-neutral-950 flex items-center justify-center text-white">
            <div className="animate-pulse text-xl font-medium">
              Validating Payment...
            </div>
          </div>
        }
      >
        <ResultContent />
      </Suspense>
      <Footer />
    </div>
  );
}
