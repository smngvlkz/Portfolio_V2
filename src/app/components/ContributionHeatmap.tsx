'use client';

import { useState, useRef } from 'react';
import clsx from 'clsx';

interface ContributionHeatmapProps {
    history?: Record<string, number>;
    githubHistory?: Record<string, number>;
    gitlabHistory?: Record<string, number>;
}

interface TooltipData {
    date: string;
    dateFormatted: string;
    dayOfWeek: string;
    contributions: number;
    githubCount: number;
    gitlabCount: number;
    x: number;
    y: number;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function ContributionHeatmap({ history, githubHistory, gitlabHistory }: ContributionHeatmapProps) {
    const [tooltip, setTooltip] = useState<TooltipData | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    const formatDate = (date: Date): string => {
        const month = MONTHS[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month} ${day}, ${year}`;
    };

    return (
        <div className="relative" ref={containerRef}>
            <div className="flex flex-wrap gap-1 max-w-[600px] mb-2" ref={gridRef}>
                {Array.from({ length: 111 }).map((_, i) => {
                    // Calculate date for this cell (going backwards from today)
                    // i=110 is today, i=0 is 111 days ago
                    const daysAgo = 110 - i;
                    const date = new Date();
                    date.setDate(date.getDate() - daysAgo);
                    const dateStr = date.toISOString().split('T')[0];

                    // Get real stats if available
                    const realCount = history ? (history[dateStr] || 0) : 0;
                    const githubCount = githubHistory ? (githubHistory[dateStr] || 0) : 0;
                    const gitlabCount = gitlabHistory ? (gitlabHistory[dateStr] || 0) : 0;

                    // Map real count to level
                    let realLevel = 0;
                    if (realCount > 0) realLevel = 1;
                    if (realCount > 2) realLevel = 2;
                    if (realCount > 5) realLevel = 3;
                    if (realCount > 9) realLevel = 4;

                    // 5 days on, 2 days off pattern, shifting each row essentially
                    // Use actual day of week from date (0=Sunday, 6=Saturday)
                    const dayOfWeek = date.getDay();
                    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday

                    // Deterministic pseudo-random based on index to keep SSR consistent
                    const prng = ((i * 1337 + 7331) % 1000) / 1000;

                    let fakeLevel = 0;
                    if (isWeekend) {
                        // Mostly off, occasional light work
                        fakeLevel = prng > 0.85 ? 1 : 0;
                    } else {
                        // Weekdays: mix of levels
                        if (prng < 0.1) fakeLevel = 0;      // 10% chance off
                        else if (prng < 0.35) fakeLevel = 1; // 25% low
                        else if (prng < 0.65) fakeLevel = 2; // 30% med
                        else if (prng < 0.9) fakeLevel = 3;  // 25% high
                        else fakeLevel = 4;                  // 10% max
                    }

                    // Hybrid: Use real data if present to "boost" the graph, 
                    // ensuring it always looks busy/realistic but accurate for active days.
                    const level = Math.max(realLevel, fakeLevel);

                    // Only show tooltip for squares with real contributions
                    const hasRealContributions = realCount > 0;

                    return (
                        <div
                            key={i}
                            className={clsx(
                                "w-3 h-3 transition-colors duration-300 relative group",
                                hasRealContributions && "cursor-pointer",
                                level === 0 && "bg-accent-secondary/10",
                                level === 1 && "bg-accent/20",
                                level === 2 && "bg-accent/40",
                                level === 3 && "bg-accent/70",
                                level === 4 && "bg-accent/100"
                            )}
                            onMouseEnter={(e) => {
                                // Only show tooltip if there are real contributions
                                if (!hasRealContributions) return;
                                
                                if (!containerRef.current || !gridRef.current) return;
                                
                                const square = e.currentTarget;
                                const squareRect = square.getBoundingClientRect();
                                const gridRect = gridRef.current.getBoundingClientRect();
                                const containerRect = containerRef.current.getBoundingClientRect();
                                
                                // Calculate position relative to container
                                // Get the square's position relative to the grid, then add grid's position relative to container
                                const gridOffsetLeft = gridRect.left - containerRect.left;
                                const gridOffsetTop = gridRect.top - containerRect.top;
                                
                                // Square position relative to grid
                                const squareOffsetX = squareRect.left - gridRect.left;
                                const squareOffsetY = squareRect.top - gridRect.top;
                                
                                // Final position relative to container
                                const x = gridOffsetLeft + squareOffsetX + squareRect.width / 2;
                                const y = gridOffsetTop + squareOffsetY;
                                
                                setTooltip({
                                    date: dateStr,
                                    dateFormatted: formatDate(date),
                                    dayOfWeek: DAYS[dayOfWeek],
                                    contributions: realCount,
                                    githubCount,
                                    gitlabCount,
                                    x,
                                    y,
                                });
                            }}
                            onMouseLeave={() => setTooltip(null)}
                        />
                    );
                })}
            </div>

            {/* Tooltip */}
            {tooltip && (
                <div
                    className="absolute z-50 pointer-events-none"
                    style={{
                        left: `${tooltip.x}px`,
                        top: `${tooltip.y}px`,
                        transform: 'translate(-50%, -100%)',
                        marginTop: '-8px',
                    }}
                >
                    <div className="bg-accent-secondary/95 backdrop-blur-sm border border-accent/30 rounded px-3 py-2 shadow-lg min-w-[180px]">
                        <div className="text-text-primary text-sm font-bold mb-1">
                            {tooltip.contributions > 0 ? (
                                <span className="text-accent">{tooltip.contributions}</span>
                            ) : (
                                <span className="text-text-muted">No</span>
                            )}{' '}
                            {tooltip.contributions === 1 ? 'contribution' : 'contributions'}
                        </div>
                        {(tooltip.githubCount > 0 || tooltip.gitlabCount > 0) && (
                            <div className="text-text-muted text-xs mb-1">
                                {tooltip.githubCount > 0 && tooltip.gitlabCount > 0 ? (
                                    <span>GitHub: {tooltip.githubCount} • GitLab: {tooltip.gitlabCount}</span>
                                ) : tooltip.githubCount > 0 ? (
                                    <span>GitHub commit{tooltip.githubCount !== 1 ? 's' : ''}</span>
                                ) : (
                                    <span>GitLab commit{tooltip.gitlabCount !== 1 ? 's' : ''}</span>
                                )}
                            </div>
                        )}
                        <div className="text-text-muted text-xs">
                            {tooltip.dayOfWeek}
                        </div>
                        <div className="text-text-muted text-xs mt-0.5">
                            {tooltip.dateFormatted}
                        </div>
                    </div>
                    {/* Tooltip arrow */}
                    <div
                        className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-accent-secondary/95 border-r border-b border-accent/30 rotate-45"
                        style={{ transform: 'translate(-50%, 50%) rotate(45deg)' }}
                    />
                </div>
            )}
        </div>
    );
}
