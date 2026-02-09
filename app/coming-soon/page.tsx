import { ComingSoonComponent } from "@/components/dashboard-ui/coming-soon";
import { NavbarSection } from "@/components/Home/navbar-section";
import { Footer } from "@/components/Home/footer";

export default function ComingSoonPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavbarSection />
      <main className="flex-1">
        <ComingSoonComponent />
      </main>
      <Footer />
    </div>
  );
}
