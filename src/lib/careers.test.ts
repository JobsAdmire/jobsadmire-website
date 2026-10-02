import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OPENING_WIRE } from '@/test/careers';
import { getOpeningUncached, listOpeningsUncached, OpeningsUnavailableError } from './careers';

const env = {
  NODE_ENV: 'test',
  OPS_API_URL: 'https://operations.example.com/',
} as NodeJS.ProcessEnv;
const noDoor = { NODE_ENV: 'test', OPS_API_URL: '' } as NodeJS.ProcessEnv;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
const listPage = (data: unknown[], page: number, totalPages: number) =>
  json({ data, meta: { total: data.length, page, limit: 50, totalPages } });

let fetchMock: ReturnType<typeof vi.fn>;
let deps: { fetch: typeof fetch; env: NodeJS.ProcessEnv };

beforeEach(() => {
  fetchMock = vi.fn();
  deps = { fetch: fetchMock as unknown as typeof fetch, env };
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe('listOpeningsUncached', () => {
  it('is an empty list, without a call, when no door is configured (a door-less preview)', async () => {
    expect(await listOpeningsUncached({ fetch: deps.fetch, env: noDoor })).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('reads every page under the `openings` tag with the 300 s floor', async () => {
    fetchMock
      .mockResolvedValueOnce(listPage([OPENING_WIRE], 1, 2))
      .mockResolvedValueOnce(listPage([{ ...OPENING_WIRE, slug: 'second-role' }], 2, 2));
    const rows = await listOpeningsUncached(deps);
    expect(rows.map((r) => r.slug)).toEqual([OPENING_WIRE.slug, 'second-role']);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][0]).toBe(
      'https://operations.example.com/api/careers/openings?page=1&limit=50',
    );
    expect(fetchMock.mock.calls[1][0]).toBe(
      'https://operations.example.com/api/careers/openings?page=2&limit=50',
    );
    expect(fetchMock.mock.calls[0][1]).toMatchObject({
      next: { tags: ['openings'], revalidate: 300 },
    });
  });

  it('stops after five pages even when the door claims more', async () => {
    for (let i = 1; i <= 6; i++)
      fetchMock.mockResolvedValueOnce(listPage([{ ...OPENING_WIRE, slug: `role-${i}` }], i, 99));
    expect(await listOpeningsUncached(deps)).toHaveLength(5);
    expect(fetchMock).toHaveBeenCalledTimes(5);
  });

  it('drops a row that breaks the contract, logs it, and keeps the rest', async () => {
    fetchMock.mockResolvedValueOnce(
      listPage(
        [
          { ...OPENING_WIRE, category: 'INTERN' },
          { ...OPENING_WIRE, slug: 'kept' },
        ],
        1,
        1,
      ),
    );
    expect((await listOpeningsUncached(deps)).map((r) => r.slug)).toEqual(['kept']);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('throws OpeningsUnavailableError — never an empty list — on a 5xx, a network error, a non-JSON body or a broken envelope (R28)', async () => {
    fetchMock.mockResolvedValueOnce(new Response('bad gateway', { status: 502 }));
    await expect(listOpeningsUncached(deps)).rejects.toBeInstanceOf(OpeningsUnavailableError);
    fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
    await expect(listOpeningsUncached(deps)).rejects.toBeInstanceOf(OpeningsUnavailableError);
    fetchMock.mockResolvedValueOnce(new Response('<html>login</html>', { status: 200 }));
    await expect(listOpeningsUncached(deps)).rejects.toBeInstanceOf(OpeningsUnavailableError);
    fetchMock.mockResolvedValueOnce(json([OPENING_WIRE]));
    await expect(listOpeningsUncached(deps)).rejects.toBeInstanceOf(OpeningsUnavailableError);
  });
});

describe('getOpeningUncached', () => {
  it('reads one opening by its slug under the same tag and floor', async () => {
    fetchMock.mockResolvedValueOnce(json({ data: OPENING_WIRE }));
    const row = await getOpeningUncached(OPENING_WIRE.slug, deps);
    expect(row?.title).toBe(OPENING_WIRE.title);
    expect(fetchMock.mock.calls[0][0]).toBe(
      `https://operations.example.com/api/careers/openings/${OPENING_WIRE.slug}`,
    );
    expect(fetchMock.mock.calls[0][1]).toMatchObject({
      next: { tags: ['openings'], revalidate: 300 },
    });
  });

  it('is null for a 404 (unknown or closed), and without a call for a malformed slug or no door', async () => {
    fetchMock.mockResolvedValueOnce(json({ statusCode: 404, message: 'Opening not found' }, 404));
    expect(await getOpeningUncached('gone-role', deps)).toBeNull();
    expect(await getOpeningUncached('Not A Slug', deps)).toBeNull();
    expect(await getOpeningUncached('x', { fetch: deps.fetch, env: noDoor })).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('throws OpeningsUnavailableError on a 5xx, a network error or a contract violation — never a false 404', async () => {
    fetchMock.mockResolvedValueOnce(new Response('', { status: 503 }));
    await expect(getOpeningUncached('x', deps)).rejects.toBeInstanceOf(OpeningsUnavailableError);
    fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
    await expect(getOpeningUncached('x', deps)).rejects.toBeInstanceOf(OpeningsUnavailableError);
    fetchMock.mockResolvedValueOnce(json({ data: { ...OPENING_WIRE, slug: 'Bad Slug' } }));
    await expect(getOpeningUncached('x', deps)).rejects.toBeInstanceOf(OpeningsUnavailableError);
  });
});
