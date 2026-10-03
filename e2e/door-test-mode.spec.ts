import { expect, test, type Page } from '@playwright/test';
import { FORM_INSTANCES, type FieldFill, type FormInstance } from './fixtures/form-instances';

/**
 * T14 Cycles 5–6: this whole file talks to a REAL door with a TEST-class credential — never
 * against a door-less preview and never against `staging` while it holds the real write token
 * (Cycle 4 item 4's switch). It is inert everywhere else: `npx playwright test` (inside every
 * other task's `npm run gate`) runs this file too, and every test in it skips itself unless the
 * runner explicitly opts in, exactly like `e2e/ops.spec.ts`'s REVALIDATE_SECRET-gated cases.
 */
const ENABLED = process.env.E2E_DOOR_TEST_MODE === '1';
// Desktop project only: rows 3 (the ≥ 701 px quick-quote) and 5 (`#calc-role`, `max-md:hidden`)
// have no phone-width control, and one door run per instance is the point — never two per run.
// A row that exists only at a phone width (row 2) sets its own viewport on the desktop project.
test.skip(({ isMobile }) => isMobile, 'T14 door runs use the desktop project only');
const REASON =
  'set E2E_DOOR_TEST_MODE=1 and run against a deployment whose OPS_WEBSITE_WRITE_TOKEN holds a TEST-class token (wst_…) and NEXT_PUBLIC_TURNSTILE_SITE_KEY is UNSET (T14 Cycle 4 item 3) — never against staging while it is configured for the Cycle 7 real run';

type DataLayerEntry = Record<string, unknown>;
const dataLayer = (page: Page) =>
  page.evaluate(() => (window as unknown as { dataLayer?: DataLayerEntry[] }).dataLayer ?? []);
const eventsFor = async (page: Page, event: string, formKey: string) =>
  (await dataLayer(page)).filter((e) => e.event === event && e.form_key === formKey);

/** Opens the instance's page at the row's viewport (if any) and dismisses the consent sheet
 *  when one rendered — harmless when it never did (R38: no container id on a Preview face). */
async function openInstancePage(page: Page, row: FormInstance, url: string) {
  if (row.viewport) await page.setViewportSize(row.viewport);
  await page.goto(url);
  const banner = page.getByTestId('consent-banner');
  if (await banner.isVisible().catch(() => false)) await banner.getByRole('button').last().click();
}

/** Fills one instance's fields inside its own `<form>`, scoped by `data-testid`, and returns the
 *  `<form>` locator (for the caller to tick consent and submit). `{stamp}` becomes a run-unique
 *  token so two runs in the same clock hour never dedupe onto the same row (the door hashes
 *  `fields`, and `sourcePath` — this file sends none — is not part of that hash). An OPTIONAL
 *  control the page hides at this width (row 2's `topic`/`city`, `max-xs:hidden`) is skipped;
 *  a required one must be visible, so a hidden required control fails the row — correctly. */
async function fillInstance(page: Page, row: FormInstance, stamp: string) {
  if (row.open) await page.locator(row.open).first().click();
  const form = page.locator(`form[data-testid="${row.testId}"]`);
  await form.scrollIntoViewIfNeeded();
  for (const f of row.fields as readonly FieldFill[]) {
    const value = f.value.replace('{stamp}', stamp);
    const control =
      f.kind === 'radio'
        ? form.locator(`[name="${f.name}"][value="${value}"]`)
        : form.locator(`[name="${f.name}"]`);
    if (!f.required && f.kind !== 'radio' && f.kind !== 'checkbox') {
      if (!(await control.isVisible().catch(() => false))) continue;
    }
    if (f.kind === 'select') await control.selectOption(value);
    // RadioChips/checkbox inputs are `sr-only` behind their labels — check them by name+value.
    else if (f.kind === 'radio' || f.kind === 'checkbox') await control.check({ force: true });
    else await control.fill(value);
  }
  if (row.consentMode === 'checkbox') await form.locator('input[name="consent"]').check();
  return form;
}

