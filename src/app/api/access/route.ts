import { NextRequest, NextResponse } from 'next/server';
import { PROTECTED_PRODUCTS } from '@/lib/protected-products';

// Simple in-memory rate limiter
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60 * 1000; // 1 minute

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const record = attempts.get(ip);

    if (!record || now > record.resetAt) {
        attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
        return false;
    }

    record.count++;
    return record.count > MAX_ATTEMPTS;
}

export async function POST(request: NextRequest) {
    try {
        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

        if (isRateLimited(ip)) {
            return NextResponse.json(
                { granted: false, error: 'Too many attempts. Try again in 1 minute.' },
                { status: 429 }
            );
        }

        const { code } = await request.json();

        if (!code || typeof code !== 'string') {
            return NextResponse.json({ granted: false }, { status: 400 });
        }

        const accessCode = process.env.ACCESS_CODE;

        if (!accessCode) {
            return NextResponse.json({ granted: false }, { status: 503 });
        }

        const granted = code.trim().toLowerCase() === accessCode.trim().toLowerCase();

        if (granted) {
            return NextResponse.json({ granted: true, products: PROTECTED_PRODUCTS });
        }

        return NextResponse.json({ granted: false });
    } catch {
        return NextResponse.json({ granted: false }, { status: 500 });
    }
}
