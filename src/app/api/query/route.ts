import { GoogleGenerativeAI } from '@google/generative-ai';
import { PRODUCTS, getProductBySlug, getAllProductSlugs } from '@/lib/products';
import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a terminal-style query system for a developer portfolio. You respond to queries about products/projects in a concise, technical manner.

Available products: ${getAllProductSlugs().join(', ')}

Product data:
${JSON.stringify(PRODUCTS, null, 2)}

RULES:
1. Only answer questions about the products listed above
2. Keep responses short and terminal-like (no markdown, no verbose explanations)
3. Format lists with "- " prefix
4. If asked about something not in the data, say "No data available for that query"
5. For "help" command, list available commands
6. For "list products" command, list all product names and their status
7. Respond in plain text, not markdown

Example responses:
Query: "show paychasers stack"
Response:
PAYCHASERS STACK:
- Next.js
- TypeScript
- JavaScript
- CSS

Query: "help"
Response:
AVAILABLE COMMANDS:
- show [product] stack
- show [product] infra
- show [product] architecture
- show [product] notes
- list products
- explain [product] [topic]`;

export async function POST(request: NextRequest) {
    try {
        const { query } = await request.json();

        if (!query || typeof query !== 'string') {
            return NextResponse.json({ error: 'Invalid query' }, { status: 400 });
        }

        // Handle simple commands locally for speed
        const lowerQuery = query.toLowerCase().trim();

        if (lowerQuery === 'help') {
            return NextResponse.json({
                response: `AVAILABLE COMMANDS:
- list products         (show all products)
- list fields           (show queryable fields)
- show [product] [field] (show specific field)
- explain [product]      (show all product data)

Products: ${getAllProductSlugs().join(', ')}`
            });
        }

        if (lowerQuery === 'list products') {
            const list = PRODUCTS.map(p => `- ${p.name} [${p.status}]`).join('\n');
            return NextResponse.json({
                response: `PRODUCTS:\n${list}`
            });
        }

        if (lowerQuery === 'list fields' || lowerQuery === 'fields') {
            return NextResponse.json({
                response: `QUERYABLE FIELDS:
- stack (tech stack used)
- infra (infrastructure/hosting)
- architecture (system design)
- payments (payment providers)
- notes (additional details)
- goal (product objective)
- pricing (pricing model)
- status (current state)

Usage: show [product] [field]
Example: show swyftswap architecture`
            });
        }

        // Handle "explain [product]" - show all data for a product
        const explainMatch = lowerQuery.match(/^explain\s+(\w+)$/);
        if (explainMatch) {
            const [, productSlug] = explainMatch;
            const product = getProductBySlug(productSlug);

            if (!product) {
                return NextResponse.json({
                    response: `Product "${productSlug}" not found. Available: ${getAllProductSlugs().join(', ')}`
                });
            }

            let response = `${product.name} [${product.status}]\n`;
            response += `${product.description}\n\n`;
            response += `TYPE: ${product.type}\n`;
            response += `PRICING: ${product.pricing}\n`;
            response += `GOAL: ${product.goal}\n\n`;

            if (product.stack?.length) {
                response += `STACK:\n${product.stack.map(s => `- ${s}`).join('\n')}\n\n`;
            }
            if (product.infra?.length) {
                response += `INFRA:\n${product.infra.map(s => `- ${s}`).join('\n')}\n\n`;
            }
            if (product.architecture?.length) {
                response += `ARCHITECTURE:\n${product.architecture.map(s => `- ${s}`).join('\n')}\n\n`;
            }
            if (product.payments?.length) {
                response += `PAYMENTS:\n${product.payments.map(s => `- ${s}`).join('\n')}\n\n`;
            }
            if (product.notes?.length) {
                response += `NOTES:\n${product.notes.map(s => `- ${s}`).join('\n')}\n\n`;
            }
            if (product.statusNotes?.length) {
                response += `STATUS:\n${product.statusNotes.map(s => `- ${s}`).join('\n')}\n`;
            }

            return NextResponse.json({ response: response.trim() });
        }

        // Parse simple show commands
        const showMatch = lowerQuery.match(/^show\s+(\w+)\s+(\w+)$/);
        if (showMatch) {
            const [, productSlug, field] = showMatch;
            const product = getProductBySlug(productSlug);

            if (!product) {
                return NextResponse.json({
                    response: `Product "${productSlug}" not found. Available: ${getAllProductSlugs().join(', ')}`
                });
            }

            const fieldMap: Record<string, keyof typeof product> = {
                'stack': 'stack',
                'infra': 'infra',
                'architecture': 'architecture',
                'notes': 'notes',
                'payments': 'payments',
                'status': 'status',
                'goal': 'goal',
                'pricing': 'pricing',
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

            return NextResponse.json({
                response: `No "${field}" data for ${product.name}. Try: stack, infra, architecture, notes, payments, goal, pricing`
            });
        }

        // For complex queries, use Gemini
        const apiKey = process.env.GEMINI_API_KEY;
        console.log('[Gemini] API key present:', !!apiKey, 'Length:', apiKey?.length);

        if (!apiKey || apiKey === 'your-key-here') {
            return NextResponse.json({
                response: 'AI queries unavailable. Try: show [product] stack'
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

        const prompt = `${SYSTEM_PROMPT}\n\nUser query: ${query}`;
        const result = await model.generateContent(prompt);

        const response = result.response.text();

        return NextResponse.json({ response });

    } catch (error) {
        console.error('Query error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: `System error: ${errorMessage}` },
            { status: 500 }
        );
    }
}
