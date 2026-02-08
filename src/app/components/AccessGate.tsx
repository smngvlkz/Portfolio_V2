'use client';

import { useState, useRef, useEffect } from 'react';
import { Product } from '@/lib/products';

interface AccessGateProps {
    onGranted: (products: Product[]) => void;
    onClose: () => void;
}

export default function AccessGate({ onGranted, onClose }: AccessGateProps) {
    const [input, setInput] = useState('');
    const [status, setStatus] = useState<'idle' | 'checking' | 'denied' | 'granted' | 'rate_limited'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Close on Escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || status === 'checking') return;

        setStatus('checking');
        setErrorMsg('');

        try {
            const res = await fetch('/api/access', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: input.trim() }),
            });

            const data = await res.json();

            if (res.status === 429) {
                setStatus('rate_limited');
                setErrorMsg(data.error || 'Too many attempts.');
                setInput('');
                return;
            }

            if (data.granted && data.products) {
                setStatus('granted');
                setTimeout(() => onGranted(data.products), 800);
            } else {
                setStatus('denied');
                setInput('');
                setTimeout(() => setStatus('idle'), 1500);
            }
        } catch {
            setStatus('denied');
            setInput('');
            setTimeout(() => setStatus('idle'), 1500);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-[#0a0a0d] border border-accent-secondary/30 rounded-sm p-6 w-full max-w-md mx-4 font-mono">
                <div className="text-xs text-text-muted mb-4 space-y-1">
                    <p>RESTRICTED SECTION</p>
                    <p>This content requires an access code.</p>
                    <p className="text-text-muted/50">Request access via email or LinkedIn.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <span className="text-accent font-bold text-sm">&gt;</span>
                    <input
                        ref={inputRef}
                        type="password"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="enter access code"
                        disabled={status === 'checking' || status === 'granted' || status === 'rate_limited'}
                        className="flex-1 bg-transparent border-none outline-none text-sm text-text-primary placeholder:text-text-muted/50 font-mono"
                        autoComplete="off"
                        spellCheck={false}
                    />
                </form>

                <div className="mt-4 text-xs h-4">
                    {status === 'checking' && (
                        <span className="text-text-muted animate-pulse">verifying...</span>
                    )}
                    {status === 'granted' && (
                        <span className="text-accent font-bold">ACCESS GRANTED</span>
                    )}
                    {status === 'denied' && (
                        <span className="text-red-400 font-bold">ACCESS DENIED</span>
                    )}
                    {status === 'rate_limited' && (
                        <span className="text-red-400 font-bold">{errorMsg}</span>
                    )}
                </div>

                <div className="mt-4 text-xs text-text-muted/40">
                    press ESC to close
                </div>
            </div>
        </div>
    );
}
