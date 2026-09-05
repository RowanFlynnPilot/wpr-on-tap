# Central Wisconsin On Tap

Every brewery and distillery worth the drive, from Medford to Minocqua. A
Wausau Pilot & Review reader tool: comprehensive free listings across nine
north-central Wisconsin counties, sponsored featured placements, one title
sponsor slot.

Static single-file app (MapLibre GL + OpenFreeMap vector tiles, vanilla JS),
WPR design system, deployed on GitHub Pages, embedded via iframe. Data lives
in `breweries.json` (hand-validated, refreshed quarterly) and is gated by
`validate.js` in CI. See `CLAUDE.md` for architecture and decisions, and
`REVIEW.md` for the current validation state.

Handy URLs:
- `?type=distillery` · `?f=openNow,dogFriendly` · `?county=Oneida` · `?q=wausau` · `?brewery=bull-falls` — deep links
- `?preview=featured&brewery=<slug>` — client-side featured mock-up for sales pitches
