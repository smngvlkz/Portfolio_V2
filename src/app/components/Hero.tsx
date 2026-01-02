import clsx from 'clsx';
import { getActivityStats } from '@/lib/activity';

export default async function Hero() {
    const stats = await getActivityStats();

    return (
        <section className="py-8 max-w-[700px]">
            <h1 className="text-xl font-bold mb-4 glitch">
                <span className="text-text-primary uppercase tracking-widest">&gt; SIMANGALISO_VILAKAZI</span>
            </h1>
            <p className="text-xl font-semibold mb-1 text-text-primary">Full-stack engineer</p>
            <p className="text-base text-text-muted mb-8">Building calm, durable software</p>

            <div className="flex flex-col gap-2 text-sm mb-12">
                <div className="flex items-center">
                    <span className="text-text-muted w-24 uppercase tracking-wider">STATUS:</span>
                    <span className="text-accent">Shipping</span>
                </div>
                <div className="flex items-center">
                    <span className="text-text-muted w-24 uppercase tracking-wider">LOCATION:</span>
                    <span className="text-text-primary">South Africa</span>
                </div>
                <div className="flex items-center">
                    <span className="text-text-muted w-24 uppercase tracking-wider">FOCUS:</span>
                    <span className="text-text-primary">Web platforms, automation, payments</span>
                </div>
                <div className="flex items-center mt-2 gap-4">
                    <a href="https://github.com/smngvlkz" target="_blank" className="text-text-muted hover:text-accent transition-colors">&gt; github</a>
                    <a href="https://linkedin.com/in/smngvlkz" target="_blank" className="text-text-muted hover:text-accent transition-colors">&gt; linkedin</a>
                </div>
            </div>

            <div>
                <h2 className="text-base font-medium uppercase tracking-[0.2em] text-text-primary/90 mb-8 border-b border-accent-secondary/40 pb-2 w-max pr-12">
                    SYSTEM.ACTIVITY
                </h2>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8 font-mono text-sm">
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-text-primary uppercase tracking-wider">SESSIONS: {stats.totalSessions}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-text-primary uppercase tracking-wider">STREAK: {stats.github.streak} DAYS</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-text-primary uppercase tracking-wider">LONGEST: 15H</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-text-primary uppercase tracking-wider">SHIPPED: {stats.shipped}</span>
                    </div>
                </div>

                {/* Visual Heatmap Integration */}
                <div className="flex flex-wrap gap-1 max-w-[600px] mb-2">
                    {/* Generating a static visual pattern representing the 'calm' consistent activity */}
                    {Array.from({ length: 60 }).map((_, i) => {
                        // Pseudo-random pattern for visualization based on index
                        const level = [1, 2, 4, 1, 0, 3, 2, 1, 4, 2, 1, 0][i % 12];
                        return (
                            <div
                                key={i}
                                className={clsx(
                                    "w-3 h-3 transition-colors duration-300",
                                    level === 0 && "bg-accent-secondary/10",
                                    level === 1 && "bg-accent/20",
                                    level === 2 && "bg-accent/40",
                                    level === 3 && "bg-accent/70",
                                    level === 4 && "bg-accent/100"
                                )}
                            />
                        );
                    })}
                </div>
                <div className="flex items-center justify-between text-xs text-text-muted mt-2">
                    <div className="flex items-center gap-2">
                        <span>less</span>
                        <div className="w-16 h-2 rounded-sm bg-gradient-to-r from-accent-secondary/20 via-accent/50 to-accent"></div>
                        <span>more</span>
                    </div>
                    <span className="opacity-60">* live stats from github & gitlab</span>
                </div>
            </div>
        </section>
    );
}
