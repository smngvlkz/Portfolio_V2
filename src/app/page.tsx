import Hero from "./components/Hero";
import ProductLog from "./components/ProductLog";
import Contributions from "./components/Contributions";
import Terminal from "./components/Terminal";

// Force runtime rendering (not SSG) so environment variables are available
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main className="min-h-screen p-8 md:p-12 max-w-4xl mx-auto flex flex-col">
      <Hero />

      <div className="h-px bg-accent-secondary/30 w-full max-w-[600px] my-12" />

      <ProductLog />

      <div className="h-px bg-accent-secondary/50 w-full max-w-[600px] my-16" />

      <Contributions />

      <div className="h-px bg-accent-secondary/50 w-full max-w-[600px] my-16" />

      <section className="max-w-[700px] mb-16 mt-8">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-text-primary/90 mb-8 border-b border-accent-secondary/40 pb-2 w-max pr-12">README.md</h2>
        <div className="space-y-1 text-sm text-text-primary">
          <p>I build software designed to last.</p>
          <p>Products that solve real problems.</p>
        </div>
      </section>

      <div className="h-px bg-accent-secondary/50 w-full max-w-[600px] my-12" />

      <Terminal />
    </main>
  );
}
