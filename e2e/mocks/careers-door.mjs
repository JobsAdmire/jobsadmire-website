// The Operations careers-public door, faked for WP2b T11's e2e and W126 proof session (W93/W112):
// the three public routes the careers pages call — GET /api/careers/openings (paginated, newest
// first), GET /api/careers/openings/:slug (200 | 404) and POST /api/careers/upload-cv (201 with a
// careers-cv/<uuid>.pdf key) — in the exact `shapePublicOpening` shape. Everything else answers
// 404, the website door included: without OPS_WEBSITE_WRITE_TOKEN the site never calls it, so
// every submission ends on the D11 fallback panel, never a fake success. Never part of the gate
// or the build; nothing in production reads it.
//   npm run careers:door   → http://127.0.0.1:8481 (CAREERS_DOOR_PORT moves it)
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';

// W248: the public blog feed and the draft preview too (contract `blog.v1`), served from the
// contract fixture — GET /api/website/v1/blog (the feed) and
// GET /api/website/v1/blog/preview/:token (the first fixture post for BLOG_PREVIEW_TOKEN, 410 for
// any other token). `E2E_BLOG_MOCK=1` in e2e/pages/blog.spec.ts means the server under test was
// STARTED with OPS_API_URL pointing here (the preview page is dynamic: no rebuild needed).
// W249/W250: the owner's first real post (`blog-atv-post.json`: Turkish and English, featured, no
// cover, `showCover: false`, the ATV interview's video line under each intro). Two feeds:
// - the default one mirrors the live blog once the English interview is published — the ATV post
//   and the English work-permit guide (the fixture's third post): `/blog` lists 1 card, `/en/blog`
//   2. `E2E_BLOG_OPS=1` in the blog and home specs means the server was BUILT and started with
//   BLOG_SOURCE=OPS and OPS_API_URL=http://127.0.0.1:8481 (`npm run e2e:blog-ops`);
// - `/grid` in front of any path (OPS_API_URL=http://127.0.0.1:8481/grid) serves the grid feed:
//   the ATV post, the fixture's three and `blog-grid-posts.json`'s seven (one with its own cover
//   switched off at the top, one without the field at all) — 10 written articles per language, for
//   the four-in-a-row, paging and cover checks (`E2E_BLOG_GRID=1`, `npm run e2e:blog-grid`).
const BLOG_FIXTURE = JSON.parse(
  readFileSync(new URL('../../contract/blog-feed.v1.fixture.json', import.meta.url), 'utf8'),
);
const ATV_POST = JSON.parse(readFileSync(new URL('./blog-atv-post.json', import.meta.url), 'utf8'));
const GRID_POSTS = JSON.parse(
  readFileSync(new URL('./blog-grid-posts.json', import.meta.url), 'utf8'),
);
const BLOG_FEED = { ...BLOG_FIXTURE, posts: [ATV_POST, BLOG_FIXTURE.posts[2]], redirects: [] };
const GRID_FEED = {
  ...BLOG_FIXTURE,
  posts: [ATV_POST, ...BLOG_FIXTURE.posts, ...GRID_POSTS].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  ),
};
const BLOG_PREVIEW_POST = BLOG_FIXTURE.posts[0];
const BLOG_PREVIEW_TOKEN = 'e2e-preview-token.0000000000000000';

const PORT = Number(process.env.CAREERS_DOOR_PORT ?? 8481);
const HOST = '127.0.0.1';
const daysAgo = (days) => new Date(Date.now() - days * 86_400_000).toISOString();

const BASE = {
  city: null,
  cities: [],
  employmentArrangement: null,
  employmentArrangements: [],
  workMode: null,
  workModes: [],
  description: null,
  salaryMin: null,
  salaryMax: null,
  salaryCurrency: null,
  salaryPayType: null,
  salaryPeriod: null,
  salaryVisible: false,
  payCurrency: null,
  portfolioRequired: false,
  requiredLanguage: null,
  requiredLanguages: [],
};

/** Five openings, newest first like Operations: two Antalya office roles (one needs a portfolio
 *  — W56), three overseas (Uzbekistan with a visible USD range, Pakistan with PKR and a hidden
 *  salary, India project-based and old). The first is what W93's gate rows audit. */