async function submitAndAssertLead(page: Page, row: FormInstance) {
  const form = page.locator(`form[data-testid="${row.testId}"]`);
  const started = Date.now();
  await form.locator('button[type="submit"]').click();
  const thankYou = row.locale === 'tr' ? '/tesekkurler' : '/en/thank-you';
  await expect(page).toHaveURL(new RegExp(`${thankYou}\\?form=${row.doorKey}`));
  // W201: Hobby caps a function at 10 s and the door deadline is 9 s — the submit → thank-you time
  // is the measured action duration the ledger records (worst row of the run).
  console.log(
    `instance ${row.id} (${row.doorKey}): submit → thank-you in ${Date.now() - started} ms`,
  );
  await expect.poll(async () => eventsFor(page, 'generate_lead', row.doorKey)).toHaveLength(1);
  await expect.poll(async () => eventsFor(page, 'conversion', row.doorKey)).toHaveLength(1);
}

// The 13 instances a generic fill-and-submit covers. Rows 5 (the calculator needs the engine run
// first), 15 (needs three file uploads before submit) and 16/17 (careers needs a live opening +
// a CV upload first) get their own tests below — `fillInstance` only fills text/select/radio/
// checkbox controls, never a file input. Rows 15–17 skip themselves here (W171): they store real
// files, so they run only in the owner-gated Cycle 7 with the write token.
const GENERIC_IDS = new Set([1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14]);

for (const row of FORM_INSTANCES.filter((r) => GENERIC_IDS.has(r.id))) {
  test(`instance ${row.id}: ${row.page} — ${row.mode} (${row.doorKey}, test class)`, async ({
    page,
  }) => {
    test.skip(!ENABLED, REASON);
    const stamp = `T14-${row.id}-${Date.now()}`;
    await openInstancePage(page, row, row.path[row.locale]);
    await fillInstance(page, row, stamp);
    await submitAndAssertLead(page, row);
  });
}

test('instance 5: Cost Calculator — written quote (calculator, test class)', async ({ page }) => {
  test.skip(!ENABLED, REASON);
  const row = FORM_INSTANCES.find((r) => r.id === 5)!;
  const stamp = `T14-5-${Date.now()}`;
  // T3: the `#calculator` hash loads the calculator island without a touch (its own e2e proves it).
  await openInstancePage(page, row, `${row.path.tr}#calculator`);
  await expect(page.getByTestId('calc-island')).toBeVisible();
  // Run the engine once so `estimateSummary`/`trade`/`headcount`/`durationMonths` have a real
  // estimate to serialise server-side (T3's `toCalculatorFields` reads the `est_*` hidden inputs).
  // T3's real controls: the role `<select id="calc-role">` (desktop; `max-md:hidden` below 701 px)
  // and the `Stepper` input `#calc-headcount` (W131: it commits on blur/Enter); the contract
  // stays at its default 12 months. `calc-quote-open` sits in `calc-total-card`, visible at the
  // desktop width (`calc-quote-open-band` is its all-widths twin).
  await page.locator('#calc-role').selectOption('cnc');
  await page.locator('#calc-headcount').fill('8');
  await page.locator('#calc-headcount').press('Enter');
  await page.getByTestId('calc-quote-open').click();
  await fillInstance(page, row, stamp);
  await submitAndAssertLead(page, row);
});

test('instance 15: Verify — fraud report with three evidence files (fraud, test class)', async ({
  page,
}) => {
  test.skip(!ENABLED, REASON);
  // The TEST token's evidence upload is a dry run (`{ key: null, dryRun: true }`, Ops X16), and
  // `uploadFraudEvidence` treats a null key as an outage BY DESIGN (src/forms/uploads.ts — the
  // visitor path never uses the test token), so no `evidenceKeys` input can appear in this phase.
  // Row 15 is proven in Cycle 7 (write token) only — W171.
  test.skip(
    true,
    'evidence uploads need the write token (test-class upload is a dry run) — Cycle 7 proves row 15 (W171)',
  );
  const row = FORM_INSTANCES.find((r) => r.id === 15)!;
  const stamp = `T14-15-${Date.now()}`;
  await openInstancePage(page, row, row.path[row.locale]);
  await fillInstance(page, row, stamp);
  // EvidenceUpload (`data-testid="fraud-evidence"`) is one `<input type="file" multiple>` — the
  // visitor picks up to three files in one dialog, and the ISLAND uploads them one server-action
  // call each (W101/W73/W116, never all three in one call, never inside the fraud action's own
  // toFields). Each buffer here is trivial and well under the 3 MiB per-file site cap.
  await page
    .locator(`form[data-testid="${row.testId}"] [data-testid="fraud-evidence"] input[type="file"]`)
    .setInputFiles([
      {
        name: 't14-1.jpg',
        mimeType: 'image/jpeg',
        buffer: Buffer.from('T14 synthetic evidence — not a real file.'),
      },
      {
        name: 't14-2.png',
        mimeType: 'image/png',
        buffer: Buffer.from('T14 synthetic evidence — not a real file.'),
      },
      {
        name: 't14-3.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('T14 synthetic evidence — not a real file.'),
      },
    ]);
  // The three sequential uploads finish (each renders its own hidden evidenceKeys input); the
  // shell blocks submit while any is still in flight (a native listener cancels the form).
  await expect(
    page.locator(`form[data-testid="${row.testId}"] input[name="evidenceKeys"]`),
  ).toHaveCount(3, { timeout: 15_000 });
  await submitAndAssertLead(page, row);
});

