# wpr-on-tap — Central Wisconsin On Tap

Brewery & distillery directory for Wausau Pilot & Review. Reader-facing tool +
sponsor play (free comprehensive listings, paid featured tier, title sponsor
slot). Same family as the Happy Hour Finder and Friday Fish Fry Finder.
Coverage: nine counties — the Cleanup Ledger's eight (Marathon, Langlade,
Lincoln, Oneida, Portage, Shawano, Taylor, Wood) plus Adams. The validator
enforces the county list.

## Current state (updated 2026-09-05)
- `index.html` — single-file app, live on GitHub Pages. WPR masthead
  (typewriter badge + wordmark, both vendored), dateline, teal hero with the
  SVG stein and the presented-by house ad. MapLibre GL + OpenFreeMap vector
  tiles with a hand-written WPR-palette style, teardrop pins (amber brewery,
  brown distillery, teal featured), manual clustering, legend. Type toggle +
  amenity chips, "Open now" via `parseRange`, detail modal (full week, photo
  slot, Directions, Show on map), deep links (`?f=`, `?type=`, `?brewery=`),
  iframe height postMessage, OG card. Fetches `breweries.json` → falls back
  to `breweries.draft.json` behind a draft banner → error state.
  `?preview=featured&brewery=<slug>` renders a client-side featured mock-up
  for sales pitches. `track()` is an analytics stub: install Plausible's
  script tag and every call becomes a goal event.
- `breweries.draft.json` — 19 venues (15 breweries, 4 distilleries), all
  geocoded, `type` on every entry, optional `season` and `photo` fields.
- `validate.js` + `.github/workflows/validate.yml` — CI gate. Draft mode
  warns on TODO/null geocodes; strict mode (breweries.json) fails on them.
- `REVIEW.md` — the human checklist: phone verifies, brews-on-site calls,
  photo permissions log, Stoney Acres season dates.

## Task order (remaining)
1. Human calls per REVIEW.md, then flip the corresponding draft values.
2. Promote: `breweries.draft.json` → `breweries.json` (drop `_status`);
   the page sheds its draft banner automatically; CI runs strict on it.
3. Analytics: add the Plausible script tag (one line) before the first
   sponsor conversation — the instrumentation is already in place.
4. Embed in WordPress via iframe (page already posts `wpr-embed-height`).

## Design decisions already made (don't relitigate)
- One JSON file in repo, no Google Sheet CMS — quarterly cadence doesn't need one.
- `featured` is null or complete; sponsorship lapse = set tier free + featured null.
- `food` is enum kitchen|food_trucks|none, not boolean.
- `type` is enum brewery|distillery (added 2026-08-28); one JSON file for both.
  UI: All/Breweries/Distilleries toggle, `?type=` deep link, 🥃 brown pins.
- Hours: null = closed; missing key = curation bug = throw. Format "H[:MM]–H[:MM]"
  (en dash): opens 9–12 read a.m./noon, 1–8 p.m.; closes are p.m., and a
  close at or before the open wraps past midnight ("8–1" = 1 a.m.).
- `season` is optional `{from:"MM-DD", to:"MM-DD"}`; outside it the venue
  reads "Closed for the season" and never "Open now". Year-round = omit.
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
