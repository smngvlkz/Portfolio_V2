'use client';

import { useState, useRef, useEffect } from 'react';

interface TerminalLine {
    type: 'input' | 'output' | 'error' | 'system';
    content: string;
}

const INITIAL_HISTORY: TerminalLine[] = [
    { type: 'system', content: 'SYSTEM QUERY (powered by Gemini)' },
    { type: 'system', content: 'Type "help" for commands. Try: show paychasers stack' },
];

export default function Terminal() {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<TerminalLine[]>(INITIAL_HISTORY);
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const terminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

    const clearTerminal = () => {
        setHistory(INITIAL_HISTORY);
        setInput('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userInput = input.trim();
        setInput('');
        setCommandHistory(prev => [...prev, userInput]);
        setHistoryIndex(-1);
        // Handle clear command locally
        if (userInput.toLowerCase() === 'clear') {
            clearTerminal();
            return;
        }

        setHistory(prev => [...prev, { type: 'input', content: `> ${userInput}` }]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: userInput }),
            });

            const data = await response.json();

            if (response.ok) {
                setHistory(prev => [...prev, { type: 'output', content: data.response }]);
            } else {
                setHistory(prev => [...prev, { type: 'error', content: data.error || 'Unknown error' }]);
            }
        } catch {
            setHistory(prev => [...prev, { type: 'error', content: 'Failed to connect to system' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Ctrl+C - clear input
        if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
            setInput('');
            setHistory(prev => [...prev, { type: 'input', content: `> ${input}^C` }]);
            return;
        }

        // Ctrl+L - clear terminal
        if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            clearTerminal();
            return;
        }

        // Arrow Up - previous command
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0) {
                const newIndex = historyIndex === -1
                    ? commandHistory.length - 1
                    : Math.max(0, historyIndex - 1);
                setHistoryIndex(newIndex);
                setInput(commandHistory[newIndex]);
            }
            return;
        }

        // Arrow Down - next command
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex !== -1) {
                const newIndex = historyIndex + 1;
                if (newIndex >= commandHistory.length) {
                    setHistoryIndex(-1);
                    setInput('');
                } else {
                    setHistoryIndex(newIndex);
                    setInput(commandHistory[newIndex]);
                }
            }
            return;
        }

        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    return (
        <section id="system-query" className="max-w-[700px] mb-16 scroll-mt-8">
            <h2 className="text-base font-medium uppercase tracking-[0.2em] text-text-primary/90 mb-6 border-b border-accent-secondary/40 pb-2 w-max pr-12">
                SYSTEM.QUERY
            </h2>

            <div
                className="bg-[#0a0a0d] border border-accent-secondary/30 rounded-sm p-4 font-mono text-sm"
                onClick={() => inputRef.current?.focus()}
            >
                <div
                    ref={terminalRef}
                    className="max-h-[300px] overflow-y-auto space-y-2 mb-4"
                >
                    {history.map((line, i) => (
                        <div
                            key={i}
                            className={`whitespace-pre-wrap ${
                                line.type === 'input' ? 'text-accent' :
                                line.type === 'error' ? 'text-red-400' :
                                line.type === 'system' ? 'text-text-muted text-xs' :
                                'text-text-primary'
                            }`}
                        >
                            {line.content}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="text-text-muted">
                            <span className="animate-pulse">processing...</span>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <span className="text-accent font-bold">&gt;</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="show paychasers stack"
                        disabled={isLoading}
                        className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder:text-text-muted/50"
                        autoComplete="off"
                        spellCheck={false}
                    />
                </form>
            </div>

            <p className="text-text-muted text-xs mt-3 opacity-70">
                help | list all | show activity | show [id] [field] | explain [id] | clear
            </p>
        </section>
    );
}
