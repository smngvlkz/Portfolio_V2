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
                    <div className="grid gap-4 mt-2">
                        <div className="space-y-2">
                            <div className="flex items-start">
                                <span className="text-text-muted min-w-[4.5rem] shrink-0 uppercase tracking-widest text-xs opacity-70 pt-0.5">ROLE:</span>
                                <span className="font-medium">Creator & Maintainer (Commissioned Project)</span>
                            </div>
                            <p className="text-text-muted text-sm leading-relaxed pl-[4.5rem]">
                                Built the Cape Software Community website from the ground up as a commissioned bounty project and continue to maintain and evolve it.
                            </p>
                        </div>
                        <div className="flex items-start">
                            <span className="text-text-muted min-w-[4.5rem] shrink-0 uppercase tracking-widest text-xs opacity-70 pt-0.5">STACK:</span>
                            <span>Next.js, JavaScript, Markdown, Tailwind CSS</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-text-muted min-w-[4.5rem] shrink-0 uppercase tracking-widest text-xs opacity-70 pt-0.5">FOCUS:</span>
                            <span>Static generation, contributor-friendly architecture, community contribution flow</span>
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
