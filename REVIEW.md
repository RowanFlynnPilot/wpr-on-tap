# Central Wisconsin On Tap — Collection Review Checklist
Automated pass: 2026-08-28. Nothing goes live until each item below is checked.

## Editorial findings (news-adjacent, not just data)
- [ ] **Whitewater Music Hall: CLOSED.** Facebook announcement says closed for business, property for lease/purchase. Their .com domain lapsed and was taken over by an Indonesian gambling site. Excluded from the draft. → Possibly a story on its own if WPR hasn't covered the closure.
- [ ] **Bull Falls: closed and reopened under new ownership** (reopened ~Oct 2025 per WJFW). Renamed "Bull Falls Brewing Co.", moved to 905 E Thomas St (was 901), new site bullfallsbrewingco.com, renovated taproom + biergarten, food menu added Feb 2026, dogs no longer allowed. Old flagship list (5 Star Ale, Holzhacker) predates the ownership change — left empty pending verification of what they brew now.
- [ ] **O'so has moved** to 1800 Plover Rd, Plover (Artist and Fare Building) — old Village Park Dr address still circulates on aggregators. Amore Kitchen on-site since 2022. Needs geocode + hours.

## Verified from primary sources (own websites, high confidence)
- [ ] Sawmill — full hours, address (1110 E 10th St, **not** Main St), snacks + food trucks, 16 taps (sawmillbrewing.net)
- [ ] Red Eye — Tue–Sat 11 til close (~9), Sun/Mon closed; wood-fired kitchen; rotating house beers (redeyebrewing.com)
- [ ] Central Waters Amherst — hours Mon–Sun verified (centralwaters.com/taproom); no food, carry-ins welcome, occasional food trucks; free tours Sat 3pm; beer garden with fire rings; flagships from 2026 beer schedule. **5th Anniversary event Sept 12, 2026, noon–4** — sponsor-pitch timing gift.
- [ ] Point Brewery — taproom hours verified from pointbeer.com (gift shop keeps separate hours — decide whether to show both); flagships from current year-round lineup; tours active
- [ ] Bull Falls — hours from own site footer (Sun shows 11–8 on current pages, one older page said 11–6 — confirm)

## Secondary-source data (Untappd/Yelp — verify with a phone call)
- [ ] Mosinee — Untappd (June 2026): Mon 4–9 … Sun 12–7, **but** one aggregator says closed Mondays. Confirm Monday. Weekly trivia, food trucks, kombucha/nitro coffee/NA options, event space.
- [ ] Up North (Nekoosa) — Yelp hours, Sunday unknown. Dog-friendly taproom + patio per Travel Wisconsin. **Coverage decision: is Wood County in the circle?**

## Not yet collected (JS-rendered sites or blocked)
- [ ] Stoney Acres — Wix site, no data extracted. Farm pizza-night model; hours are seasonal Fri–Sun pattern. Needs manual check.
- [ ] District 1 — site returned 503 on all attempts (may block datacenter IPs; your Webshare proxies would get through). Hours/details TODO.
- [ ] Little Italy Brewpub Cucina (Wausau) — no working domain found. **Verify it actually brews on-site** vs. being a restaurant with a beer list; that decides inclusion.
- [ ] O'so hours + geocode for new address

## Attribute defaults needing eyes
dogFriendly, familyFriendly, tours, and liveMusic were set conservatively (false unless a source affirmed). Every `false` is "unconfirmed," not "confirmed no" — except Bull Falls dogs (sign reported) and Red Eye/CW where sources were explicit. Worth a column-by-column pass.

## Geocoding
- [ ] lat/lng carried over from prototype estimates for most entries; O'so, Up North, Little Italy are null. Batch-geocode all addresses once addresses are confirmed (Nominatim is fine at this volume).

## Sunset check
- [ ] Confirm no other closures/openings since these sources' crawl dates — ask around the newsroom; locals know before the internet does.
