# Design Notes

This document records the design language introduced in the public auctions
listing (`routes/_public/auctions.tsx`) and detail (`routes/_public/auctions.$id.tsx`)
redesign, so it can be extended consistently to the rest of the app (dashboard,
navbar/footer, landing pages) in future passes.

## 1. Principles

**Modern, professional, mature** — not trendy, not soft/playful. Concretely:

- **Confident over bouncy.** Sharper corners, restrained shadows, no glassy/neon
  effects. Motion is subtle (≤200ms) and purposeful, never decorative bounce.
- **High contrast where it matters.** Money, status, and calls-to-action get the
  strongest visual weight. Everything else recedes.
- **Restrained color.** Brand color is reserved for actions and identity, not
  decoration. Status colors are semantic signals, never used just to color-code
  data for visual interest (see the sex-badge decision below).
- **Editorial accents used sparingly.** The serif display font marks a handful of
  genuinely important moments — titles, money — not every heading.

## 2. Color System

Tokens live in `src/styles.css`, defined as CSS variables in `:root`/`.dark` and
mapped into Tailwind via `@theme inline`. All colors were converted to **oklch**
and the neutral scale was re-hued to sit in the same low-chroma green family as
`--primary` (hue ≈165), rather than shadcn's default blue-violet "zinc" (hue
≈286). That hue mismatch — not the old hex/oklch mixing — was the main reason the
palette felt inconsistent; tying neutrals to the brand hue is what makes the
whole system read as one designed thing rather than a template with brand colors
bolted on.

