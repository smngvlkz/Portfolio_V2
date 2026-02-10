'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PRODUCTS, Product } from '@/lib/products';
import AccessGate from './AccessGate';

export default function ProductLog() {
    const [protectedProducts, setProtectedProducts] = useState<Product[]>([]);
    const [showGate, setShowGate] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const renderProduct = (product: Product) => (
        <div
            key={product.name}
            className="group pl-4 border-l-2 border-accent-secondary hover:border-accent transition-colors duration-300"
        >
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors uppercase tracking-wide">
                    [PRODUCT] {product.name}
                </span>
                <span className="text-xs bg-accent-secondary text-text-primary px-1.5 py-0.5 rounded-sm uppercase">
                    {product.status}
                </span>
            </div>

            {/* Professional details: Role & Location (if present) */}
            {(product.role || product.location) && (
                <div className="grid gap-1 text-sm mb-4">
                    {product.role && (
                        <div className="flex items-start">
                            <span className="text-text-muted min-w-24 shrink-0 uppercase tracking-wider">ROLE:</span>
                            <span className="text-text-primary font-bold">{product.role}</span>
                        </div>
                    )}
                    {product.location && (
                        <div className="flex items-start">
                            <span className="text-text-muted min-w-24 shrink-0 uppercase tracking-wider">LOCATION:</span>
                            <span className="text-text-primary">{product.location}</span>
                        </div>
                    )}
                    {product.period && (
                        <div className="flex items-start">
                            <span className="text-text-muted min-w-24 shrink-0 uppercase tracking-wider">PERIOD:</span>
                            <span className="text-text-primary">{product.period}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Standard fields: TYPE, PRICING, GOAL, PHASE */}
            <div className="grid gap-1 text-sm mb-4">
                <div className="flex items-start">
                    <span className="text-text-muted min-w-24 shrink-0 uppercase tracking-wider">TYPE:</span>
                    <span className="text-text-primary">{product.type}</span>
                </div>
                <div className="flex items-start">
                    <span className="text-text-muted min-w-24 shrink-0 uppercase tracking-wider">PRICING:</span>
                    <span className="text-text-primary">
                        {(() => {
                            const highlights = ['FOREVER', 'LIFETIME'];
                            const parts = product.pricing.split(new RegExp(`(${highlights.join('|')})`));
                            if (parts.length === 1) return product.pricing;
                            return parts.map((part, i) =>
                                highlights.includes(part) ? (
                                    <span key={i} className="bg-text-muted/20 px-1.5 py-0.5 rounded-sm text-text-primary font-bold">{part}</span>
                                ) : (
                                    <span key={i}>{part}</span>
                                )
                            );
                        })()}
                    </span>
                </div>
                <div className="flex items-start">
                    <span className="text-text-muted min-w-24 shrink-0 uppercase tracking-wider">GOAL:</span>
                    <span className="text-accent whitespace-pre-line">{product.goal}</span>
                </div>
                <div className="flex items-start">
                    <span className="text-text-muted min-w-24 shrink-0 uppercase tracking-wider">STACK:</span>
                    <span className="text-text-primary">{product.stack.join(', ')}</span>
                </div>
                {product.statusNotes && product.statusNotes.length > 0 && (
                    <div className="flex items-start">
                        <span className="text-text-muted min-w-24 shrink-0 uppercase tracking-wider">PHASE:</span>
                        <span className="text-text-primary">Research <span className="bg-text-muted/20 px-1.5 py-0.5 rounded-sm text-text-primary font-bold">ONGOING</span></span>
                    </div>
                )}
            </div>

            {/* Description */}
            <p className="text-sm text-text-muted mb-6 leading-relaxed whitespace-pre-line">
                {product.description}
            </p>

            {/* Responsibilities (Professional Work) */}
            {product.responsibilities && product.responsibilities.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-xs text-text-muted uppercase tracking-widest mb-3">Key Responsibilities:</h3>
                    <ul className="space-y-2 text-sm text-text-primary/90">
                        {product.responsibilities.map((r, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <span className="text-accent mt-1">→</span>
                                <span>{r}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Selected Shipped Features */}
            {product.shippedFeatures && product.shippedFeatures.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-xs text-text-muted uppercase tracking-widest mb-3">Selected Shipped Features:</h3>
                    <ul className="space-y-2 text-sm text-text-primary/90">
                        {product.shippedFeatures.map((f, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <span className="text-accent mt-1">→</span>
                                <span>{f}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Testing Section */}
            {product.testing && product.testing.length > 0 && (
                <div className="mb-6 p-4 bg-accent-secondary/10 border-l-2 border-accent/40">
                    <h3 className="text-xs text-accent uppercase tracking-widest mb-3 font-bold">QA & Testing:</h3>
                    <ul className="space-y-2 text-sm text-text-primary/90">
                        {product.testing.map((t, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <span className="text-accent mt-1">✓</span>
                                <span>{t}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Link */}
            {product.url && (
                <div className="mt-2 relative">
                    {!product.protected ? (
                        <button
                            onClick={() => setPreviewUrl(product.url!)}
                            className="text-text-muted border-b border-accent-secondary hover:text-accent hover:border-accent transition-all text-sm inline-block pb-0.5 hover:tracking-wide"
                        >
                            {product.link} ↗
                        </button>
                    ) : (
                        <Link
                            href={product.url}
                            target="_blank"
                            className="text-text-muted border-b border-accent-secondary hover:text-accent hover:border-accent transition-all text-sm inline-block pb-0.5 hover:tracking-wide"
                        >
                            {product.link} ↗
                        </Link>
                    )}
                </div>
            )}
        </div>
    );

    return (
        <section className="py-8 max-w-[700px]">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-text-primary/90 mb-8 max-w-[700px]">LOGS/PRODUCTS</h2>

            <div className="flex flex-col gap-16">
                {/* Public products */}
                {PRODUCTS.map(renderProduct)}

                {/* Protected section */}
                {protectedProducts.length > 0 ? (
                    protectedProducts.map(renderProduct)
                ) : (
                    <div className="pl-4 border-l-2 border-accent-secondary/30">
                        <div className="flex items-center gap-4 mb-3">
                            <span className="text-sm font-bold text-text-muted uppercase tracking-wide">
                                [RESTRICTED] WORK EXPERIENCE
                            </span>
                            <span className="text-xs bg-accent-secondary/50 text-text-muted px-1.5 py-0.5 rounded-sm uppercase">
                                locked
                            </span>
                        </div>
                        <p className="text-xs text-text-muted/60 mb-4">
                            Professional work experience is available with an access code.
                        </p>
                        <button
                            onClick={() => setShowGate(true)}
                            className="text-xs text-text-muted border-b border-accent-secondary hover:text-accent hover:border-accent transition-all pb-0.5"
                        >
                            &gt; enter access code
                        </button>
                    </div>
                )}
            </div>

            {showGate && (
                <AccessGate
                    onGranted={(products) => {
                        setProtectedProducts(products);
                        setShowGate(false);
                    }}
                    onClose={() => setShowGate(false)}
                />
            )}

            {/* Preview Modal */}
            {previewUrl && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={() => setPreviewUrl(null)}
                >
                    <div
                        className="relative w-full max-w-5xl h-[80vh] bg-[#0a0a0d] border border-accent-secondary/30 rounded-sm overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-2 border-b border-accent-secondary/30 bg-[#0a0a0d]">
                            <span className="text-xs text-text-muted font-mono truncate">{previewUrl}</span>
                            <div className="flex items-center gap-3">
                                <Link
                                    href={previewUrl}
                                    target="_blank"
                                    className="text-xs text-text-muted hover:text-accent transition-colors"
                                >
                                    open in new tab ↗
                                </Link>
                                <button
                                    onClick={() => setPreviewUrl(null)}
                                    className="text-text-muted hover:text-accent transition-colors text-lg leading-none"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                        {/* Iframe */}
                        <iframe
                            src={previewUrl}
                            className="w-full h-[calc(100%-40px)]"
                            title="Product Preview"
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
