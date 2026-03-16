

# Plan: Populate Blog with SEO-Dominating Content

## Current State
The blog has only 3 test drafts with no real content. No published posts exist.

## Strategy
Insert **10 pillar articles** in English targeting the highest-value keyword clusters for medical professionals relocating to Europe. Each article will be 1,500-2,500 words, structured for both Google rich snippets and LLM citation (clear factual statements, FAQ sections, step-by-step guides, comparison tables in HTML).

## Content Plan (10 Articles)

| # | Slug | Title | Category | Target Keywords |
|---|------|-------|----------|-----------------|
| 1 | `medical-license-recognition-germany-complete-guide` | Medical License Recognition in Germany: Complete 2026 Guide (Approbation) | homologation | approbation germany, medical license germany, Anerkennung Arzt |
| 2 | `doctor-salary-germany-2026` | Doctor Salary in Germany 2026: By Specialty, Experience & Region | salaries | doctor salary germany, Arztgehalt, sueldo medico alemania |
| 3 | `fachsprachpruefung-fsp-preparation-guide` | Fachsprachprufung (FSP) Preparation: How to Pass the Medical German Exam | language-learning | FSP exam, Fachsprachprufung, medical German |
| 4 | `medical-license-recognition-spain-homologacion` | Medical License Recognition in Spain: Homologacion Guide 2026 | homologation | homologacion titulo medico espana |
| 5 | `nostrifizierung-austria-medical-license` | Nostrifizierung in Austria: Medical License Recognition Guide 2026 | homologation | nostrifizierung, medical license austria |
| 6 | `blue-card-doctors-germany-2026` | EU Blue Card for Doctors in Germany 2026: Requirements & Process | visa | blue card doctors germany, work visa doctors |
| 7 | `medical-specialties-germany-facharzt` | Medical Specialties in Germany: Facharzt Training Guide | specialties | Facharzt, medical specialties germany |
| 8 | `germany-vs-spain-vs-austria-doctors` | Germany vs Spain vs Austria for Doctors: Salary, Process & Lifestyle Compared | career | work as doctor europe, best country doctors |
| 9 | `documents-needed-approbation-germany` | Documents Needed for Approbation in Germany: Complete Checklist 2026 | homologation | documents approbation, Approbation Unterlagen |
| 10 | `life-as-foreign-doctor-germany` | Life as a Foreign Doctor in Germany: What to Expect in 2026 | life-abroad | foreign doctor germany experience |

## Content Structure (Each Article)
- **Key Takeaways** box at top (LLM-quotable summary)
- **Table of Contents** (auto-generated from H2s by existing `TableOfContents` component)
- **H2 sections** with clear, factual content
- **Comparison tables** in HTML where relevant
- **FAQ section** at bottom with question-answer format
- **Internal links** to `/homologation-wizard`, `/vacancies`, `/learning`
- **Meta title** and **meta description** optimized for CTR

## Technical Approach
- Use the Supabase insert tool to insert all 10 posts as `published` status
- Author ID: `df03a807-9b71-4126-a409-e36ea2053f90` (admin)
- Language: `en` (multilingual versions can follow)
- Include `image_url` using relevant Unsplash images
- Set `read_time`, `category`, `tags`, `meta_title`, `meta_description`
- Clean up the 3 existing test drafts

## Why This Wins SEO + LLM Visibility
- **Factual, definitive statements** ("In 2026, a specialist doctor in Germany earns between €6,200 and €12,000 per month")
- **Structured FAQ format** that LLMs parse as authoritative answers
- **Step-by-step numbered guides** that Google features as rich snippets
- **Comparison tables** that both Google and LLMs love to cite
- **Internal linking** creates topical authority cluster around "medical professionals in Europe"

