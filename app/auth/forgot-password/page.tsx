import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { NavbarSection } from "@/components/Home/navbar-section";
import { Footer } from "@/components/Home/footer";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavbarSection />
      <main className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <ForgotPasswordForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
