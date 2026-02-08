import { GoogleGenerativeAI } from '@google/generative-ai';
import { PRODUCTS, getProductBySlug, getAllProductSlugs } from '@/lib/products';
import { CONTRIBUTIONS, getContributionById, getAllContributionIds } from '@/lib/contributions';
import { getActivityStats } from '@/lib/activity';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { query } = await request.json();

        if (!query || typeof query !== 'string') {
            return NextResponse.json({ error: 'Invalid query' }, { status: 400 });
        }

        // Fetch stats early so they are available for both local handling and Gemini
        const stats = await getActivityStats();

        const SYSTEM_PROMPT = `You are a terminal-style query system for a developer portfolio. You respond to queries about products/projects, open-source contributions, and system activity in a concise, technical manner.

Available products: ${getAllProductSlugs().join(', ')}
Available contributions: ${getAllContributionIds().join(', ')}

Current System Activity:
- GitHub: ${stats.github.commits.toLocaleString()} commits (${stats.github.streak || 0} day streak)
- GitLab: ${stats.gitlab.commits.toLocaleString()} commits (${stats.gitlab.activeMonths || 0} active months)
- Total Sessions: ${stats.totalSessions.toLocaleString()}
- Products Shipped: ${stats.shipped}

Product data:
${JSON.stringify(PRODUCTS, null, 2)}

Contribution data:
${JSON.stringify(CONTRIBUTIONS, null, 2)}

RESTRICTED CONTENT:
There is a restricted "Work Experience" section that contains professional employment history. If anyone asks about work experience, employment, jobs, code4kids, c4k, or professional history, respond EXACTLY with:
"[RESTRICTED] Work experience data requires an access code. Request access via email (simangalisovilakazk1@icloud.com) or LinkedIn."
Do NOT reveal any details about the restricted content.

RULES:
1. Only answer questions about the products, contributions, and system activity listed above
2. Keep responses short and terminal-like (no markdown, no verbose explanations)
3. Format lists with "- " prefix
4. If asked about something not in the data, say "No data available for that query"
5. For "help" command, list available commands
6. For "list products" command, list all product names and their status
7. For "list all" command, list products and contributions
8. Respond in plain text, not markdown
9. For any query about work experience, employment, or restricted content, always use the restricted response above

Example responses:
Query: "show paychasers stack"
Response:
PAYCHASERS STACK:
- Next.js
- … (etc)

Query: "show activity"
Response:
SYSTEM ACTIVITY:
- GitHub: [actual commits] commits ([streak] day streak)
- GitLab: [actual commits] commits ([months] active months)
- Total Sessions: [total]
- Products Shipped: [count]

Query: "help"
Response:
AVAILABLE COMMANDS:
- show [id] stack
- show [id] focus
- show activity
- list all
- explain [id]`;

        // Handle simple commands locally for speed
        const lowerQuery = query.toLowerCase().trim();

        // Intercept restricted content queries
        const restrictedKeywords = ['code4kids', 'c4k', 'work experience', 'employment', 'job', 'professional experience', 'employer', 'where do you work', 'where does he work', 'current job', 'work history'];
        if (restrictedKeywords.some(kw => lowerQuery.includes(kw))) {
            return NextResponse.json({
                response: '[RESTRICTED] Work experience data requires an access code.\nRequest access via email (simangalisovilakazi1@icloud.com) or LinkedIn.'
            });
        }

        if (lowerQuery === 'help') {
            return NextResponse.json({
                response: `AVAILABLE COMMANDS:
- list all              (show all products and contributions)
- list fields           (show queryable fields)
- show activity         (show system activity stats)
- show [id] [field]     (show specific field for product or contribution)
- explain [id]          (show full data for product or contribution)

IDs: ${[...getAllProductSlugs(), ...getAllContributionIds()].join(', ')}`
            });
        }

        if (lowerQuery === 'list products') {
            const list = PRODUCTS.map(p => `- ${p.name} [${p.status}]`).join('\n');
            return NextResponse.json({
                response: `PRODUCTS:\n${list}`
            });
        }

        if (lowerQuery === 'list all') {
            const productList = PRODUCTS.map(p => `- ${p.name} [${p.status}]`).join('\n');
            const contribList = CONTRIBUTIONS.map(c => `- ${c.name} (${c.type})`).join('\n');
            return NextResponse.json({
                response: `PRODUCTS:\n${productList}\n\nCONTRIBUTIONS:\n${contribList}`
            });
        }

        if (lowerQuery === 'show activity' || lowerQuery === 'activity') {
            return NextResponse.json({
                response: `SYSTEM ACTIVITY:
- GitHub: ${stats.github.commits.toLocaleString()} commits (${stats.github.streak || 0} day streak)
- GitLab: ${stats.gitlab.commits.toLocaleString()} commits (${stats.gitlab.activeMonths || 0} active months)
- Total Sessions: ${stats.totalSessions.toLocaleString()}
- Products Shipped: ${stats.shipped}`
            });
        }

        if (lowerQuery === 'list fields' || lowerQuery === 'fields') {
            return NextResponse.json({
                response: `QUERYABLE FIELDS:
- stack (tech stack used)
- infra (infrastructure/hosting)
- architecture (system design)
- focus (contribution focus)
- role (project role)
- notes (additional details)
- status (current state)

Usage: show [id] [field]
Example: show radcad focus`
            });
        }

        // Handle "explain [id]" - show all data for a product or contribution
        const explainMatch = lowerQuery.match(/^explain\s+([\w-]+)$/);
        if (explainMatch) {
            const [, id] = explainMatch;
            const product = getProductBySlug(id);
            const contrib = getContributionById(id);

            if (product) {
                let response = `${product.name} [${product.status}]\n`;
                response += `${product.description}\n\n`;
                response += `TYPE: ${product.type}\n`;
                response += `PRICING: ${product.pricing}\n`;
                response += `GOAL: ${product.goal}\n\n`;

                if (product.role) {
                    response += `ROLE: ${product.role}\n`;
                }
                if (product.period) {
                    response += `PERIOD: ${product.period}\n`;
                }
                if (product.location) {
                    response += `LOCATION: ${product.location}\n\n`;
                }

                if (product.stack?.length) {
                    response += `STACK:\n${product.stack.map(s => `- ${s}`).join('\n')}\n\n`;
                }
                if (product.infra?.length) {
                    response += `INFRA:\n${product.infra.map(s => `- ${s}`).join('\n')}\n\n`;
                }
                if (product.architecture?.length) {
                    response += `ARCHITECTURE:\n${product.architecture.map(s => `- ${s}`).join('\n')}\n\n`;
                }
                if (product.responsibilities?.length) {
                    response += `RESPONSIBILITIES:\n${product.responsibilities.map(r => `- ${r}`).join('\n')}\n\n`;
                }
                if (product.testing?.length) {
                    response += `TESTING:\n${product.testing.map(t => `- ${t}`).join('\n')}\n\n`;
                }
                if (product.notes?.length) {
                    response += `NOTES:\n${product.notes.map(s => `- ${s}`).join('\n')}\n\n`;
                }
                return NextResponse.json({ response: response.trim() });
            }

            if (contrib) {
                let response = `${contrib.name} (${contrib.type})\n`;
                response += `${contrib.role}\n`;
                response += `${contrib.description}\n\n`;
                if (contrib.stack?.length) {
                    response += `STACK:\n${contrib.stack.map(s => `- ${s}`).join('\n')}\n\n`;
                }
                if (contrib.focus?.length) {
                    response += `FOCUS:\n${contrib.focus.map(s => `- ${s}`).join('\n')}\n\n`;
                }
                return NextResponse.json({ response: response.trim() });
            }

            return NextResponse.json({
                response: `ID "${id}" not found. Available: ${[...getAllProductSlugs(), ...getAllContributionIds()].join(', ')}`
            });
        }

        // Parse simple show commands
        const showMatch = lowerQuery.match(/^show\s+([\w-]+)\s+(\w+)$/);
        if (showMatch) {
            const [, id, field] = showMatch;
            const product = getProductBySlug(id);
            const contrib = getContributionById(id);

            if (product) {
                const fieldMap: Record<string, keyof typeof product> = {
                    'stack': 'stack',
                    'infra': 'infra',
                    'architecture': 'architecture',
                    'notes': 'notes',
                    'status': 'status',
                    'responsibilities': 'responsibilities',
                    'testing': 'testing',
                    'role': 'role'
                };

                const fieldKey = fieldMap[field];
                if (fieldKey && product[fieldKey]) {
                    const value = product[fieldKey];
                    const formatted = Array.isArray(value)
                        ? value.map(v => `- ${v}`).join('\n')
                        : value;
                    return NextResponse.json({
                        response: `${product.name} ${field.toUpperCase()}:\n${formatted}`
                    });
                }
            }

            if (contrib) {
                const fieldMap: Record<string, keyof typeof contrib> = {
                    'stack': 'stack',
                    'focus': 'focus',
                    'role': 'role',
                    'description': 'description',
                };

                const fieldKey = fieldMap[field];
                if (fieldKey && contrib[fieldKey]) {
                    const value = contrib[fieldKey];
                    const formatted = Array.isArray(value)
                        ? value.map(v => `- ${v}`).join('\n')
                        : value;
                    return NextResponse.json({
                        response: `${contrib.name} ${field.toUpperCase()}:\n${formatted}`
                    });
                }
            }

            if (product || contrib) {
                return NextResponse.json({
                    response: `No "${field}" data for ${id}. Try: stack, architecture, focus, notes`
                });
            }

            return NextResponse.json({
                response: `ID "${id}" not found. Available: ${[...getAllProductSlugs(), ...getAllContributionIds()].join(', ')}`
            });
        }

        // For complex queries, use Gemini
        const apiKey = process.env.GEMINI_API_KEY;

        // Debug Log
        console.log('[Terminal API] Query:', lowerQuery);
        console.log('[Terminal API] Key status:', apiKey ? (apiKey === 'your-key-here' ? 'placeholder' : 'provided') : 'missing');

        if (!apiKey || apiKey === 'your-key-here') {
            return NextResponse.json({
                response: 'AI queries unavailable. Try: show activity (handled locally)'
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

        try {
            const prompt = `${SYSTEM_PROMPT}\n\nUser query: ${query}`;
            const result = await model.generateContent(prompt);
            const response = result.response.text();
            return NextResponse.json({ response });
        } catch (apiError: any) {
            console.error('[Terminal API] Gemini Error:', apiError);
            return NextResponse.json({
                error: `Gemini API Error: ${apiError.message || 'Unknown API error'}`
            }, { status: 500 });
        }

    } catch (error) {
        console.error('System error:', error);
        return NextResponse.json(
            { error: `System error: ${error instanceof Error ? error.message : 'Unknown'}` },
            { status: 500 }
        );
    }
}