for (const id of [16, 17] as const) {
  test(`instance ${id}: Careers detail — apply (careers, test class, dynamic opening)`, async ({
    page,
  }) => {
    test.skip(!ENABLED, REASON);
    // W171: the CV is a REAL PDF through the public `/api/careers/upload-cv`, which has no test
    // class — the apply action uploads it before the door call, so even a test-class run would
    // leave an orphan `careers-cv/*.pdf` in production storage. Rows 16–17 run only in the
    // owner-gated Cycle 7 with the write token; the body below documents what that run does.
    test.skip(
      true,
      'careers rows upload a real PDF through the public upload-cv (no test class) — Cycle 7 proves rows 16–17 (W171)',
    );
    const row = FORM_INSTANCES.find((r) => r.id === id)!;
    const stamp = `T14-${id}-${Date.now()}`;
    // Resolve the live opening for this row's country — never a hardcoded slug (an opening can
    // close between reconciliation and execution).
    // The openings list is an OPERATIONS route (public, no token — the one scripts/gate-routes.mjs
    // reads), not a website route; Node's fetch keeps the bypass header off the request.
    const ops = (process.env.OPS_API_URL ?? 'https://operations.jobsadmire.com').replace(
      /\/+$/,
      '',
    );
    const list = (await fetch(`${ops}/api/careers/openings`).then((r) => r.json())) as {
      data: unknown;
    };
    const opening = (list.data as Array<{ slug: string; country: string }>).find(
      (o) => o.country.toUpperCase() === row.dynamicOpening!.country,
    );
    test.skip(
      !opening,
      `no live opening for country ${row.dynamicOpening!.country} — record "not reachable" in the ledger`,
    );
    const detail =
      row.locale === 'tr' ? `/kariyer/${opening!.slug}` : `/en/careers/${opening!.slug}`;
    await openInstancePage(page, row, detail);
    await page.locator(`form[data-testid="${row.testId}"] input[name="cv"]`).setInputFiles({
      name: 't14-cv.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4\n%%EOF\n'),
    });
    await fillInstance(page, row, stamp);
    await submitAndAssertLead(page, row);
  });
}

test('replay: submitting the identical body twice inside one clock hour still succeeds, once, and R37 keeps generate_lead at one', async ({
  page,
}) => {
  test.skip(!ENABLED, REASON);
  const row = FORM_INSTANCES.find((r) => r.id === 11)!; // the Contact callback widget — cheap, no upload
  const stamp = `T14-R1-${Date.now()}`; // fixed for BOTH submits on purpose — replay needs an identical body
  await openInstancePage(page, row, row.path[row.locale]);
  await fillInstance(page, row, stamp);
  await submitAndAssertLead(page, row);
  // Second submit, identical fields: go back, the form still holds the same values (or refill
  // them identically), submit again inside the same hour.
  await page.goBack();
  await fillInstance(page, row, stamp);
  const form = page.locator(`form[data-testid="${row.testId}"]`);
  await form.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(new RegExp(`/tesekkurler\\?form=${row.doorKey}`));
  // R37: same form key, same path, same browser context — the SECOND landing pushes no second
  // generate_lead/conversion, which is the accepted skew docs/ANALYTICS.md now records (Cycle 1).
  // R37: the per-session key is set by the FIRST landing; the second landing must find it and push
  // nothing — so the dataLayer never holds more than one of each, however the navigation happened.
  await page.waitForFunction(
    () => sessionStorage.getItem('ja_conv:callback:/tesekkurler') === '1',
    undefined,
    { timeout: 5_000 },
  );
  expect((await eventsFor(page, 'generate_lead', row.doorKey)).length).toBeLessThanOrEqual(1);
  expect((await eventsFor(page, 'conversion', row.doorKey)).length).toBeLessThanOrEqual(1);
});

