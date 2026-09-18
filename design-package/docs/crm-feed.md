# CRM feed — permit approvals (Success Stories page)

The Success Stories page publishes approvals automatically from one JSON endpoint.
No code change is needed when a new permit is approved: add the record in the CRM, the page picks it up.

## Where to set the URL
Page settings (Tweaks) → **feedUrl**. Default is `approvals.sample.json` (sample data shipped with the project).
Production value should be something like `https://crm.jobsadmire.com/api/public/permit-approvals`.

Requirements for the endpoint:
- `GET`, no auth, JSON, CORS enabled for `https://www.jobsadmire.com`
- returns only records the CRM has explicitly marked publishable
- images served over HTTPS from the same or a public media host

## Response shape

```json
{
  "updated": "2026-07-28T09:00:00Z",
  "approvals": [
    {
      "id": "AP-2026-118",
      "sector": "hotels",
      "roles": "Housekeeping and pool staff",
      "headcount": 26,
      "date": "2026-04-14",
      "place": "Side, Antalya",
      "countries": ["Kyrgyzstan"],
      "documents": [
        {
          "url": "https://crm.jobsadmire.com/media/approvals/ap-2026-118-1.jpg",
          "redact": [{ "x": 8, "y": 26, "w": 44, "h": 5 }]
        },
        {
          "url": "https://crm.jobsadmire.com/media/approvals/ap-2026-118-2.jpg",
          "redact": [{ "x": 8, "y": 24, "w": 40, "h": 5 }]
        }
      ],
      "status": "approved",
      "publish": true
    }
  ]
}
```

| field | notes |
|---|---|
| `id` | any stable string; used as the card key |
| `sector` | one of `hotels`, `construction`, `factory`, `agriculture`, `logistics`, `food` — drives the filter chips |
| `roles` | short plain text, one line |
| `headcount` | number of permits on that approval |
| `date` | ISO date of the approval; the page shows month + year and sorts newest first |
| `place` | city / district of the employer |
| `countries` | array of source countries (or a single string) |
| `documents` | array of the approval pages for that record: `{ "url": "…", "redact": [ … ] }`. Send one entry per scan you want published — the page shows a swipeable proof slider with a `1 / N` counter, and **each document carries its own redact boxes**. Plain URL strings are also accepted (then the record-level `redact` applies to all of them) |
| `image` | single-document shorthand, still supported. Equivalent to `documents: [{ url: image, redact }]`. If both are empty the card shows an upload frame instead |
| `redact` | black boxes for the single-document case, in **percent of image size**: `x`, `y`, `w`, `h`. Use it to cover the worker name, passport number and ID. With `documents`, put the boxes on each document instead |
| `status` | only `approved` is published |
| `publish` | `false` hides the record even if approved |

## Privacy — important
The page draws the watermark and the black boxes, but the **original file is still downloadable** from its URL.
Store and serve an already-redacted copy in the CRM (flatten the black boxes into the JPEG before upload).
Send `redact` **per document** — a box positioned for page 1 does not cover the name on page 2.
The `redact` boxes are a second layer of safety, not the only one.

Rule of thumb: crop to the official header, stamp and decision line; remove name, passport number, TC/ID and address.

## What the page does with it
- fetches once on load, sorted newest first
- filters by sector chip
- overlays a diagonal `jobsadmire.com · verified copy` watermark on every document
- draws each document's `redact` boxes over its own name area (boxes and watermark travel with the document as you swipe)
- shows `N approval documents · swipe · covers X workers` under the card, so the headcount is never mistaken for the number of scans
- if the endpoint is unreachable it silently falls back to sample data and shows an amber "CRM feed not reachable" badge


---

# CRM feed — representatives (Verify a Representative page)

Same mechanism as the approvals feed. Page setting: **feedUrl**, default `representatives.sample.json`.
Production: e.g. `https://crm.jobsadmire.com/api/public/representatives`.

```json
{
  "updated": "2026-07-29T08:00:00Z",
  "representatives": [
    {
      "id": "JA-REP-014",
      "name": "Full name",
      "role": "Pakistan desk",
      "level": "founder | office | rep | coordinator",
      "place": "Karachi, Pakistan",
      "languages": ["Urdu", "English"],
      "contact": "+90 553 383 2549",
      "valid": "31 Dec 2026",
      "status": "active | suspended | former",
      "canSign": false,
      "photo": "https://crm.jobsadmire.com/media/people/ja-rep-014.jpg"
    }
  ]
}
```

Rules the page enforces:
- `level` decides the "may / may never" lists. Only `founder` gets "may sign contracts".
- `status` drives the badge: green Authorised, amber Suspended, red No longer authorised. A former representative stays visible on purpose — employers need to see that the person is no longer ours.
- `contact` must be a company number or an @jobsadmire.com address. Never publish a personal number.
- Revoking access in the CRM must set `status` immediately; the page has no cache.

The search box matches on ID, name, contact number and city, so an employer can check whatever the person told them.
