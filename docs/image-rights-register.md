# AhmedPrep.com Image Rights Register

Internal record. Not published (lives outside `public/`).
Last updated: November 16, 2026

## How to use this register

- Add a row whenever an image is added, replaced, or removed.
- **Status values**
  - **Verified**: license or ownership evidence is on file and covers commercial website use.
  - **Needs documentation**: origin is known, but the governing terms, account, or grant are not yet recorded.
  - **Potential rights concern**: a known issue (third-party marks, misleading depiction, unknown source) must be resolved before use.
- Never mark an image "Verified" because of C2PA metadata alone. C2PA shows which tool produced an image, not what terms apply.
- Keep generation prompts verbatim. Save provider terms (PDF or archived URL) as they read on the generation date.

## Active website images

| # | File | Used on | Source / generation method | Date | Account | Applicable terms | Evidence on file | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `public/images/sat-intensive/study-table-illustration.jpg` (1312x816, 103 KB) | Digital SAT Final Intensive hero (`components/sat-intensive/hero.tsx`) | AI-generated in v0 (v0.app, Vercel) using the built-in image generation tool, then resized/compressed to JPEG. The underlying model is not disclosed in the tool output. | Nov 16, 2026 | v0 chat on Vercel team `ahmedprep` (repo `AhmedHalalFood/Ahmedprep`) | v0 / Vercel Terms of Service in effect Nov 16, 2026. **Commercial-use grant for generated output not yet confirmed or archived.** | Prompt (below); this register; commit history on branch `v0/image-rights-updates`. Visually checked: no people, no logos, no readable text. | **Needs documentation** |
| 2 | `public/images/sat-intensive/practice-review-illustration.jpg` (896x1200, 109 KB) | Intensive curriculum section (`components/sat-intensive/curriculum.tsx`) | Same as #1 | Nov 16, 2026 | Same as #1 | Same as #1 | Prompt (below). Visually checked: no people, no logos, worksheet text is decorative/illegible. | **Needs documentation** |
| 3 | `public/og-image.jpg` (1200x630, 99 KB) | Default social preview for all pages (`lib/seo.ts`) | Center-cropped and compressed derivative of #4 (sharp, JPEG q82). No new content. | Nov 16, 2026 | Derivative; inherits #4 | Inherits #4 | Derived from `ahmedprep-hero.png` | **Needs documentation** (inherits #4) |
| 4 | `public/ahmedprep-hero.png` (1376x768, 1.55 MB) | Homepage hero (`app/page.tsx`, decorative `alt=""`); JSON-LD `image` in `app/layout.tsx`, `free-sunday-classes`, `shsat-final-intensive-2026`, `resources/[slug]`, `updates/[slug]` | AI-generated with Google generative AI | Before Nov 10, 2026 (exact date unknown) | Unknown | Google generative AI terms (version/date unknown) | C2PA signed by Google LLC; IPTC `trainedAlgorithmicMedia`; XMP "Made with Google AI". No prompt, account, or terms on file. | **Needs documentation** |
| 5 | `public/ahmedprep-logo-256.png` (256x256, 19 KB) | Header, mobile nav, footer | Resized/palette-compressed derivative of #6. Branding unchanged. | Nov 16, 2026 | Derivative; inherits #6 | Inherits #6 | Derived from `ahmedprep-logo.png` | **Needs documentation** (inherits #6) |
| 6 | `public/ahmedprep-logo.png` (1254x1254, 1.19 MB) | JSON-LD `Organization.logo` (`app/layout.tsx`), `Article.publisher.logo` (`updates/[slug]`); source for #5 and likely #7 | AI-generated with OpenAI (ChatGPT, `gpt-image`) | Before Nov 10, 2026 (exact date unknown) | Unknown | OpenAI Terms of Use (version/date unknown) | C2PA signed by OpenAI OpCo / "OpenAI Media Service". No prompt, account, or terms on file. No trademark clearance search on file. | **Needs documentation** |
| 7 | `public/favicon.ico`, `favicon-16x16/32x32/48x48/96x96/192x192.png`, `apple-touch-icon.png`, `icon-512x512.png` | Browser tab icons, PWA manifest, RSS feed icon | Unknown; likely resized from #6 | Before Nov 10, 2026 | Unknown | Unknown (inherits #6 if derived from it) | None (metadata stripped) | **Needs documentation** |
| 8 | Lucide icons (`lucide-react` 0.564.0) | UI icons site-wide | Open-source icon library | n/a | n/a | ISC license (Feather portions MIT); commercial use permitted with notice retained | `node_modules/lucide-react/LICENSE`, `package.json` license field | **Verified** |
| 9 | YouTube thumbnails (`i.ytimg.com`) | `components/videos/lite-youtube.tsx` | Third-party hosted | n/a | n/a | Owned by video uploader | **Inactive**: no videos configured in `lib/teaching-videos.ts` | **Needs documentation** before enabling (use AhmedPrep-owned uploads only) |

