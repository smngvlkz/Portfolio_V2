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
        description: "I contribute to the development and maintenance of the production EdTech platform, working across both frontend and backend systems. I collaborate with cross-functional stakeholders and engineering leadership to ship reliable features that improve the learning and teaching experience for students and educators.",
        link: "c4k.io",
        url: "https://c4k.io/",
        stack: ["Vue / Nuxt 3", "AdonisJS v6", "Node.js", "PostgreSQL", "REST APIs", "Konva.js", "AWS S3", "CloudFront", "Cypress", "Japa"],
        infra: ["AWS S3", "CloudFront", "Cloud Infrastructure", "CI/CD Pipelines"],
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
        shippedFeatures: [
            "Built multi-market upgrade flows supporting ZA quote-based sales and international self-serve checkout with annual/quarterly billing",
            "Implemented the UI for per-teacher seat licensing with grade-level content unlocking (Elementary, Middle School, High School)",
            "Built localised upgrade interfaces serving different conversion paths based on account region (ZA quote flow vs international self-serve)",
            "Designed and implemented a public lesson sharing system enabling students to showcase completed coding exercises via shareable URLs, with role-based-controlled access toggles",
            "Built end-to-end media upload pipeline for the lesson whiteboard editor: video, GIF, and YouTube embed support with client-side validation, AdonisJS API handling, and integration with the existing cloud storage and CDN infrastructure",
            "Redesigned lesson tab indicators with distinct completion states, giving students and teachers instant visual progress feedback across multi-step lessons"
        ],
        testing: [
            "Cypress for end-to-end testing of key user flows",
            "Japa for backend/API testing and verifying business logic"
        ]
    }
];
