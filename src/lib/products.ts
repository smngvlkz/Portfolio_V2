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
    // Extended fields for professional experience
    role?: string;
    period?: string;
    location?: string;
    responsibilities?: string[];
    testing?: string[];
}

export const PRODUCTS: Product[] = [
    /*
    {
        name: "CODE4KIDS PLATFORM",
        slug: "code4kids",
        status: "LIVE",
        type: "EdTech / Professional",
        pricing: "B2B SaaS",
        goal: "Educational Impact",
        description: "I contribute to the development and maintenance of the production EdTech platform, working across both frontend and backend systems. I collaborate with cross-functional stakeholders and engineering leadership to ship reliable features that improve the learning experience for students and educators.",
        link: "c4k.io",
        url: "https://c4k.io/",
        stack: ["Vue / React", "Node.js", "PostgreSQL", "REST APIs", "Cypress", "Japa"],
        infra: ["Cloud Infrastructure", "CI/CD Pipelines"],
        role: "Full-Stack Engineer",
        period: "Oct 2024 – Present",
        location: "South Africa · Remote",
        responsibilities: [
            "Build and improve user-facing features that support student learning and educator workflows",
            "Work through the full product lifecycle: requirements clarification, implementation, testing, bug-fixing, and release support",
            "Collaborate with stakeholders and Head of Engineering to align delivery with product priorities",
            "Participate in code reviews to maintain quality, consistency, and maintainability",
            "Debug production issues and deliver fixes with a strong focus on reliability",
            "Contribute ideas to improve internal processes and developer experience"
        ],
        testing: [
            "Cypress for end-to-end testing of key user flows",
            "Japa for backend/API testing and verifying business logic"
        ]
    },
    */
    {
        name: "PAYCHASERS",
        slug: "paychasers",
        status: "LIVE",
        type: "SaaS",
        pricing: "Free / Pro $9/month",
        goal: "Sustainable recurring SaaS revenue",
        description: "Automated invoice follow-ups. Designed for low maintenance.",
        link: "paychasers.com",
        url: "https://www.paychasers.com/",
        stack: ["Next.js", "TypeScript", "JavaScript", "CSS"],
        infra: ["Vercel", "PostgreSQL"],
        payments: ["LemonSqueezy (integration in progress)"]
    },
    {
        name: "QUICKSALARIES",
        slug: "quicksalaries",
        status: "LIVE",
        type: "SaaS",
        pricing: "Free / Pro $14.99 LIFETIME",
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
        name: "PATHFORGE",
        slug: "pathforge",
        status: "LIVE",
        type: "EdTech & Mentorship Platform",
        pricing: "Free FOREVER / Premium planned for mentors & orgs",
        goal: "Reduce Women and Youth unemployment by enabling practical, project-based skill development, mentorship, and career readiness",
        description: "PathForge is a free mentorship and skills development platform helping South African women and youth gain real work experience through project-based learning, addressing the country's high unemployment challenge.",
        link: "pathforge.co.za",
        url: "https://pathforge.co.za",
        stack: ["React", "TypeScript", "Node.js", "Express", "Prisma", "PostgreSQL", "TailwindCSS"],
        infra: ["Huawei Cloud ECS", "Huawei Cloud OBS", "Vercel", "Neon Database"],
        architecture: ["RESTful APIs", "JWT Authentication", "Cloud-native file storage", "Real-time messaging (Socket.io)"],
        payments: ["Payment confirmation model (no processing)"],
        notes: [
            "Huawei Developer Competition 2025 Entry",
            "Deployed on Huawei Cloud infrastructure",
            "10,000+ job placements target (Year 1)",
            "Built for South African market realities"
        ],
        focus: ["Women and youth employment in South Africa", "Mentor-mentee matching", "Task delegation & tracking", "Portfolio building", "Trust & safety systems"]
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
