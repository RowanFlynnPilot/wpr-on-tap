#!/usr/bin/env node
// Data gate for Central Wisconsin On Tap.
// Usage: node validate.js <file.json>
// Files with "draft" in the name run in draft mode: TODO values and null
// coordinates are warnings. breweries.json runs strict: they are errors,
// because index.html renders whatever this file lets through.

const fs = require("fs");

const file = process.argv[2] || "breweries.json";
const draftMode = /draft/i.test(file);

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const FOOD = new Set(["kitchen", "food_trucks", "none"]);
const TYPE = new Set(["brewery", "distillery"]);
// The nine-county coverage spread: the Cleanup Ledger's eight plus Adams (Up North).
const COUNTY = new Set(["Marathon", "Langlade", "Lincoln", "Oneida", "Portage", "Shawano", "Taylor", "Wood", "Adams"]);
const SRM = new Set(["pale", "amber", "brown", "stout"]);
const TIER = new Set(["free", "featured"]);
const BOOLS = ["outdoor", "dogFriendly", "familyFriendly", "tours", "liveMusic"];
// Same shape index.html's parseRange accepts, e.g. "3–10", "11–11", "4–8:30" (en dash).
const HOURS_RE = /^\d{1,2}(:\d{2})?–\d{1,2}(:\d{2})?$/;
// Rough central-Wisconsin bounding box — catches swapped or out-of-state coordinates.
const LAT = [43.5, 46.5], LNG = [-91.5, -88.0];

const errors = [], warnings = [];
const err = m => errors.push(m);
const warn = m => warnings.push(m);
const soft = draftMode ? warn : err; // draft: tolerated; strict: blocks

let data;
try {
  data = JSON.parse(fs.readFileSync(file, "utf8"));
} catch (e) {
  console.error(`${file}: ${e.message}`);
  process.exit(1);
}

if (!/^\d{4}-\d{2}-\d{2}$/.test(data.updated || "")) err(`top-level "updated" must be YYYY-MM-DD`);
if (!draftMode && data._status) err(`"_status" must be dropped when promoting to ${file}`);
if (!Array.isArray(data.breweries) || !data.breweries.length) err(`"breweries" must be a non-empty array`);

const ids = new Set();
for (const b of data.breweries || []) {
  const id = b.id || "(missing id)";
  const at = m => `${id}: ${m}`;

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(b.id || "")) err(at(`id must be a kebab-case slug`));
  if (ids.has(b.id)) err(at(`duplicate id — slugs are permanent and must be unique`));
  ids.add(b.id);

  for (const k of ["name", "city", "county"]) {
    if (typeof b[k] !== "string" || !b[k].trim()) err(at(`"${k}" must be a non-empty string`));
  }
  if (!TIER.has(b.tier)) err(at(`tier must be free|featured, got ${JSON.stringify(b.tier)}`));
  if (!TYPE.has(b.type)) err(at(`type must be brewery|distillery, got ${JSON.stringify(b.type)}`));
  if (b.county && !COUNTY.has(b.county)) err(at(`county ${JSON.stringify(b.county)} outside the nine-county spread`));
  if (typeof b.address !== "string" || !b.address.trim() || b.address === "TODO") soft(at(`address is missing/TODO`));

  for (const [k, [lo, hi]] of [["lat", LAT], ["lng", LNG]]) {
    if (b[k] == null) soft(at(`${k} is null — geocode before promoting`));
    else if (typeof b[k] !== "number" || b[k] < lo || b[k] > hi) err(at(`${k} ${b[k]} outside central Wisconsin bounds`));
  }

  if (!b.hours || typeof b.hours !== "object") { err(at(`hours object missing`)); continue; }
  for (const d of DAYS) {
    if (!(d in b.hours)) { err(at(`missing hours key "${d}" — null means closed, absent means curation bug`)); continue; }
    const v = b.hours[d];
    if (v === null) continue;
    if (v === "TODO") { soft(at(`hours.${d} is TODO`)); continue; }
    if (typeof v !== "string" || !HOURS_RE.test(v)) err(at(`hours.${d} ${JSON.stringify(v)} doesn't match "H[:MM]–H[:MM]" (en dash)`));
  }
  const extra = Object.keys(b.hours).filter(k => !DAYS.includes(k));
  if (extra.length) err(at(`unexpected hours keys: ${extra.join(", ")}`));

  if (!FOOD.has(b.food)) err(at(`food must be kitchen|food_trucks|none, got ${JSON.stringify(b.food)}`));
  for (const k of BOOLS) {
    if (typeof b[k] !== "boolean") err(at(`"${k}" must be boolean`));
  }

  if (!Array.isArray(b.flagships)) err(at(`flagships must be an array (empty is fine)`));
  else for (const f of b.flagships) {
    if (!f || typeof f.name !== "string" || !f.name.trim()) err(at(`flagship missing name`));
    if (!SRM.has(f.srm)) err(at(`flagship "${f && f.name}" srm must be pale|amber|brown|stout`));
  }

  // season is optional: null/absent = year-round; else {from, to} as MM-DD (inclusive, may wrap the year).
  if ("season" in b && b.season !== null) {
    const s = b.season;
    if (!s || typeof s !== "object" || !/^\d{2}-\d{2}$/.test(s.from || "") || !/^\d{2}-\d{2}$/.test(s.to || "")) {
      err(at(`season must be null or {from:"MM-DD", to:"MM-DD"}`));
    }
  }

  // photo is optional: absent/null = no photo; otherwise https URL or a repo-relative img/ path.
  // Only add photos we have written permission for (or WPR-owned shots) — see REVIEW.md.
  if ("photo" in b && b.photo !== null &&
      !(typeof b.photo === "string" && (/^https:\/\/\S+$/.test(b.photo) || /^img\/[\w.-]+$/.test(b.photo)))) {
    err(at(`photo must be null, an https URL, or img/<file>`));
  }

  if (!b.links || typeof b.links !== "object") err(at(`links object missing`));
  else {
    if (b.links.website != null && !/^https:\/\//.test(b.links.website)) err(at(`links.website must be https URL or null`));
    if (b.links.website == null) soft(at(`links.website is null`));
    if (b.links.untappdMenu != null && !/^https:\/\//.test(b.links.untappdMenu)) err(at(`links.untappdMenu must be https URL or null`));
  }

  // featured is null or complete — the featured card renders blurb and events unconditionally.
  if (b.tier === "featured") {
    const f = b.featured;
    if (!f || typeof f !== "object") err(at(`tier "featured" requires a complete featured object`));
    else {
      if (typeof f.blurb !== "string" || !f.blurb.trim()) err(at(`featured.blurb must be non-empty`));
      if (!Array.isArray(f.events)) err(at(`featured.events must be an array (empty is fine)`));
      else for (const e of f.events) {
        if (!e || !/^\d{4}-\d{2}-\d{2}$/.test(e.date || "") || typeof e.title !== "string" || !e.title.trim())
          err(at(`featured event needs date (YYYY-MM-DD) and title`));
      }
      if (!("photo" in f)) err(at(`featured.photo must be present (null is fine)`));
    }
  } else if (b.featured !== null) {
    err(at(`tier "free" requires featured: null (sponsorship lapse = tier free + featured null)`));
  }
}

for (const w of warnings) console.log(`WARN  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
console.log(`${file}: ${errors.length} error(s), ${warnings.length} warning(s) [${draftMode ? "draft" : "strict"} mode]`);
process.exit(errors.length ? 1 : 0);
