import Hero from "./components/Hero";
import ProductLog from "./components/ProductLog";

export default function Home() {
  return (
    <main className="min-h-screen p-8 md:p-12 max-w-4xl mx-auto flex flex-col">
      <Hero />

      <div className="h-px bg-accent-secondary/30 w-full max-w-[600px] my-12" />

      <ProductLog />

      <div className="h-px bg-accent-secondary/30 w-full max-w-[600px] my-12" />

      <section className="max-w-[700px] mb-12">
        <h2 className="text-sm uppercase tracking-wider text-accent-secondary mb-8">README.md</h2>
        <div className="space-y-1 text-text-primary">
          <p>I build focused, durable products designed to last.</p>
          <p>No hype. No dashboards for dashboards.</p>
          <p>Just software that does its job.</p>
        </div>
      </section>

      <footer className="py-8 text-text-muted">
        <span className="cursor-blink font-bold">&gt; _</span>
      </footer>
    </main>
  );
}
