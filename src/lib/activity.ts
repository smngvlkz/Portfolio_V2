export const revalidate = 604800; // 1 week

interface ActivityStats {
    github: {
        commits: number;
        repos: number;
        streak?: number;
        history?: Record<string, number>; // YYYY-MM-DD -> count
    };
    gitlab: {
        commits: number;
        activeMonths?: number;
        history?: Record<string, number>; // YYYY-MM-DD -> count
    };
    totalSessions: number;
    shipped: number;
    history?: Record<string, number>; // YYYY-MM-DD -> count (combined, for backward compatibility)
}

// Fallback data if no keys are present
const FALLBACK_STATS: ActivityStats = {
    github: {
        commits: 1243,
        repos: 28,
        streak: 38,
    },
    gitlab: {
        commits: 850,
        activeMonths: 12,
    },
    totalSessions: 1600,
    shipped: 4,
    history: {}
};

async function fetchGitHubStats(token: string) {
    try {
        const query = `
          query {
            viewer {
              contributionsCollection {
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      contributionCount
                      date
                    }
                  }
                }
              }
            }
          }
        `;

        const res = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
            next: { revalidate: 604800 } // Cache for 1 week
        });

        if (!res.ok) return null;
        const data = await res.json();

        if (data.errors) {
            console.error("GitHub GraphQL errors", data.errors);
            return null;
        }

        const calendar = data.data.viewer.contributionsCollection.contributionCalendar;

        // Flatten days
        const days = calendar.weeks.flatMap((w: any) => w.contributionDays);

        // Daily history map
        const history: Record<string, number> = {};

        // Calculate Longest Streak (Iterate chronologically)
        let maxStreak = 0;
        let currentStreak = 0;

        for (const day of days) {
            if (day.contributionCount > 0) {
                history[day.date] = (history[day.date] || 0) + day.contributionCount;
                currentStreak++;
            } else {
                if (currentStreak > maxStreak) maxStreak = currentStreak;
                currentStreak = 0;
            }
        }
        // Final check
        if (currentStreak > maxStreak) maxStreak = currentStreak;

        return {
            repos: 0,
            commits: calendar.totalContributions,
            streak: maxStreak,
            history
        };
    } catch (e) {
        console.error("GitHub fetch failed", e);
        return null;
    }
}

async function fetchGitLabStats(token: string) {
    try {
        // 1. Get User ID
        const userRes = await fetch('https://gitlab.com/api/v4/user', {
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: 604800 }
        });
        if (!userRes.ok) return null;
        const user = await userRes.json();

        // 2. Paginate through ALL events to get dates for streak calculation
        const allDates: Set<string> = new Set();
        // Also track counts for history
        const dateCounts: Record<string, number> = {};

        let page = 1;
        const perPage = 100;
        let hasMore = true;

        while (hasMore) {
            const eventsRes = await fetch(
                `https://gitlab.com/api/v4/users/${user.id}/events?per_page=${perPage}&page=${page}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (!eventsRes.ok) break;

            const events = await eventsRes.json();

            if (events.length === 0) {
                hasMore = false;
            } else {
                // Extract unique dates (YYYY-MM-DD) from event timestamps
                for (const event of events) {
                    if (event.created_at) {
                        const date = event.created_at.split('T')[0];
                        allDates.add(date);
                        dateCounts[date] = (dateCounts[date] || 0) + 1;
                    }
                }
                page++;

                // Safety limit: stop at 100 pages (10,000 events) to prevent infinite loops
                if (page > 100) hasMore = false;
            }
        }

        // 3. Calculate longest streak from sorted dates
        const sortedDates = Array.from(allDates).sort();
        let maxStreak = 0;
        let currentStreak = 0;
        let prevDate: Date | null = null;

        for (const dateStr of sortedDates) {
            const currentDate = new Date(dateStr);

            if (prevDate) {
                const diffDays = Math.round((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    // Consecutive day
                    currentStreak++;
                } else {
                    // Gap in activity
                    if (currentStreak > maxStreak) maxStreak = currentStreak;
                    currentStreak = 1;
                }
            } else {
                currentStreak = 1;
            }

            prevDate = currentDate;
        }

        // Final check
        if (currentStreak > maxStreak) maxStreak = currentStreak;

        return {
            commits: allDates.size, // Total unique active days = sessions
            streak: maxStreak,
            activeMonths: 12,
            history: dateCounts
        };
    } catch (e) {
        console.error("GitLab fetch failed", e);
        return null;
    }
}


export async function getActivityStats(): Promise<ActivityStats> {
    const githubToken = process.env.GITHUB_TOKEN || process.env.GH_PAT;
    const gitlabToken = process.env.GITLAB_TOKEN || process.env.GL_PAT;

    // Debug: Log token availability (not the actual tokens)
    console.log('[Activity] GitHub token:', githubToken ? 'present' : 'missing');
    console.log('[Activity] GitLab token:', gitlabToken ? 'present' : 'missing');

    let stats = { ...FALLBACK_STATS };
    let ghSessions = 0;
    let ghStreak = 0;
    let glStreak = 0;
    let glSessions = 0;

    // Combined history (for backward compatibility)
    const history: Record<string, number> = {};
    // Separate histories
    const githubHistory: Record<string, number> = {};
    const gitlabHistory: Record<string, number> = {};

    // GitHub
    if (githubToken) {
        const ghStats = await fetchGitHubStats(githubToken);
        if (ghStats) {
            ghStreak = ghStats.streak;
            ghSessions = ghStats.commits;
            if (ghStats.history) {
                Object.entries(ghStats.history).forEach(([date, count]) => {
                    githubHistory[date] = count;
                    history[date] = (history[date] || 0) + count;
                });
            }
            console.log('[Activity] GitHub stats:', { ghSessions, ghStreak });
        }
    }

    // GitLab (Full history pagination for real streak)
    if (gitlabToken) {
        const glStats = await fetchGitLabStats(gitlabToken);
        if (glStats) {
            glStreak = glStats.streak || 0;
            glSessions = glStats.commits;
            stats.gitlab.commits = glSessions;
            if (glStats.history) {
                Object.entries(glStats.history).forEach(([date, count]) => {
                    gitlabHistory[date] = count;
                    history[date] = (history[date] || 0) + count;
                });
            }
            console.log('[Activity] GitLab stats:', { glSessions, glStreak });
        }
    }

    // Aggregate Sessions (GitHub contributions + GitLab unique active days)
    const totalFromAPIs = ghSessions + glSessions;

    // DEFENSIVE FALLBACK: If API calls returned 0, use fallback data
    if (totalFromAPIs > 0) {
        stats.totalSessions = totalFromAPIs;
    } else {
        console.log('[Activity] Using fallback sessions:', FALLBACK_STATS.totalSessions);
    }

    // Assign histories if we have any data
    if (Object.keys(history).length > 0) {
        stats.history = history; // Combined for backward compatibility
    }
    if (Object.keys(githubHistory).length > 0) {
        stats.github.history = githubHistory;
    }
    if (Object.keys(gitlabHistory).length > 0) {
        stats.gitlab.history = gitlabHistory;
    }

    // Use the MAX streak between GitHub and GitLab (real data from both)
    const maxStreak = Math.max(ghStreak, glStreak);

    // DEFENSIVE FALLBACK: If streak is 0, use fallback
    if (maxStreak > 0) {
        stats.github.streak = maxStreak;
    } else {
        console.log('[Activity] Using fallback streak:', FALLBACK_STATS.github.streak);
    }

    return stats;
}
