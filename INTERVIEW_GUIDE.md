# Portfolio Project Interview Guide

## Quick Elevator Pitch (30 seconds)

"I built a terminal-inspired portfolio that showcases my shipped products and contributions. It's not a typical marketing site - it's structured like internal system documentation. The standout feature is an interactive terminal powered by Google Gemini AI where users can query my entire portfolio using natural language or structured commands. It also pulls live contribution data from GitHub and GitLab, displaying a 111-day activity heatmap. The whole thing is containerized and deployed on Google Cloud Run."

## One-Minute Version

"My portfolio reflects how I actually work as an engineer - pragmatic and execution-focused. Instead of flashy animations, I built a functional terminal interface where visitors can run commands like `show paychasers stack` or ask 'which product uses blockchain?' The system is smart about performance - simple queries run locally for instant responses, while complex questions fall back to Google Gemini AI.

It integrates with GitHub and GitLab APIs to show real contribution data, including a custom heatmap visualization. The design philosophy is intentional restraint - AI is only used where it adds value, not as a gimmick. Everything is built with Next.js, TypeScript, and Tailwind CSS, containerized with Docker, and deployed on Google Cloud Run."

---

## Technical Deep Dive Points

### 1. Architecture Decisions

**Why Next.js App Router?**
- Server Components for optimal performance
- Built-in API routes for the Gemini integration
- ISR (Incremental Static Regeneration) for activity data caching
- Full-stack capabilities in a single codebase

**The Terminal Implementation:**
```typescript
// Key technical decisions:
- Command history with Arrow key navigation
- Keyboard shortcuts (Ctrl+C, Ctrl+L)
- Auto-scroll to bottom on new output
- Separate input/output color coding
- Loading states with animated indicators
```

**Performance Optimization Strategy:**
- Local command handling for instant responses (no API call for 'help', 'list all')
- 1-week ISR cache for GitHub/GitLab activity data
- Async component rendering with Server Components
- Smart query routing: simple → local, complex → Gemini

### 2. AI Integration Architecture

**Hybrid Approach:**
```javascript
// Pseudo-code of the decision tree
if (isSimpleCommand(query)) {
  return handleLocally(query);  // Instant, no API cost
} else {
  return queryGemini(query);    // Intelligent, but has latency
}
```

**Why Google Gemini 3 Flash?**
- Fast inference times (important for terminal UX)
- Cost-effective for portfolio traffic
- Good at structured data extraction
- Reliable for constrained queries

**System Prompt Engineering:**
- Constrained to portfolio data only
- Terminal-style formatting (no markdown)
- Structured output for consistency
- Product/contribution data injected into context

### 3. Activity Data Integration

**Dual-Source Aggregation:**
```typescript
// Combining GitHub + GitLab data
const activity = {
  totalSessions: github.commits + gitlab.commits,
  currentStreak: Math.max(github.streak, gitlab.streak),
  history: mergeHistories(github.history, gitlab.history)
}
```

**GraphQL vs REST Decision:**
- GitHub: GraphQL for efficient contribution calendar fetching
- GitLab: REST with pagination (simpler, adequate for needs)

**Contribution Heatmap Innovation:**
- 111 days (not typical 365) - shows recent, relevant activity
- Hybrid rendering: real data when available, realistic patterns for gaps
- Interactive tooltips only on real contribution days
- SSR-consistent pseudo-random patterns (deterministic by index)

### 4. Containerization & Deployment

**Multi-Stage Docker Build:**
```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
# Install deps, build Next.js

# Stage 2: Production
FROM node:20-alpine
# Copy only built artifacts
# Minimal attack surface
```

**Why Google Cloud Run?**
- Fully managed (no server maintenance)
- Auto-scaling to zero (cost-effective for portfolio)
- Container-based (portable)
- Built-in HTTPS and CDN

### 5. Type Safety & Code Quality

**TypeScript Configuration:**
- Strict mode enabled
- Path aliases for clean imports (`@/*`)
- Interface-first design for products/contributions

**Error Handling Philosophy:**
- Graceful degradation (fallback data if APIs fail)
- User-friendly error messages
- No silent failures in terminal

---

## Casual Talking Points

### The Story Behind It

"I was tired of portfolios that look like marketing sites. As engineers, we care about what actually shipped, what the stack was, and whether it's still running. So I built my portfolio like internal documentation - direct, factual, with live status indicators."

### The Terminal Feature

"The terminal started as a fun experiment but became the centerpiece. I wanted visitors to interact with my portfolio like they'd interact with a system - query it, explore it, get specific answers. It's not a chatbot pretending to be me; it's a data interface."

### Design Philosophy

"I call it 'intentional restraint.' Every feature has to earn its place. The AI doesn't generate creative content or pretend to have opinions - it just helps users query structured data more naturally. If a simple regex can do the job, we don't need AI."

### Real Products Focus

"Everything listed is in production or was in production. No demo projects, no tutorials followed. Paychasers has real paying customers. Quicksalaries serves actual salary data. Even the archived Swyftswap processed real crypto transactions."

### The 111-Day Heatmap

"Why 111 days? It's about 4 months of activity - recent enough to be relevant, long enough to show patterns. Plus, 111 is a satisfying number visually. The hybrid approach means it looks good even during quieter periods, but only real contributions are interactive."

---

## Common Interview Questions & Answers

