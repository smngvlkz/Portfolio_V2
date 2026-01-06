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
    architecture?: string[];
    notes?: string[];
    focus?: string[];
    statusNotes?: string[];
}

const PRODUCTS: Product[] = [
    {
        name: "QUICKSALARIES",
        status: "[LIVE]",
        type: "SaaS",
        pricing: "Free forever / Pro $14.99 lifetime",
        goal: "Authority",
        description: "Salary data aggregation\nTransparent market insights",
        link: "quicksalaries.com",
        url: "https://www.quicksalaries.com/",
        stack: ["HTML, CSS, JavaScript", "No framework"],
        infra: ["Hosted on Microsoft Azure", "Static delivery"],
        payments: ["LemonSqueezy"],
        notes: ["Intentionally minimal", "Backend-free by design"]
    },
    {
        name: "PAYCHASERS",
        status: "[LIVE]",
        type: "SaaS",
        pricing: "Free / Pro $9/month",
        goal: "Sustainable recurring SaaS revenue",
        description: "Automated invoice follow-ups\nDesigned for low maintenance",
        link: "paychasers.com",
        url: "https://www.paychasers.com/",
        stack: ["Next.js", "TypeScript, JavaScript", "CSS"],
        infra: ["Vercel", "PostgreSQL"],
        payments: ["LemonSqueezy (integration in progress)"]
    },
    {
        name: "SWYFTSWAP",
        status: "[ARCHIVED]",
        type: "Crypto / Platform",
        pricing: "5% flat fee",
        goal: "Financial inclusion",
        description: "Instant airtime-to-USDC\nNon-custodial Stellar rails",
        link: "swyftswap.com",
        url: "https://www.swyftswap.com",
        stack: ["Vue", "JavaScript, TypeScript", "Rust (Soroban smart contracts)", "Stellar blockchain"],
        infra: ["Vercel", "Stellar Network"],
        architecture: ["Non-custodial", "Smart contract–driven settlement", "SMS-triggered transactions (infra-ready)"],
        statusNotes: ["Archived (research ongoing)", "End-to-end system fully built and deployed"],
        notes: ["Self-custodial USDC delivery", "Reduced regulatory surface via non-custodial model"]
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

                        {/* TYPE, PRICING, GOAL, PHASE */}
                        <div className="grid gap-1 text-sm mb-4">
                            <div className="flex">
                                <span className="text-text-muted w-24 uppercase tracking-wider">TYPE:</span>
                                <span className="text-text-primary">{product.type}</span>
                            </div>
                            <div className="flex">
                                <span className="text-text-muted w-24 uppercase tracking-wider">PRICING:</span>
                                <span className="text-text-primary">{product.pricing}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-text-muted min-w-[6rem] uppercase tracking-wider shrink-0 mt-0.5">GOAL:</span>
                                <span className="text-accent whitespace-pre-line">{product.goal}</span>
                            </div>
                            {product.statusNotes && product.statusNotes.length > 0 && (
                                <div className="flex">
                                    <span className="text-text-muted w-24 uppercase tracking-wider">PHASE:</span>
                                    <span className="text-text-primary">Research (active)</span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <pre className="font-mono text-sm text-text-muted mb-6 whitespace-pre-line font-sans">
                            {product.description}
                        </pre>

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
