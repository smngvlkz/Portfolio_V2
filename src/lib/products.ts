export interface Product {
    name: string;
    slug: string;
    status: string;
    type: string;
    pricing: string;
    goal: string;
    description: string;
    link: string;
    url: string;
    stack: string[];
    infra: string[];
    payments?: string[];
    architecture?: string[];
    notes?: string[];
    focus?: string[];
    statusNotes?: string[];
}

export const PRODUCTS: Product[] = [
    {
        name: "QUICKSALARIES",
        slug: "quicksalaries",
        status: "LIVE",
        type: "SaaS",
        pricing: "Free / Pro $4.99/month",
        goal: "Authority",
        description: "Salary data aggregation. Transparent market insights.",
        link: "quicksalaries.com",
        url: "https://www.quicksalaries.com/",
        stack: ["HTML", "CSS", "JavaScript", "No framework"],
        infra: ["Microsoft Azure", "Static delivery"],
        payments: ["LemonSqueezy"],
        notes: ["Intentionally minimal", "Backend-free by design"]
    },
    {
        name: "PAYCHASERS",
        slug: "paychasers",
        status: "LIVE",
        type: "SaaS",
        pricing: "Free / Pro $9/month",
        goal: "Sustainable recurring SaaS revenue (~R45k/month)",
        description: "Automated invoice follow-ups. Designed for low maintenance.",
        link: "paychasers.com",
        url: "https://www.paychasers.com/",
        stack: ["Next.js", "TypeScript", "JavaScript", "CSS"],
        infra: ["Vercel", "PostgreSQL"],
        payments: ["LemonSqueezy (integration in progress)"]
    },
    {
        name: "SWYFTSWAP",
        slug: "swyftswap",
        status: "ARCHIVED",
        type: "Crypto / Platform",
        pricing: "5% flat fee",
        goal: "Financial inclusion",
        description: "Instant airtime-to-USDC. Non-custodial Stellar rails.",
        link: "swyftswap.com",
        url: "https://www.swyftswap.com",
        stack: ["Vue", "JavaScript", "TypeScript", "Rust (Soroban smart contracts)", "Stellar blockchain"],
        infra: ["Vercel", "Stellar Network"],
        architecture: ["Non-custodial", "Smart contract-driven settlement", "SMS-triggered transactions (infra-ready)"],
        statusNotes: ["Archived (research ongoing)", "End-to-end system fully built and deployed"],
        notes: ["Self-custodial USDC delivery", "Reduced regulatory surface via non-custodial model"]
    }
];

export function getProductBySlug(slug: string): Product | undefined {
    return PRODUCTS.find(p => p.slug.toLowerCase() === slug.toLowerCase());
}

export function getAllProductSlugs(): string[] {
    return PRODUCTS.map(p => p.slug);
}
