import Link from 'next/link';

interface Product {
    name: string;
    status: string;
    type: string;
    pricing: string;
    goal: string;
    description: string;
    link: string;
    url: string;
    // New detailed fields
    stack: string[];
    infra: string[];
    payments?: string[];
    notes?: string[];
    focus?: string[];
    statusNotes?: string[];
}

const PRODUCTS: Product[] = [
    {
        name: "QUICKSALARIES",
        status: "[LIVE]",
        type: "SaaS",
        pricing: "Free / Pro $4.99/month",
        goal: "Authority",
        description: "Salary data aggregation\nTransparent market insights",
        link: "quicksalaries.com",
        url: "https://www.quicksalaries.com/",
        stack: ["HTML, CSS, JavaScript", "No framework"],
        infra: ["Hosted on Microsoft Azure", "Static delivery"],
        payments: ["LemonSqueezy"],
        notes: ["Intentionally minimal", "Zero backend complexity"]
    },
    {
        name: "PAYCHASERS",
        status: "[LIVE]",
        type: "SaaS",
        pricing: "Free / Pro $9/month",
        goal: "R45k/month (~$2.5k)",
        description: "Automated invoice follow-ups\nDesigned for low maintenance",
        link: "paychasers.com",
        url: "https://www.paychasers.com/",
        stack: ["Next.js", "TypeScript, JavaScript", "CSS"],
        infra: ["Vercel", "PostgreSQL"],
        payments: ["LemonSqueezy (planned)"]
    },
    {
        name: "SWYFTSWAP",
        status: "[ARCHIVED]",
        type: "Crypto / Platform",
        pricing: "5% flat fee",
        goal: "Financial inclusion",
        description: "Instant airtime-to-usdc\nNon-custodial stellar rails",
        link: "swyftswap.com",
        url: "https://www.swyftswap.com",
        stack: ["Vue", "JavaScript, TypeScript", "Rust", "Shell"],
        infra: ["Vercel"],
        statusNotes: ["Inactive", "Proof of end-to-end delivery"]
    }
];

export default function ProductLog() {
    return (
        <section className="py-8 max-w-[700px]">
            <h2 className="text-base font-medium uppercase tracking-[0.2em] text-text-primary/90 mb-8 max-w-[700px]">LOGS/PRODUCTS</h2>

            <div className="flex flex-col gap-16">
                {PRODUCTS.map((product) => (
                    <div
                        key={product.name}
                        className="group pl-4 border-l-2 border-accent-secondary hover:border-accent transition-colors duration-300"
                    >
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-lg font-bold text-text-primary group-hover:text-accent transition-colors">
                                [PRODUCT] {product.name}
                            </span>
                            <span className="text-xs bg-accent-secondary text-text-primary px-1.5 py-0.5 rounded-sm uppercase">
                                {product.status}
                            </span>
                        </div>

                        {/* TYPE, PRICING, GOAL - First */}
                        <div className="grid gap-1 text-sm mb-4">
                            <div className="flex">
                                <span className="text-text-muted w-24 uppercase tracking-wider">TYPE:</span>
                                <span className="text-text-primary">{product.type}</span>
                            </div>
                            <div className="flex">
                                <span className="text-text-muted w-24 uppercase tracking-wider">PRICING:</span>
                                <span className="text-text-primary">{product.pricing}</span>
                            </div>
                            <div className="flex">
                                <span className="text-text-muted w-24 uppercase tracking-wider">GOAL:</span>
                                <span className="text-accent">{product.goal}</span>
                            </div>
                        </div>

                        {/* Description */}
                        <pre className="font-mono text-sm text-text-muted mb-6 whitespace-pre-line font-sans">
                            {product.description}
                        </pre>

                        {/* STACK, INFRA, PAYMENTS, NOTES - Below */}
                        <div className="space-y-4 text-sm border-t border-accent-secondary/20 pt-4">
                            {/* STACK */}
                            <div>
                                <span className="text-text-muted uppercase tracking-wider block mb-1">STACK:</span>
                                <ul className="pl-4 text-text-primary space-y-0.5">
                                    {product.stack.map((item, i) => (
                                        <li key={i}>- {item}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* INFRA */}
                            <div>
                                <span className="text-text-muted uppercase tracking-wider block mb-1">INFRA:</span>
                                <ul className="pl-4 text-text-primary space-y-0.5">
                                    {product.infra.map((item, i) => (
                                        <li key={i}>- {item}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* PAYMENTS */}
                            {product.payments && (
                                <div>
                                    <span className="text-text-muted uppercase tracking-wider block mb-1">PAYMENTS:</span>
                                    <ul className="pl-4 text-text-primary space-y-0.5">
                                        {product.payments.map((item, i) => (
                                            <li key={i}>- {item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* NOTES */}
                            {product.notes && (
                                <div>
                                    <span className="text-text-muted uppercase tracking-wider block mb-1">NOTES:</span>
                                    <ul className="pl-4 text-text-primary space-y-0.5">
                                        {product.notes.map((item, i) => (
                                            <li key={i}>- {item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* FOCUS */}
                            {product.focus && (
                                <div>
                                    <span className="text-text-muted uppercase tracking-wider block mb-1">FOCUS:</span>
                                    <ul className="pl-4 text-text-primary space-y-0.5">
                                        {product.focus.map((item, i) => (
                                            <li key={i}>- {item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* STATUS (for archived) */}
                            {product.statusNotes && (
                                <div>
                                    <span className="text-text-muted uppercase tracking-wider block mb-1">STATUS:</span>
                                    <ul className="pl-4 text-text-primary space-y-0.5">
                                        {product.statusNotes.map((item, i) => (
                                            <li key={i}>- {item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Link */}
                        <div className="mt-2">
                            <Link
                                href={product.url}
                                target="_blank"
                                className="text-text-muted border-b border-accent-secondary hover:text-accent hover:border-accent transition-all text-sm inline-block pb-0.5 hover:tracking-wide"
                            >
                                {product.link} ↗
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
