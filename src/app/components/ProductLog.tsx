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
}

const PRODUCTS: Product[] = [
    {
        name: "QUICKSALARIES",
        status: "[LIVE]",
        type: "SaaS",
        pricing: "Free / Featured",
        goal: "Authority",
        description: "Salary data aggregation\nTransparent market insights",
        link: "quicksalaries.com",
        url: "https://www.quicksalaries.com/"
    },
    {
        name: "PAYCHASER",
        status: "[LIVE]",
        type: "SaaS",
        pricing: "$9/month · $79/year",
        goal: "R45k/month (~$2.5k)",
        description: "Automated invoice follow-ups\nDesigned for low maintenance",
        link: "paychasers.com",
        url: "https://www.paychasers.com/"
    },
    {
        name: "SWYFTERSWAP", // User called it SwyftSwap, let's keep name consistent but maybe uppercase in UI? keeping source data correct first. User asked for uppercase "Log identifiers".
        status: "[LIVE]",
        type: "Crypto / Platform",
        pricing: "5% flat fee",
        goal: "Financial inclusion",
        description: "Instant airtime-to-usdc\nNon-custodial stellar rails",
        link: "swyftswap.com",
        url: "https://www.swyftswap.com"
    }
];

export default function ProductLog() {
    return (
        <section className="py-8 max-w-[700px]">
            <h2 className="text-base font-medium uppercase tracking-[0.2em] text-text-primary/90 mb-8 max-w-[700px]">LOGS/PRODUCTS</h2>

            <div className="flex flex-col gap-12">
                {PRODUCTS.map((product) => (
                    <div
                        key={product.name}
                        className="group pl-4 border-l-2 border-accent-secondary hover:border-accent transition-colors duration-300"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-lg font-bold text-text-primary group-hover:text-accent transition-colors">
                                [PRODUCT] {product.name.toUpperCase()}
                            </span>
                            <span className="text-xs bg-accent-secondary text-text-primary px-1.5 py-0.5 rounded-sm uppercase">
                                {product.status}
                            </span>
                        </div>

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

                        <pre className="font-mono text-sm text-text-muted mb-4 whitespace-pre-line font-sans">
                            {product.description}
                        </pre>

                        <Link
                            href={product.url}
                            target="_blank"
                            className="text-text-muted border-b border-accent-secondary hover:text-accent hover:border-accent transition-all text-sm inline-block pb-0.5 hover:tracking-wide"
                        >
                            {product.link} ↗
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
}
