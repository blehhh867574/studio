
import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { CTASection } from "@/components/landing/cta-section";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        {/* Placeholder for more sections as needed */}
        <section id="solutions" className="py-24 border-t bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-primary mb-12 font-headline">Built for every industry</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {['Healthcare', 'Finance', 'Education', 'Technology'].map((item) => (
                <div key={item} className="p-8 rounded-xl bg-white shadow-sm border hover:border-accent transition-colors">
                  <span className="font-semibold text-primary">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        <CTASection />
      </main>
      <footer className="border-t py-12 bg-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-xl font-bold text-primary font-headline">LaunchPad Link</span>
            <p className="text-sm text-muted-foreground">© 2025 LaunchPad Link Inc. All rights reserved.</p>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
            <a href="#" className="hover:text-primary">Cookie Settings</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
