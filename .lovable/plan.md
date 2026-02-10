

# Building a Community Hub for Solvia

## Analysis: What Makes Sense for Your Platform

Your users are healthcare professionals navigating the complex homologation process in a foreign country. They share a very specific, high-stakes journey. This creates a natural foundation for community -- people going through the same process want to hear from others who have done it.

After analyzing your codebase, here is what you already have that supports community:
- Blog with comments (though 0 comments so far)
- Success stories section
- Messaging system (stub, not yet functional)
- 57 registered professionals across various specialties

**The most valuable community feature for your stage is a Q&A / Discussion Forum**, not a full social network. Here is why:

1. **Immediate value**: New users get answers to real questions about homologation, FSP prep, language exams, and relocation
2. **SEO benefit**: Discussion threads rank in search, bringing organic traffic
3. **Trust signal**: Active discussions prove the platform is alive and helpful
4. **Low maintenance**: Users generate the content, you moderate
5. **Conversion driver**: Non-logged-in visitors see the discussions, but must sign up to participate

## Proposed Feature: "Community" Discussion Forum

### What Users Can Do
- Browse discussion categories (Homologation, Language Learning, FSP Preparation, Life in Germany, Job Search)
- Post questions and share experiences
- Reply to and upvote helpful answers
- Filter by specialty, target country, or category
- See author badges: "Verified Professional", "Homologated", "Solvia Team"

### How It Drives Value
- Users searching "how to pass FSP exam" or "homologation timeline Germany" find your forum via search engines
- Active discussions keep users coming back between homologation milestones
- Success stories and tips from peers are more trusted than marketing copy
- Professionals who help others become advocates for the platform

## Technical Implementation

### 1. Database Tables

**`community_posts`**
- `id` (uuid, primary key)
- `user_id` (uuid, references auth.users)
- `title` (text, required)
- `content` (text, required)
- `category` (text: homologation, language, fsp, life-abroad, job-search)
- `tags` (text array, e.g. specialty or country tags)
- `upvotes` (integer, default 0)
- `reply_count` (integer, default 0)
- `is_pinned` (boolean, default false)
- `created_at`, `updated_at`

**`community_replies`**
- `id` (uuid, primary key)
- `post_id` (uuid, references community_posts)
- `user_id` (uuid, references auth.users)
- `content` (text, required)
- `upvotes` (integer, default 0)
- `is_best_answer` (boolean, default false)
- `created_at`, `updated_at`

**`community_votes`**
- `id` (uuid, primary key)
- `user_id` (uuid)
- `post_id` (uuid, nullable)
- `reply_id` (uuid, nullable)
- `vote_type` (text: 'up')
- Unique constraint on (user_id, post_id) and (user_id, reply_id)

### 2. New Pages and Components

**Page: `/community`** -- Main forum listing
- Category filter tabs across the top
- List of discussion threads sorted by recent activity
- Each card shows: title, author (name + specialty badge), category, reply count, upvote count, time ago
- "Ask a Question" button (requires login)
- Sidebar: "Popular This Week", "Unanswered Questions"

**Page: `/community/:id`** -- Single discussion thread
- Full post content with author profile mini-card
- Reply thread below
- Upvote buttons on post and replies
- "Mark as Best Answer" for the original poster
- Related discussions sidebar

**Component: `CommunityPreview`** -- Dashboard widget
- Shows 2-3 recent/trending discussions relevant to the user's specialty
- "Join the Discussion" CTA
- Placed on the Professional Dashboard

**Component: `CommunityCard`** -- Landing page section
- Social proof: "57 professionals sharing their journey"
- 2-3 preview cards of popular discussions
- CTA: "Join the Community"

### 3. Navigation Updates
- Add "Community" link to main navbar between "Blog" and other items
- Add community tab or widget to the Professional Dashboard

### 4. RLS Policies
- Anyone can read posts and replies (including non-logged-in users for SEO)
- Logged-in users can create posts, replies, and votes
- Users can edit/delete only their own content
- Admins can pin posts and mark best answers

### 5. i18n Translations
- Add `community` translation keys across EN, ES, DE, FR, RU
- Keys for: page titles, categories, buttons, empty states, form labels

### 6. Seed Content Strategy
Before launch, seed 5-10 discussion threads with common questions:
- "How long did your homologation take in Bavaria?"
- "Tips for FSP preparation as a pediatrician"
- "Best cities for international doctors in Germany"
- "Language school recommendations for B2 preparation"

This gives new users something to engage with immediately.

## Implementation Sequence

1. Database migration: create tables + RLS policies
2. Core hooks: `useCommunityPosts`, `useCommunityReplies`, `useCommunityVotes`
3. Community listing page (`/community`)
4. Single post page (`/community/:id`)
5. "Ask a Question" dialog/form
6. Dashboard widget (CommunityPreview)
7. Landing page section (CommunityCard)
8. Navbar update
9. i18n translations (all 5 languages)
10. Seed initial content

