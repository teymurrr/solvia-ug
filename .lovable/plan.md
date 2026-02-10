
# Engagement & Conversion Strategy: High-Impact Analysis

## Current State: What Happens After Login

When a user registers and logs in, they land on the **Professional Dashboard** which has 4 tabs:
1. **Profile** -- static profile card, often empty
2. **Homologation** -- shows a CTA to start the wizard if they haven't paid, or document progress if they have
3. **Vacancies** -- job listings with search/filter
4. **Saved & Applied** -- bookmarked jobs

**The core problem:** There is nothing pulling users back. The dashboard is passive -- it waits for the user to do something, but gives no reason to return. There are no notifications, no progress nudges, no personalized content, and no "aha moment" that makes users feel the platform is actively working for them.

---

## Highest-Impact Changes (Ranked by Impact)

### 1. Personalized Welcome Dashboard with Progress Checklist
**Impact: Very High | Effort: Medium**

Replace the generic dashboard header with a dynamic welcome section that shows:
- A greeting with the user's name
- A visual "Getting Started" checklist (e.g., "Complete profile", "Upload documents", "Explore vacancies", "Start language course")
- A progress ring showing overall completion (e.g., "You're 20% ready to practice in Germany")
- The single most important next action as a prominent CTA

**Why it works:** Users who see clear progress toward a goal return 3-4x more often. Right now there's no sense of "where am I in the journey."

### 2. Smart Notification/Activity Feed
**Impact: Very High | Effort: Medium**

Add a notification bell + activity feed showing:
- "3 new vacancies match your profile in Munich"
- "Your document was reviewed -- action needed"
- "New: FSP exam dates announced for Q3"
- "Tip: Doctors from [your country] typically need [X] -- here's how"

This gives users a reason to log back in. Currently, there is zero reason to return unless they remember to check manually.

### 3. Free Value Before Purchase (The "Aha Moment")
**Impact: Very High | Effort: Low-Medium**

Right now, non-paying users see a bland CTA to "Start Homologation Process." Instead, give them immediate free value:
- Show their personalized homologation roadmap (timeline, steps, estimated duration) -- already generated from the wizard data
- Show a "salary gap calculator" (e.g., "Every month without homologation costs you approximately EUR X,XXX")
- Let them see 2-3 document requirements for free, with the rest gated

**Why it works:** Users who experience value before paying convert at much higher rates. Right now the funnel goes: wizard result (public page) then payment wall then value. The gap between signup and value is too large.

### 4. Email-Triggered Re-engagement Hooks
**Impact: High | Effort: Low**

You already have the email infrastructure (Resend + edge functions). Add automated triggers:
- "You signed up 3 days ago but haven't completed your profile -- here's why it matters"
- "A new vacancy in [target country] matches doctors from [your study country]"
- "Your homologation checklist is 40% complete -- just 3 more documents to go"

These bring users back to the site. Currently, the only email sequence is a generic "feedback ask" and "value insight."

### 5. Dashboard Vacancy Recommendations (Personalized)
**Impact: Medium-High | Effort: Low**

Instead of showing all vacancies with search/filter, add a "Recommended for You" section at the top of the vacancies tab based on:
- Target country from wizard data
- Doctor specialty
- Language level

This makes the dashboard feel personalized rather than generic.

---

## What Will Make Users BUY

The current flow has a conversion gap: users complete the free wizard, see results on a public page, and then face a payment wall. The connection between "I need this" and "I should pay for this" is weak.

### Key conversion improvements:

1. **Show the free roadmap inside the dashboard** (not just the public result page). When users log in and see "Your Homologation for Germany: 14 steps, ~8 months estimated" with most steps locked, the value of unlocking becomes tangible.

2. **Add social proof inside the dashboard**: "Maria from Colombia completed her homologation in 6 months with our Complete Package." This is more effective than trust badges because it's contextual.

3. **Implement a "salary loss" counter on the dashboard**: Per your existing value proposition memory, calculate and display the monthly salary loss. Seeing "You've been without your recognized diploma for 2 months -- estimated opportunity cost: EUR 12,000" every time they log in creates genuine (not fake) urgency.

4. **Trial content for the language course**: If users on the Complete Package get 6 months of language access, let free users try 1 lesson. This creates a taste of the value and an upgrade path.

---

## Implementation Priority

| Priority | Feature | Impact | Effort |
|----------|---------|--------|--------|
| 1 | Welcome section with progress checklist | Very High | Medium |
| 2 | Free value on dashboard (roadmap + salary loss) | Very High | Low-Med |
| 3 | Personalized vacancy recommendations | Med-High | Low |
| 4 | Email re-engagement triggers | High | Low |
| 5 | Notification/activity feed | Very High | Medium |

---

## Technical Approach

### Progress Checklist Component
- New `WelcomeSection` component in `src/components/professional-dashboard/`
- Reads from: `professional_profiles` (profile completeness), `clients` (target country), `client_documents` (upload progress), wizard data from localStorage
- Renders: greeting, progress ring, checklist items with completion state, primary CTA

### Free Roadmap on Dashboard
- Reuse existing `homologationDataByCountry` data from `src/data/homologationData.ts`
- Create a gated version: show timeline steps with lock icons for paid-only details
- Add salary loss calculation using country salary data already in the system

### Vacancy Recommendations
- Filter existing vacancy query in `useDashboard.ts` by user's target country and specialty
- Add a "Recommended" badge and sort these to the top

### Email Triggers
- New edge function `send-reengagement-email` that queries users with incomplete profiles/no purchases after N days
- Leverage existing Resend integration and `email_sends` deduplication table

### Notification System
- New `notifications` table in Supabase (user_id, type, message, read, created_at)
- Edge function triggered by vacancy inserts, document status changes
- Bell icon in navbar with unread count
