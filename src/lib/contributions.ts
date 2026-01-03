export interface ContributionItem {
    id: string;
    name: string;
    role: string;
    description: string;
    stack: string[];
    focus: string[];
    link: string;
    url: string;
    type: 'Acknowledgement' | 'Community';
}

export const CONTRIBUTIONS: ContributionItem[] = [
    {
        id: "radcad",
        name: "radCAD",
        type: "Acknowledgement",
        role: "Credited contributor",
        description: "Open-source simulation framework.",
        stack: ["Python", "CI/CD"],
        focus: ["cadCAD compatibility mode", "CI pipeline improvements"],
        link: "github.com/CADLabs/radCAD",
        url: "https://github.com/CADLabs/radCAD"
    },
    {
        id: "cape-community",
        name: "Cape Software Community Blog",
        type: "Community",
        role: "Creator & Maintainer (Commissioned Project)",
        description: "Built the Cape Software Community website from the ground up as a commissioned bounty project and continue to maintain and evolve it.",
        stack: ["Next.js", "JavaScript", "Markdown", "Tailwind CSS"],
        focus: ["Static generation", "contributor-friendly architecture", "community contribution flow"],
        link: "capedevs.github.io",
        url: "https://capedevs.github.io"
    }
];

export function getContributionById(id: string): ContributionItem | undefined {
    return CONTRIBUTIONS.find(c => c.id.toLowerCase() === id.toLowerCase());
}

export function getAllContributionIds(): string[] {
    return CONTRIBUTIONS.map(c => c.id);
}
