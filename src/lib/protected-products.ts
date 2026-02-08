import 'server-only';
import { Product } from './products';

// This file is server-only — never bundled into client JS
export const PROTECTED_PRODUCTS: Product[] = [
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
        protected: true,
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
    }
];
