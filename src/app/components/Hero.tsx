import { getActivityStats } from '@/lib/activity';
import ContributionHeatmap from './ContributionHeatmap';

export default async function Hero() {
    const stats = await getActivityStats();

    return (
        <section className="py-8 max-w-[700px]">
            <h1 className="text-xl font-bold mb-4 glitch">
                <span className="text-text-primary uppercase tracking-widest">&gt; SIMANGALISO_VILAKAZI</span>
            </h1>
            <p className="text-sm font-bold mb-1 text-text-primary uppercase tracking-wider">Full-Stack Software Engineer</p>
            <p className="text-sm text-text-muted mb-8">Building calm, reliable software</p>

            <div className="flex flex-col gap-2 text-sm mb-12">
                <div className="flex items-start">
                    <span className="text-text-muted min-w-[6.5rem] shrink-0 uppercase tracking-wider">STATUS:</span>
                    <span className="text-accent">Shipping</span>
                </div>
                <div className="flex items-start">
                    <span className="text-text-muted min-w-[6.5rem] shrink-0 uppercase tracking-wider">LOCATION:</span>
                    <span className="text-text-primary">South Africa</span>
                </div>
                <div className="flex items-start">
                    <span className="text-text-muted min-w-[6.5rem] shrink-0 uppercase tracking-wider">FOCUS:</span>
                    <span className="text-text-primary">Web platforms, automation, payments</span>
                </div>
                <div className="flex items-center mt-2 gap-4">
                    <a href="https://github.com/smngvlkz" target="_blank" className="text-text-muted border-b border-accent-secondary hover:text-accent hover:border-accent transition-all pb-0.5">&gt; github</a>
                    <a href="https://linkedin.com/in/smngvlkz" target="_blank" className="text-text-muted border-b border-accent-secondary hover:text-accent hover:border-accent transition-all pb-0.5">&gt; linkedin</a>
                    <a href="mailto:smngvlkz1@mail.com" className="text-text-muted border-b border-accent-secondary hover:text-accent hover:border-accent transition-all pb-0.5">&gt; email</a>
                </div>
            </div>

            <div>
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-text-primary/90 mb-8 border-b border-accent-secondary/40 pb-2 w-max pr-12">
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
                <ContributionHeatmap 
                    history={stats.history} 
                    githubHistory={stats.github.history}
                    gitlabHistory={stats.gitlab.history}
                />
                <div className="flex items-center justify-between text-xs text-text-muted mt-2">
                    <div className="flex items-center gap-2">
                        <span>less</span>
                        <div className="w-16 h-2 rounded-sm bg-gradient-to-r from-accent-secondary/20 via-accent/50 to-accent"></div>
                        <span>more</span>
                    </div>
                    <span className="opacity-60">* live stats from github & gitlab</span>
                </div>

                <a
                    href="#system-query"
                    className="inline-block mt-6 text-xs text-text-muted hover:text-accent transition-colors"
                >
                    &gt; system.query available below ↓
                </a>
            </div>
        </section>
    );
}