test('404 off: an unconfigured route answers the off panel (run with E2E_BASE_URL on preview/t14-off)', async ({
  page,
}) => {
  test.skip(!ENABLED, REASON);
  // The throwaway branch's OPS_API_URL must reach a real JSON 404 — Nest's own `Cannot POST …`
  // under the `/api` prefix (`https://operations.jobsadmire.com/api/nope`, pre-checked 2026-10-02);
  // a path outside `/api` is caught by the Operations frontend and 307s to its login page, which
  // `postForm` would read as a malformed 200 → `unavailable`, not `off`.
  const row = FORM_INSTANCES.find((r) => r.id === 11)!; // callback — cheap
  const stamp = `T14-404-${Date.now()}`;
  await openInstancePage(page, row, row.path[row.locale]);
  await fillInstance(page, row, stamp);
  const form = page.locator(`form[data-testid="${row.testId}"]`);
  await form.locator('button[type="submit"]').click();
  const panel = page.getByTestId('form-fallback');
  await expect(panel).toHaveAttribute('data-kind', 'off');
  // W76/W95: `off` is a WhatsApp-primary kind — the anchor carries the bare chat only, no visitor data.
  await expect(panel.getByRole('link', { name: /whatsapp/i })).toHaveAttribute(
    'href',
    /^https:\/\/wa\.me\/\d+$/,
  );
  expect(await eventsFor(page, 'generate_lead', row.doorKey)).toHaveLength(0);
  expect(page.url()).not.toContain('/tesekkurler');
});

test('unavailable: an unreachable door answers the panel within the W74/W117 budget (run with E2E_BASE_URL on preview/t14-blackhole)', async ({
  page,
}) => {
  test.skip(!ENABLED, REASON);
  const row = FORM_INSTANCES.find((r) => r.id === 11)!;
  const stamp = `T14-5xx-${Date.now()}`;
  await openInstancePage(page, row, row.path[row.locale]);
  await fillInstance(page, row, stamp);
  const form = page.locator(`form[data-testid="${row.testId}"]`);
  const started = Date.now();
  await form.locator('button[type="submit"]').click();
  await expect(page.getByTestId('form-fallback')).toHaveAttribute('data-kind', 'unavailable', {
    timeout: 12_000,
  });
  // W74/W117: one shared 9 s deadline for the whole call. `.invalid` fails DNS at once (a
  // connection-level failure), so the ONE immediate retry fails at once too and the panel lands
  // well under a second after the server action returns — the 9 s deadline bounds only a host
  // that never answers. The 12 s ceiling covers both; record the observed figure in the ledger
  // (Cycle 9), not asserted tightly here (CI timing varies).
  console.log(`unavailable panel after ${Date.now() - started} ms`);
});

test('honeypot: a filled honeypot answers success to the visitor and files no inquiry (SPAM row)', async ({
  page,
}) => {
  test.skip(!ENABLED, REASON);
  const row = FORM_INSTANCES.find((r) => r.id === 11)!;
  const stamp = `T14-SPAM-${Date.now()}`;
  await openInstancePage(page, row, row.path[row.locale]);
  await fillInstance(page, row, stamp);
  // The honeypot is off-canvas, outside the tab order (`aria-hidden`, `tabIndex={-1}`) — a
  // visitor never reaches it; a bot's autofill (or this test) sets it directly.
  await page
    .locator(`form[data-testid="${row.testId}"] input[name="honeypot"]`)
    .fill('x', { force: true });
  const form = page.locator(`form[data-testid="${row.testId}"]`);
  await form.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(new RegExp(`/tesekkurler\\?form=${row.doorKey}`));
  // A bot's dataLayer is nobody's problem (D13 does not distinguish) — generate_lead still
  // fires; record this as the documented, accepted behaviour, not a defect.
  expect(await eventsFor(page, 'generate_lead', row.doorKey)).toHaveLength(1);
});
