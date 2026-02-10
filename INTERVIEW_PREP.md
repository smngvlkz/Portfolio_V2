# Portfolio Technical Deep Dive - Interview Prep

## Overview

This portfolio (smngvlkz.com) is a Next.js application showcasing my work as a full-stack software engineer. It features several non-trivial technical implementations that demonstrate security awareness, API integration, and UX thinking.

---

## Key Technical Features

### 1. Live GitHub & GitLab Activity Integration

**What it does:**
- Fetches real-time contribution data from both GitHub and GitLab APIs
- Displays a combined activity heatmap, total sessions, and streak data
- Merges data from two different platforms into a unified view

**Technical implementation:**
- GitHub: GraphQL API to fetch `contributionsCollection` calendar data
- GitLab: REST API with pagination to fetch user events (up to 10,000 events)
- Server-side data fetching with 7-day cache (`revalidate: 604800`)
- Fallback data if API calls fail (defensive programming)

**Security decisions:**
- Tokens use minimal scopes: `read:user` (GitHub) and `read_user` (GitLab)
- Principle of least privilege - tokens can only read public profile data
- If tokens leak, attackers can only see what's already public
- Tokens stored in environment variables, never exposed to client

**Code location:** `src/lib/activity.ts`

---

### 2. Iframe Product Preview Modal

**What it does:**
- Clicking a product link opens an in-page modal with live iframe preview
- Visitors can preview my products without leaving the portfolio
- "Open in new tab" option for full experience

**Technical implementation:**
- React state to track which URL to preview
- Modal with iframe, click-outside-to-close behavior
- Conditional rendering: only my own products get iframe preview, not external links

**Security decisions:**
- Configured `Content-Security-Policy: frame-ancestors` on my product sites
- Only `smngvlkz.com` can embed my products in iframes
- Prevents clickjacking attacks from malicious sites
- Example header: `frame-ancestors 'self' https://smngvlkz.com https://www.smngvlkz.com`

**Why this is unique:**
- Most portfolios just link out - visitors leave and may not return
- This keeps visitors engaged on my site
- Shows I have live, deployed products (not just GitHub repos)
- Demonstrates understanding of CSP headers and cross-origin security

**Code location:** `src/app/components/ProductLog.tsx`, `src/app/components/Contributions.tsx`

---

### 3. Protected Work Experience Section

**What it does:**
- Professional work experience is hidden behind an access code
- Recruiters/employers can request access via email/LinkedIn
- Prevents public scraping of employment details

**Technical implementation:**
- Access code validated via API route
- Rate limiting (5 attempts per 15 minutes per IP)
- Protected products stored separately, only returned after valid code
- Client-side state management for unlocked content

**Code location:** `src/app/components/AccessGate.tsx`, `src/app/api/protected-products/route.ts`

---

### 4. AI-Powered Terminal Query System

**What it does:**
- Interactive terminal interface for querying portfolio data
- Natural language queries processed by Gemini AI
- Local command handling for common queries (faster response)

**Technical implementation:**
- Hybrid approach: simple commands handled locally, complex queries sent to Gemini
- System prompt with portfolio context for accurate AI responses
- Restricted content keywords intercepted before reaching AI

**Code location:** `src/app/api/query/route.ts`, `src/app/components/Terminal.tsx`

---

## Interview Questions & Answers

### Security

**Q: How do you handle API tokens securely in this application?**

A: I follow the principle of least privilege. Both my GitHub and GitLab personal access tokens use only the `read_user`/`read:user` scope - the minimum needed to fetch contribution data. This means if the tokens ever leak, an attacker can only read public profile information, which is already visible to anyone. The tokens are stored in environment variables, never committed to the repo or exposed to the client-side. All API calls happen server-side.

---

**Q: What is `Content-Security-Policy: frame-ancestors` and why did you use it?**

A: `frame-ancestors` is a CSP directive that controls which sites can embed your page in an iframe. I set it to `frame-ancestors 'self' https://smngvlkz.com` on my product sites, meaning only my portfolio can embed them. This prevents clickjacking attacks where a malicious site could overlay my page with invisible elements to trick users. It's the modern replacement for `X-Frame-Options`.

