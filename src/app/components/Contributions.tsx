'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CONTRIBUTIONS } from '@/lib/contributions';

export default function Contributions() {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const acknowledgements = CONTRIBUTIONS.filter(c => c.type === 'Acknowledgement');
    const communityItems = CONTRIBUTIONS.filter(c => c.type === 'Community');

    return (
        <div className="flex flex-col gap-20 max-w-[700px]">
            {/* Acknowledgements Section */}
            {acknowledgements.length > 0 && (
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-text-primary/90 mb-6 border-b border-accent-secondary/40 pb-2 w-max pr-12">
                        ACKNOWLEDGEMENTS
                    </h2>
                    <div className="space-y-12">
                        {acknowledgements.map((item) => (
                            <div key={item.id} className="text-text-primary text-sm space-y-3">
                                <p className="leading-relaxed">
                                    {item.role} to the <span className="text-sm font-bold text-accent">{item.name}</span> {item.description}.
                                </p>
                                <div className="pl-0 opacity-80">
                                    <p className="text-text-muted mb-2 text-xs uppercase tracking-wide">Contribution:</p>
                                    <ul className="list-none pl-4 text-text-muted space-y-2 border-l-2 border-accent-secondary/20">
                                        {item.focus.map((f, i) => (
                                            <li key={i}>- {f}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mt-4">
                                    <Link
                                        href={item.url}
                                        target="_blank"
                                        className="text-text-muted border-b border-accent-secondary hover:text-accent hover:border-accent transition-all text-sm inline-block pb-0.5 hover:tracking-wide"
                                    >
                                        {item.link} ↗
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Community Section */}
            {communityItems.length > 0 && (
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-text-primary/90 mb-6 border-b border-accent-secondary/40 pb-2 w-max pr-12">
                        COMMUNITY
                    </h2>
                    <div className="space-y-12">
                        {communityItems.map((item) => (
                            <div key={item.id} className="text-text-primary text-sm space-y-4">
                                <p className="text-sm font-bold text-accent uppercase tracking-wide">
                                    {item.name}
                                </p>
                                <div className="grid gap-4 mt-2">
                                    <div className="space-y-2">
                                        <div className="flex items-start">
                                            <span className="text-text-muted min-w-[4.5rem] shrink-0 uppercase tracking-widest text-xs opacity-70 pt-0.5">ROLE:</span>
                                            <span className="font-medium">{item.role}</span>
                                        </div>
                                        <p className="text-text-muted text-sm leading-relaxed pl-[4.5rem]">
                                            {item.description}
                                        </p>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-text-muted min-w-[4.5rem] shrink-0 uppercase tracking-widest text-xs opacity-70 pt-0.5">STACK:</span>
                                        <span>{item.stack.join(', ')}</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-text-muted min-w-[4.5rem] shrink-0 uppercase tracking-widest text-xs opacity-70 pt-0.5">FOCUS:</span>
                                        <span>{item.focus.join(', ')}</span>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <button
                                        onClick={() => setPreviewUrl(item.url)}
                                        className="text-text-muted border-b border-accent-secondary hover:text-accent hover:border-accent transition-all text-sm inline-block pb-0.5 hover:tracking-wide"
                                    >
                                        {item.link} ↗
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
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
                            title="Preview"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
