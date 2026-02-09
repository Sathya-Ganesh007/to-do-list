import { NavbarSection } from "@/components/Home/navbar-section";
import { Footer } from "@/components/Home/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">
        <NavbarSection />
        <div className="flex-1 w-full flex flex-col gap-8 md:gap-20 max-w-5xl px-8 py-8 md:px-12 md:py-10">
          {children}
        </div>
        <Footer />
      </div>
    </main>
  );
}