const OPENINGS = [
  {
    ...BASE,
    slug: 'work-permit-officer-antalya',
    title: 'Work Permit & Documentation Officer',
    country: 'TR',
    city: 'Antalya',
    cities: ['Antalya'],
    category: 'FULL_TIME',
    employmentArrangement: 'PERMANENT',
    employmentArrangements: ['PERMANENT'],
    workMode: 'ON_SITE',
    workModes: ['ON_SITE'],
    description:
      'Own the paperwork that decides whether a worker legally starts.\n\nThe work:\n- Prepare and file work-permit applications\n- Track every file until the permit is issued',
    salaryMin: '45000',
    salaryMax: '45000',
    salaryCurrency: 'TRY',
    salaryPayType: 'EXACT',
    salaryPeriod: 'MONTH',
    salaryVisible: true,
    payCurrency: 'TRY',
    requiredLanguage: 'Turkish',
    requiredLanguages: ['Turkish'],
    postedAt: daysAgo(1),
  },
  {
    ...BASE,
    slug: 'country-representative-uzbekistan',
    title: 'Country Representative — Uzbekistan',
    country: 'UZ',
    city: 'Tashkent',
    cities: ['Tashkent'],
    category: 'COUNTRY_REPRESENTATIVE',
    employmentArrangement: 'PERMANENT',
    employmentArrangements: ['PERMANENT'],
    workMode: 'REMOTE',
    workModes: ['REMOTE'],
    description:
      'Own the whole JobsAdmire pipeline in Uzbekistan — partners, candidates and quality.\n\nThe work:\n- Find and manage licensed partner agencies\n- Run first interviews\n\nThe profile:\n- A working network among agencies',
    salaryMin: '800',
    salaryMax: '1200',
    salaryCurrency: 'USD',
    salaryPayType: 'RANGE',
    salaryPeriod: 'MONTH',
    salaryVisible: true,
    payCurrency: 'USD',
    requiredLanguage: 'Uzbek',
    requiredLanguages: ['Uzbek', 'Russian', 'English'],
    postedAt: daysAgo(3),
  },
  {
    ...BASE,
    slug: 'sourcing-coordinator-pakistan',
    title: 'Sourcing Coordinator — Pakistan',
    country: 'PK',
    city: 'Karachi',
    cities: ['Karachi', 'Lahore'],
    category: 'FREELANCER',
    employmentArrangement: 'FREELANCER',
    employmentArrangements: ['FREELANCER'],
    workMode: 'HYBRID',
    workModes: ['HYBRID'],
    description:
      'A few agreed hours a week beside your agency or training centre.\n- Shortlist candidates against a live job order\n- Check documents before a file opens',
    payCurrency: 'PKR',
    requiredLanguages: ['Urdu', 'English'],
    postedAt: daysAgo(10),
  },
  {
    ...BASE,
    slug: 'content-seo-specialist-antalya',
    title: 'Content & SEO Specialist',
    country: 'TR',
    city: 'Antalya',
    cities: ['Antalya'],
    category: 'FULL_TIME',
    workMode: 'HYBRID',
    workModes: ['HYBRID', 'REMOTE'],
    description:
      'Turn permit and hiring knowledge into pages employers find.\n- Write and translate guides in Turkish and English\n- Improve on-page SEO',
    payCurrency: 'TRY',
    portfolioRequired: true,
    requiredLanguages: ['Turkish', 'English'],
    postedAt: daysAgo(20),
  },
  {
    ...BASE,
    slug: 'trade-test-assessor-india',
    title: 'Trade Test & Skills Assessor',
    country: 'IN',
    category: 'PROJECT_BASED',
    workMode: 'ON_SITE',
    workModes: ['ON_SITE'],
    description: 'Test the trade before the ticket — welders, machine operators, cooks.',
    requiredLanguages: ['Hindi', 'English'],
    postedAt: daysAgo(40),
  },
];

const send = (res, status, body) => {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  });
  res.end(JSON.stringify(body));
};

const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://${HOST}:${PORT}`);
  // W250: `/grid/…` is the same door with the grid feed (see above)
  const grid = url.pathname.startsWith('/grid/');
  if (grid) url.pathname = url.pathname.slice('/grid'.length);
  if (req.method === 'GET' && url.pathname === '/api/website/v1/blog')
    return send(res, 200, grid ? GRID_FEED : BLOG_FEED);
  const preview = url.pathname.match(/^\/api\/website\/v1\/blog\/preview\/([^/]+)$/);
  if (req.method === 'GET' && preview)
    return decodeURIComponent(preview[1]) === BLOG_PREVIEW_TOKEN
      ? send(res, 200, { post: BLOG_PREVIEW_POST })
      : send(res, 410, { message: 'Preview link expired' });
  if (req.method === 'GET' && url.pathname === '/api/careers/openings') {
    const limit = Math.min(Math.max(Number(url.searchParams.get('limit')) || 20, 1), 50);
    const page = Math.max(Number(url.searchParams.get('page')) || 1, 1);
    return send(res, 200, {
      data: OPENINGS.slice((page - 1) * limit, page * limit),
      meta: { total: OPENINGS.length, page, limit, totalPages: Math.ceil(OPENINGS.length / limit) },
    });
  }
  const detail = url.pathname.match(/^\/api\/careers\/openings\/([^/]+)$/);
  if (req.method === 'GET' && detail) {
    const opening = OPENINGS.find((o) => o.slug === decodeURIComponent(detail[1]));
    return opening
      ? send(res, 200, { data: opening })
      : send(res, 404, { statusCode: 404, message: 'Opening not found', error: 'Not Found' });
  }
  if (req.method === 'POST' && url.pathname === '/api/careers/upload-cv') {
    const multipart = (req.headers['content-type'] ?? '').startsWith('multipart/form-data');
    req.resume();
    req.on('end', () => {
      if (!multipart) return send(res, 400, { statusCode: 400, message: 'Missing "file" field' });
      const key = `careers-cv/${randomUUID()}.pdf`;
      return send(res, 201, {
        data: { url: `http://${HOST}:${PORT}/uploads/${key}`, key, fileName: 'cv.pdf' },
      });
    });
    return undefined;
  }
  return send(res, 404, { statusCode: 404, message: 'Not Found' });
});

server.listen(PORT, HOST, () => {
  console.log(`[careers-door] ${OPENINGS.length} fixture openings on http://${HOST}:${PORT}`);
});
