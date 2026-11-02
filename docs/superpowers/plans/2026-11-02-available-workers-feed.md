# Available Workers from the portal — plan + contract `candidates.v1` (2026-11-02)

**Owner (2026-11-02):** the website page `/adaylar` · `/en/available-workers` (and the home-page pool marquee) must show real candidates from the portal who are available and not on any job, with **name and photo**. The portal side is built by the "Web Portal" session; Operations proxies; the website renders. Owner decisions supersede the aggregate-only rule D2 / W6 for this page (record as a website ruling when shipped); the privacy note below stays.

**Boundaries (workspace CLAUDE.md):** website → Operations only (server-side); CRM data reaches the website only through Operations `CrmClient` over the Connector (`/api/connector/v1/*`, service tokens, named in CRM PRD §29 and Operations PRD §7.11). The website never calls the portal.

## Flow

portal `GET /api/connector/v1/website/candidates` → Operations `CrmClient.listWebsiteCandidates()` (cached) → Operations `GET /api/website/v1/candidates` (public, cached 60 s) → website page (ISR 60 s, tag `pool`).

## Contract `candidates.v1`

### 1. Portal → Operations: `GET /api/connector/v1/website/candidates` (portal branch `feat/website-candidates-feed-2026-11-02`, ETA 2–3 days; CRM PRD §29.4)

- Auth: Connector service token (same guard as the other connector doors). Throttled like the door.
- Query: `cursor?` (opaque), `limit` (default 50, max 200), `updatedSince?` (ISO).
- Who is included — FINAL (owner in the Web Portal session, 2026-11-02: "no approval required … show everyone"; this supersedes the earlier "approved by JobsAdmire" and the consent switch): `availabilityStatus = AVAILABLE`; not deleted; no live job link (no `JobCandidateAssignment` in a live state; a PLACED one only while its placement is live); `hideFromWebsite = false` (staff or the owning sourcing partner can hide one; default shown); the sourcing partner not deleted/terminated. No approval status, no consent flag.
- Response:

```json
{ "contractVersion": "candidates.v1", "generatedAt": "ISO", "total": 123, "nextCursor": "…|null",
  "candidates": [{
    "ref": "JA-1042",                 // public reference shown on the site and sent back in hire requests
    "id": "cuid",                     // portal id, never shown
    "displayName": "Imran K.",            // first name + last initial (owner 2026-11-02); the portal never sends the full name
    "photo": { "url": "https://…", "width": null, "height": null, "expiresAt": "ISO" } | null,   // presigned GET, 60 min; Operations fetches server-side and re-serves
    "position": { "key": "welder", "label": { "tr": "Kaynakçı", "en": "Welder" } },
    "nationality": "PK" | null, "nationalityLabel": "Pakistani" | null,   // ISO-2 when the portal knows it, else the stored label
    "yearsExperience": 6,
    "languages": [{ "code": "en" | null, "label": "English", "level": "B1" }],
    "availability": { "status": "NOW" | "FROM_DATE", "from": "ISO|null" },   // the portal sends NOW today
    "location": { "country": "PK", "city": "Karachi" },
    "skills": ["MIG", "TIG"],         // short tags: at most 6, each ≤ 40 characters (a longer one is left out on both sides, never truncated — agreed 2026-11-02 after the first live sync)
    "education": "string|null", "age": 28 | null,
    "updatedAt": "ISO"
  }]
}
```

- Never in the response: phone, e-mail, passport/ID numbers, address, the sourcing partner's name or id, salary expectations, documents.
- Photo: a URL Operations can fetch server-side (signed URL with ≥ 15 min validity, or a public object). Operations re-serves it (see 2) so the website never links to the portal's storage.

### 2. Operations → Website: `GET /api/website/v1/candidates`

- `@Public()` like the blog feed (same PRD hard-rule-13 argument), `WebsiteModuleEnabledGuard`, throttle, `Cache-Control: public, max-age=30`.
- Operations pulls the portal feed through `CrmClient` every 5 min (cron) into a snapshot table `WebsiteCandidateSnapshot` (one row per candidate + `fetchedAt`), copies each photo into MinIO `website-media/candidates/<ref>/<hash>.webp` (sharp → 480 px square WebP, EXIF stripped) and serves it from the existing public media route (`/api/website/v1/media/candidate/<ref>/<hash>.webp`). Photos of candidates that drop out of the feed are deleted within 24 h.
- Response: same shape as 1 minus `id`, plus `photo.url` = the Operations media URL; `total`; `generatedAt`; `stale: boolean` (snapshot older than 30 min). Degraded: last snapshot keeps serving; empty feed → `candidates: []`.
- Admin: Website → Candidates (list of what is published, "hidden by portal" count, last sync time, "Sync now"). `website.collections` permission.

### 3. Website

- `POOL_SOURCE=OPS` (plain Vercel env, like `BLOG_SOURCE`): the Candidates page and the home marquee read the Operations feed (ISR 60 s, tag `pool`); otherwise the 12 samples stay. `FIXTURE_ONLY_COLLECTIONS` / D23 unchanged (the feed is not a fixture).
- Card: photo (`next/image`, remotePatterns for the Operations media route — already allowed), name, position, nationality flag, experience, languages, availability, location, skills; "Talebe ekle" keeps working — `profileRefs` carries `ref`s to the hire request (Operations inquiry → lead) so sales knows which candidates were asked for.
- Filters as today (trade, country, industry→position group, experience band, language, availability) computed from the feed; stats strip from real counts; `SampleTag` removed when the source is OPS.
- Robots: the Candidates page stays indexable; candidate cards are not separate pages (no per-candidate URL).

## Privacy note (not a blocker — owner's decision 2026-11-02)

Publishing a worker's name and photo on a public website is personal-data processing under KVKK/GDPR; the owner chose no consent step (2026-11-02, "show everyone"); the takedown path is the portal's hide switch + the 5-min sync (≤ 5 min). The CRM PRD/PENDING records the owner's privacy ruling. Website `docs/PRIVACY.md` gets a paragraph; the partner-facing text never mentions the other side (firewall rule).

## Order of work

1. Portal session: door + switch + photo URL (+ CRM PRD §29). 2. Operations: `CrmClient` call, snapshot cron, media copy, public route, admin list (+ Ops PRD §7.11/§5.12). 3. Website: feed reader, cards, filters, home marquee, docs (PRD, INTEGRATIONS I7, PRIVACY). 4. Env `POOL_SOURCE=OPS` → live check both languages → owner walk.
