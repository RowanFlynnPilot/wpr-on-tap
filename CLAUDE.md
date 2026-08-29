# wpr-on-tap — Central Wisconsin On Tap

Brewery & distillery directory for Wausau Pilot & Review. Reader-facing tool +
sponsor play (free comprehensive listings, paid featured tier, title sponsor
slot). Same family as the Happy Hour Finder and Friday Fish Fry Finder.
Coverage: nine counties — the Cleanup Ledger's eight (Marathon, Langlade,
Lincoln, Oneida, Portage, Shawano, Taylor, Wood) plus Adams. The validator
enforces the county list.

## Current state (handoff from claude.ai, 2026-08-28)
- `index.html` — complete working v1: Leaflet map, AND-logic filter chips,
  featured/free card tiers, today's-hours logic, WPR design system
  (teal #3A867C, cream #F6F2E9, Fraunces/Public Sans/JetBrains Mono).
  Data is currently EMBEDDED with sample hours/flagships — partially
  superseded by breweries.draft.json.
- `breweries.draft.json` — automated collection pass output. NOT validated.
- `REVIEW.md` — the validation checklist. Work through it before anything ships.

## Task order
1. Human validation pass per REVIEW.md (hours confirmations, three uncollected
   breweries, coverage decision on Wood County, Little Italy brews-on-site check).
2. Geocode confirmed addresses (Nominatim; O'so, Up North, Little Italy are null).
3. Promote: breweries.draft.json → breweries.json (drop `_status`).
4. Update index.html: replace embedded DATA with `fetch('breweries.json')`.
   Keep the fail-fast hours validation (missing day key throws with brewery id).
5. Deploy to GitHub Pages, embed in WordPress via iframe (standard WPR pattern).

## Design decisions already made (don't relitigate)
- One JSON file in repo, no Google Sheet CMS — quarterly cadence doesn't need one.
- `featured` is null or complete; sponsorship lapse = set tier free + featured null.
- `food` is enum kitchen|food_trucks|none, not boolean.
- `type` is enum brewery|distillery (added 2026-08-28); one JSON file for both.
  UI: All/Breweries/Distilleries toggle, `?type=` deep link, 🥃 brown pins.
- Hours: null = closed; missing key = curation bug = throw.
- `id` slugs are permanent (future passport/check-in feature joins on them).
- No tap-list ingestion. Link out via `untappdMenu` field (add when curating).
- Events: v1 rides the existing community events calendar pipeline via venueId
  tags matching these slugs. No separate events scraper.
- Whitewater Music Hall is CLOSED — excluded. Do not re-add from stale sources.

## Later (designed-for, not built)
- Quarterly refresh Action: fetch brewery sites → Haiku extraction against this
  schema → PR diff as the review gate. District 1 blocks datacenter IPs; route
  through Webshare residential proxies (same as gas price widget / obituaries).
- v2 brewery passport: Supabase check-ins keyed on brewery id (Wausau Reads
  RLS patterns apply).
- Vite port only if the tool grows; single-file is fine at this size.