## Replaced (no longer referenced; kept pending review)

| File | Previously used on | Reason replaced | References checked | Proposed action |
| --- | --- | --- | --- | --- |
| `public/images/sat-intensive/hero-students.png` | Intensive hero | Visible Apple logos; realistic synthetic minors could be mistaken for AhmedPrep students | `app/`, `components/`, `lib/`: **0 references** | Delete after approval |
| `public/images/sat-intensive/instructor-feedback.png` | Intensive curriculum | Visible Apple logo; synthetic instructor could be mistaken for staff; UK school setting | `app/`, `components/`, `lib/`: **0 references** | Delete after approval |

## Unused assets (deletion proposed, not performed)

| File | References | Notes | Proposed action |
| --- | --- | --- | --- |
| `public/placeholder.jpg`, `placeholder-user.jpg`, `placeholder.svg` | 0 | Template scaffolding, publicly reachable | Delete after approval |
| `ahmedprep-logo.png` (repo root, 296x296) | 0, not published | Adobe Express draft; template/stock use unknown | Confirm origin, then delete or archive |

## Generation records

### #1 `study-table-illustration.jpg`
- Tool: v0 image generation (v0.app, Vercel)
- Date: November 16, 2026
- Account: v0 chat, Vercel team `ahmedprep`
- Post-processing: resized to 1312px wide, JPEG quality 80 (sharp/mozjpeg)
- Prompt (verbatim):
  > Photorealistic wide 16:10 interior photograph of an empty, modern small-group study room prepared for an evening SAT practice session, no people at all. A long light-oak table with six neatly placed setups: closed plain silver laptops with completely blank lids (no logos), unbranded graphing calculators, sharpened yellow pencils, blank spiral notebooks, and stacks of generic printed practice worksheets with unreadable small text and no logos or brand names. Warm pendant lighting, soft dusk light through large windows showing a blurred Queens, New York streetscape with low brick buildings and an elevated subway track in the distance. Clean white walls, a blank whiteboard, a small bookshelf with plain unlabeled spines. Calm, focused, premium atmosphere, shallow depth of field, natural color, no text, no logos, no people, no faces, no hands.
- Alt text: "Illustration of an empty study room set up for SAT practice, with laptops, calculators, and worksheets on a long table beside windows overlooking a Queens street"

### #2 `practice-review-illustration.jpg`
- Tool, date, account: same as #1
- Post-processing: resized to 896px wide, JPEG quality 80
- Prompt (verbatim):
  > Photorealistic close-up overhead-angled still life photograph on a light oak desk: a printed math practice worksheet with abstract handwritten algebra work and a few circled answers and check marks in blue ink, a sharpened yellow pencil, an unbranded black scientific calculator with no logo, a pink eraser, a small stack of sticky tabs, and a plain ceramic mug. Soft warm evening window light, shallow depth of field, calm study mood. The worksheet text is illegible and abstract, no brand names, no logos, no readable words, no people, no hands, no faces. Vertical composition, 3:4 portrait framing.
- Alt text: "Illustration of a reviewed math practice worksheet with circled answers beside a pencil and calculator"

## Open actions to reach "Verified"

1. **#1, #2**: Archive the v0/Vercel terms in effect Nov 16, 2026, and confirm in writing (or with counsel) that they grant commercial use of generated output for the account's plan.
2. **#4, #6**: Recover the original generation records (account, date, prompt) from Google and ChatGPT, and archive the applicable terms.
3. **#6**: Run a USPTO trademark search for "AhmedPrep" and the crest; consider a designer-drawn vector logo you fully own.
4. **#7**: Confirm the favicons were produced from #6.