| Token | Role | Usage rule |
|---|---|---|
| `primary` | Brand green | Actions (primary buttons, links) and brand identity (header, icon chips). Never used for large decorative fills. |
| `secondary` | Pale sage | Subtle fills — filter panels, chip backgrounds. **Never** used for calls-to-action (that's what `primary` is for). |
| `muted` / `accent` | Neutral fills | Backgrounds for de-emphasized content (stat chips, secondary surfaces). |
| `destructive` | Refined crimson | Errors, destructive actions, "sold"/"closed" status text only. |
| `success` / `warning` / `info` | Status semantics | Each means one thing (available/positive, caution, informational). Don't reuse for anything decorative. |
| `brand-accent` | Violet | Currently unused in the redesigned pages — reserved for a future "featured/premium listing" treatment. Don't spend it on anything else. |
| `border` / `input` / `ring` | Structural | Tied to the same neutral hue family. |
| `foreground` | Near-black green | Also used as a **surface** color for the one high-emphasis "money strip" (`AuctionDetailsTopBar`) — see §6. |

Dark mode tokens exist in `.dark` and were refined (fixed a low-contrast
`--primary` and an arbitrary placeholder `--brand-accent`), but **are not shipped
or QA'd** — see §7.

Removed as dead scaffold (confirmed zero references app-wide): `--chart-1..5`,
`--sidebar-*`. If a real chart or sidebar component is ever built, define fresh
tokens for it rather than reviving these.

## 3. Typography

Manrope (sans, body/UI) + Fraunces (serif, display) — kept, not replaced; it's a
good, deliberate pairing.

**Fraunces is applied narrowly and consistently**, via the `.display-title`
utility class, to:
- Auction titles (`AuctionCard`, `TopControls` `<h1>`)
- The page `<h1>` ("Auctions")
- Large monetary figures (bid amount in `BidModal`, total due in `BuyNowModal`)

Do **not** apply it to labels, badges, nav items, or body copy — diluting it past
these "important moment" spots defeats the purpose. When extending the design
elsewhere, ask "is this a title or a number the user cares about?" before adding
`.display-title`.

Fonts are self-hosted via `@fontsource-variable/manrope` and
`@fontsource-variable/fraunces` (imported at the top of `styles.css`) rather than
the previous render-blocking, cross-origin `@import url(fonts.googleapis.com/...)`.
The registered font-family names are `'Manrope Variable'` and `'Fraunces
Variable'` — keep that suffix if you touch the `--font-sans`/`--font-display`
declarations.

## 4. Spacing, Radius, Elevation

- **Base radius is `0.5rem` (8px)**, down from the old `0.625rem`. The old
  `rounded-3xl` "soft card" pattern (24px) read as consumer/playful; the new cap
  is `rounded-xl` (12px, token-driven via `--radius-xl`).
- **Shadow is a 3-tier system, used consistently:**
  - Resting surfaces (cards, section cards, inputs): border only, no shadow, or
    `shadow-xs` at most.
  - Floating surfaces (Select/Dropdown/Popover content): `shadow-md`.
  - Modal-level surfaces (Dialog, AlertDialog, Sheet): `shadow-lg`.
  Don't add ad hoc `shadow-sm` to individual components outside this tiering.
- **The "soft card" pattern** (`SectionCard` in `section-card.tsx`: icon chip +
  title + divider) is good information architecture and is kept, just retuned —
  `rounded-xl` cap, `bg-card`/`border-border` tokens, mobile-flush (`rounded-none
  border-0`) behavior preserved. Reuse this component for any new grouped-content
  block; don't invent a new card pattern.

## 5. Motion

- Durations ≤200ms, `ease-out`. Use the already-installed `tw-animate-css`
  utilities — no new animation library.
- **Cards get an image hover-zoom, not a whole-card lift.** `AuctionCard`'s cover
  image scales slightly (`group-hover:scale-105`) and the card gets a soft
  `hover:shadow-md`; the card itself doesn't translate or scale. Whole-card lift
  reads as generic template-UI; image zoom is the more restrained, common pattern
  for marketplace/auction listings.
- Wrap purely decorative motion in `motion-safe:` (see `cover-image.tsx`) since
  none of the existing transitions were guarded for `prefers-reduced-motion`
  before this pass — keep doing this for new motion.
- **Skeletons over spinner overlays.** The listing page and detail page both now
  show content-shaped `Skeleton` placeholders during data fetches instead of a
  blocking full-screen spinner. Reuse this pattern (real skeleton matching the
  eventual layout, driven by local component state) rather than the global
  `Loading` overlay when adding new data-dependent views — the `Loading` overlay
  is still fine for short, modal-scoped async actions (form submits), just not
  for the primary content-loading path of a page.

## 6. Component Patterns

- **Status badges use a tint, not a solid fill**, for low-emphasis status
  (`bg-success/15 text-success` style) — reserve solid fills (`bg-primary
  text-primary-foreground`) for one clearly-the-most-important badge per view
  (e.g. the "leading" bid badge in `AuctionBids`).
- **No decorative color-coding of data that isn't actually a status.** The sex
  badges on `AuctionCard` used to hardcode cyan (male) / pink (female) — removed
  in favor of the same neutral `outline` badge used for breed/production-system.
  Sex is still visible as text; it just isn't color-signaled. Apply the same
  rule elsewhere: color communicates state (success/warning/destructive/leading),
  never demographic or categorical data for decoration.
- **The `AuctionDetailsTopBar` stat strip uses `bg-foreground`** (the dark
  near-black-green token) instead of a hardcoded gray. This is the single most
  visible "money surface" on the detail page — it should always read as
  intentional/premium, not a generic gray utility pill. If you add a similarly
  high-emphasis strip elsewhere, reach for `bg-foreground` + `text-white/90`
  (values) + `text-white/50` (labels), not an arbitrary gray.
- **Hide non-functional affordances, don't ship them inert-but-restyled.** A
  cleanly redesigned button that still does nothing reads worse after a redesign
  than before, because it now looks finished. This pass removed the dead
  `ShareButton` from the detail page's `TopControls` and the no-op "contact"
  button from `AuctionDetailsTopBar`, and replaced a fabricated `'12 views'`
  stat with the real `auction.kind` label. Treat this as a standing rule: when a
  redesign pass touches a component with an inert affordance, either wire it up
  or remove it — don't just restyle it.

## 7. Dark Mode Readiness

Dark-mode CSS variables exist in `.dark` and were refined as part of this pass
(fixed a low-contrast primary and an arbitrary placeholder brand-accent), but:

- **They are unverified.** No systematic contrast audit was done — only the two
  known bad values were fixed on inspection.
- **They are unshipped.** There is still no toggle, no `next-themes`, and no
  `prefers-color-scheme` wiring anywhere in the app. The app remains light-only
  in practice.

Before ever adding a dark-mode toggle: run a full contrast pass on every
token pair in `.dark`, verify the redesigned components (skeletons, the
`bg-foreground` stat strip, status-tint badges) all still read correctly, and
decide whether `brand-accent`'s dark value needs further tuning once it's
actually used somewhere.

## 8. Extending to the Rest of the App

This pass deliberately did **not** touch `navbar.tsx`, `mobile-nav.tsx`,
`footer.tsx`, `dash-nav.tsx`, `dash-subnav.tsx`, `dashboard-auction-card.tsx`,
`routes/dashboard/**`, `components/landing/**`, or `components/wizard/**`. They
inherit the color/radius/font token changes automatically (shared tokens +
primitives), but were not visually redesigned.

Concrete next steps, in rough priority order:

1. **`dashboard-auction-card.tsx`** hardcodes status colors as `border-teal-400`
   / `border-blue-400` (and similar) — the same decorative off-token
   color-coding anti-pattern the sex badges had. This should be the first fix in
   a dashboard pass: replace with the semantic tokens (`success`/`warning`/
   `destructive`/tint-badge convention from §6).
2. **Navbar/footer** use `bg-primary`, which already picks up the refined green
   automatically — no urgent work needed, but when a dashboard/shell pass
   happens, apply the same radius scale-down and shadow tiering to any cards or
   dropdowns in `dash-nav`/`dash-subnav`.
3. **`dashboard/setup.tsx`, `dashboard/profile.tsx`, `wizard/auction-wizard.tsx`**
   still use the full-screen `Loading` overlay for their primary loading states —
   candidates for the skeleton-over-spinner treatment from §5 when those flows
   get redesigned. They also already consume the evolved `SectionCard`, so
   their content blocks inherited the new radius/token look for free.
4. **`components/landing/hero.tsx`** has a pre-existing bug unrelated to this
   pass: it uses a `text-primary-light` class that has no matching Tailwind
   theme token and currently resolves to nothing. Fix when the landing page is
   next touched.
5. When color-coding anything new anywhere in the app, default to the tint-badge
   convention in §6 rather than introducing another one-off palette.