---

**Q: Why not use broader token scopes for convenience?**

A: Broader scopes like `read_api` (GitLab) or `repo` (GitHub) would give access to private repositories, CI/CD pipelines, and other sensitive data. Even though I only need contribution stats, a broader scope means greater risk if compromised. The extra 5 minutes to configure minimal scopes is worth the security benefit.

---

### Architecture

**Q: Why do you cache API responses for 7 days?**

A: Several reasons:
1. Rate limits - GitHub/GitLab have API rate limits that could be hit with frequent requests
2. Performance - cached responses are instant, no API latency
3. The data doesn't change that often - my contribution history from last week is the same
4. New deployments automatically fetch fresh data anyway

---

**Q: How does your hybrid AI query system work?**

A: Simple, predictable commands like `help`, `list all`, or `show activity` are handled locally in the API route - no AI needed, instant response. Complex natural language queries are sent to Gemini with a system prompt containing my portfolio data. This gives fast responses for common queries while still supporting flexible natural language for complex ones.

---

**Q: Why did you build the iframe preview instead of just linking out?**

A: UX and engagement. When visitors click a link that opens a new tab, they often don't come back. The iframe preview keeps them on my site while still showing my live products. It also demonstrates that I have real, deployed products - not just GitHub repos. Technically, it shows I understand CSP headers, iframe security, and cross-origin policies.

---

### React/Next.js

**Q: Why use `'use client'` in some components?**

A: Next.js 13+ uses React Server Components by default. Components that need client-side interactivity (useState, onClick handlers, etc.) must be marked with `'use client'`. My ProductLog and Contributions components need state for the preview modal, so they're client components. Static content can stay as server components for better performance.

---

**Q: How do you handle the protected products data flow?**

A: The flow is:
1. User enters access code in AccessGate component
2. Code sent to `/api/protected-products` POST endpoint
3. Server validates code and checks rate limit
4. If valid, returns protected products array
5. Client stores in state and renders alongside public products
6. Products never exist in client bundle until unlocked

---

### Problem Solving

**Q: You mentioned GitLab integration wasn't working initially. How did you debug it?**

A: I added console logging at each step of the API flow:
1. First checked if the token was present in env vars
2. Then logged the user fetch response - that worked
3. Then logged the events fetch - got 401 Unauthorized
4. The error message said "Token is expired" - turns out the events endpoint needed the auth header too, not just the user endpoint
5. After adding the Authorization header to the events fetch, it worked

The fix was one line, but systematic logging helped identify exactly where it failed.

---

**Q: What would you do differently if rebuilding this portfolio?**

A: A few things:
1. Add loading skeletons for the activity stats and iframe preview
2. Add keyboard support (Esc to close modals)
3. Consider using a shared Preview Modal component instead of duplicating in ProductLog and Contributions
4. Maybe add E2E tests for the protected products flow
5. Consider ISR (Incremental Static Regeneration) instead of full SSR for the activity data

---

## Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| APIs | GitHub GraphQL, GitLab REST, Google Gemini |
| Hosting | Google Cloud Run |
| Security | CSP headers, rate limiting, env-based secrets |

---

## Talking Points for Interviews

1. **"I built this portfolio to demonstrate real engineering, not just list technologies"**

2. **"Every security decision was intentional - minimal token scopes, CSP headers, rate limiting"**

3. **"The iframe preview feature is something I haven't seen on other portfolios - it keeps visitors engaged and shows I ship real products"**

4. **"I integrated two different APIs (GitHub GraphQL, GitLab REST) and unified the data - shows I can work with different API paradigms"**

5. **"The protected section shows I think about data privacy - not everything needs to be public"**

---

## Commands to Remember

```bash
# Run locally
npm run dev

# Check iframe headers
curl -sI https://example.com | grep -i "x-frame-options\|content-security-policy"

# View git changes
git diff src/lib/activity.ts
```

---

*Last updated: February 2026*
