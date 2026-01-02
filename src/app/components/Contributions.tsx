import Link from 'next/link';

export default function Contributions() {
    return (
        <div className="flex flex-col gap-20 max-w-[700px]">
            {/* Acknowledgements Section */}
            <section>
                <h2 className="text-base font-medium uppercase tracking-[0.2em] text-text-primary/90 mb-6 border-b border-accent-secondary/40 pb-2 w-max pr-12">
                    ACKNOWLEDGEMENTS
                </h2>
                <div className="text-text-primary text-sm space-y-3">
                    <p className="leading-relaxed">
                        Credited contributor to <span className="text-lg font-medium text-accent">radCAD</span> (open-source simulation framework).
                    </p>
                    <div className="pl-0 opacity-80">
                        <p className="text-text-muted mb-2 text-xs uppercase tracking-wide">Contribution:</p>
                        <ul className="list-none pl-4 text-text-muted space-y-2 border-l-2 border-accent-secondary/20">
                            <li>- cadCAD compatibility mode</li>
                            <li>- CI pipeline improvements</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-4">
                    <Link
                        href="https://github.com/CADLabs/radCAD"
                        target="_blank"
                        className="text-text-muted border-b border-accent-secondary hover:text-accent hover:border-accent transition-all text-sm inline-block pb-0.5 hover:tracking-wide"
                    >
                        github.com/CADLabs/radCAD ↗
                    </Link>
                </div>
            </section>

            {/* Community Section */}
            <section>
                <h2 className="text-base font-medium uppercase tracking-[0.2em] text-text-primary/90 mb-6 border-b border-accent-secondary/40 pb-2 w-max pr-12">
                    COMMUNITY
                </h2>
                <div className="text-text-primary text-sm space-y-4">
                    <p className="text-lg font-medium text-accent">
                        Cape Software Community Blog
                    </p>
                    <div className="grid gap-2 mt-2">
                        <div className="flex items-baseline">
                            <span className="text-text-muted w-28 uppercase tracking-widest text-xs opacity-70">ROLE:</span>
                            <span>Contributor / Maintainer</span>
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-text-muted w-28 uppercase tracking-widest text-xs opacity-70">STACK:</span>
                            <span>Next.js, Markdown, Tailwind</span>
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-text-muted w-28 uppercase tracking-widest text-xs opacity-70">FOCUS:</span>
                            <span>Static generation, contributor-friendly architecture</span>
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <Link
                        href="https://capedevs.github.io"
                        target="_blank"
                        className="text-text-muted border-b border-accent-secondary hover:text-accent hover:border-accent transition-all text-sm inline-block pb-0.5 hover:tracking-wide"
                    >
                        capedevs.github.io ↗
                    </Link>
                </div>
            </section>
        </div>
    );
}