### Q: What was the biggest technical challenge?

**A:** "The biggest challenge was designing the dual-mode query system. I needed instant responses for simple commands but intelligent parsing for complex queries. The solution was a hybrid router that categorizes queries upfront. Simple commands like 'list all' never hit the AI, while questions like 'compare the infrastructure of all products' get the full Gemini treatment. This keeps the terminal snappy while still being smart."

### Q: How do you handle API rate limits and costs?

**A:** "Three strategies: First, ISR caching with 1-week revalidation for activity data - most visitors see cached data. Second, local command handling eliminates ~60% of potential Gemini API calls. Third, fallback data ensures the site works even if APIs are down or rate-limited. The result is a robust system that degrades gracefully."

### Q: Why not use a static site generator?

**A:** "I actually get the best of both worlds with Next.js. The product pages are statically generated at build time. The activity data uses ISR for weekly updates. Only the terminal queries and fresh activity pulls are truly dynamic. This hybrid approach optimizes for both performance and freshness."

### Q: How did you ensure the terminal feels authentic?

**A:** "Details matter. Real terminals have keyboard shortcuts, so mine has Ctrl+C and Ctrl+L. Real terminals have command history, so arrow keys navigate previous commands. The monospace font (JetBrains Mono), the color scheme, the loading indicators - everything references actual terminal behavior. It's not mimicry; it's respect for the interface pattern."

### Q: What would you do differently if starting over?

**A:** "I'd probably implement command autocomplete/suggestions earlier. Also, I'd consider adding a WebSocket connection for real-time activity updates instead of ISR caching. But honestly, I'm happy with the restraint. It's tempting to add features, but this portfolio does exactly what it needs to do."

### Q: How do you handle SEO with so much dynamic content?

**A:** "The critical content is all server-rendered - products, contributions, activity stats. Search engines see a complete page on first load. The terminal is progressive enhancement; the site is fully functional without JavaScript. Meta tags are properly set with Next.js metadata API."

### Q: Tell me about the decision to use Docker and Cloud Run.

**A:** "Containerization gives me consistency across environments and makes the app portable. The multi-stage build keeps the final image small (~200MB). Cloud Run was chosen because it scales to zero when not in use - perfect for a portfolio's traffic pattern. Plus, it handles HTTPS, certificates, and CDN automatically."

### Q: How do you test this kind of application?

**A:** "Three layers: TypeScript catches type errors at compile time. The local command system has deterministic outputs that are easy to unit test. For the AI integration, I use structured prompts that produce predictable formats, then validate the response structure. The activity APIs have fallback data that doubles as test fixtures."

### Q: What's the most interesting piece of code in the project?

**A:** "The contribution heatmap's rendering logic. It merges real GitHub/GitLab data with a deterministic pseudo-random pattern for missing days. The pattern uses the day index as a seed, so it's consistent across server renders, but creates a realistic activity distribution - lower activity on weekends, varied intensity on weekdays. It's a small detail that makes the visualization feel authentic."

### Q: How do you handle security, especially with API keys?

**A:** "All sensitive keys are environment variables, never committed to the repo. The API tokens are read-only with minimal scopes - just public profile data. The Gemini integration is constrained to portfolio data only through prompt engineering. There's no user authentication or data persistence, which eliminates entire categories of vulnerabilities."

---

## Key Messages to Emphasize

1. **Execution Over Ideas**: "This portfolio showcases shipped products with real users, not concepts or demos."

2. **Pragmatic Engineering**: "Every technical decision has a clear rationale. No over-engineering, no trend-chasing."

3. **Thoughtful AI Integration**: "AI enhances functionality without becoming a crutch. It's a tool, not the product."

4. **Attention to Detail**: "From keyboard shortcuts to contribution tooltips, the small things make it feel professional."

5. **Maintainable Architecture**: "Built to last with minimal dependencies and clear boundaries. This could run unchanged for years."

---

## Technical Specifications (Quick Reference)

- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 4
- **AI Model**: Google Gemini 3 Flash (`gemini-3-flash-preview`)
- **APIs**: GitHub GraphQL, GitLab REST
- **Deployment**: Google Cloud Run (containerized)
- **Performance**: ISR caching (1 week), local command handling
- **Key Files**:
  - `/src/app/components/Terminal.tsx` - Terminal interface
  - `/src/lib/activity.ts` - GitHub/GitLab integration
  - `/src/app/api/query/route.ts` - Gemini AI endpoint
  - `/src/app/components/ContributionHeatmap.tsx` - Activity visualization

---

## Conversation Starters

If you want to steer the conversation:

- "The interesting part was building a terminal that feels authentic while being web-based..."
- "I took a different approach to showing activity - instead of just numbers..."
- "The hybrid query system is something I'm particularly proud of..."
- "Each product in the portfolio has a story - Paychasers, for example..."
- "The design philosophy of 'intentional restraint' influenced every decision..."

---

## Remember

- Be specific about metrics when possible (1-week cache, 111-day heatmap, 3 live products)
- Use technical terms accurately (ISR, Server Components, GraphQL vs REST)
- Have opinions about your choices ("Docker multistage builds reduce image size by 60%")
- Connect technical decisions to user value ("Local commands mean instant responses")
- Show awareness of tradeoffs ("ISR caching trades freshness for performance, but 1 week is acceptable for portfolio data")