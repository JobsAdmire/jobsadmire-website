import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FormActionError, FormDoorError } from '../types';
import {
  isFile,
  MAX_CV_BYTES,
  MAX_EVIDENCE_BYTES,
  uploadCv,
  uploadFraudEvidence,
  type UploadDeps,
} from '../uploads';

const env = {
  NODE_ENV: 'test',
  OPS_API_URL: 'https://operations.example.com',
  OPS_WEBSITE_WRITE_TOKEN: 'wsw_' + 'a'.repeat(48),
} as NodeJS.ProcessEnv;
const visitor = { ip: '203.0.113.9', ua: 'Mozilla/5.0 test' };

const file = (name: string, type: string, size = 1024) =>
  new File([new Uint8Array(size)], name, { type });
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

let fetchMock: ReturnType<typeof vi.fn>;
let deps: UploadDeps;

beforeEach(() => {
  fetchMock = vi.fn();
  deps = { fetch: fetchMock as unknown as typeof fetch, env };
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe('isFile', () => {
  it('tells a File from a string FormData entry', () => {
    expect(isFile(file('a.pdf', 'application/pdf'))).toBe(true);
    expect(isFile('a.pdf')).toBe(false);
    expect(isFile(null)).toBe(false);
  });
});

describe('uploadCv', () => {
  it('posts the PDF as multipart `file` to the public careers route (no token) and returns the key', async () => {
    fetchMock.mockResolvedValueOnce(
      json(201, {
        data: { url: 'https://x/y', key: 'careers-cv/abc-123.pdf', fileName: 'cv.pdf' },
      }),
    );
    const cv = file('cv.pdf', 'application/pdf');
    expect(await uploadCv(cv, deps)).toEqual({ cvKey: 'careers-cv/abc-123.pdf' });
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://operations.example.com/api/careers/upload-cv');
    expect(init.method).toBe('POST');
    expect(init.cache).toBe('no-store');
    expect(init.headers).toBeUndefined();
    expect(init.signal).toBeInstanceOf(AbortSignal);
    const body = init.body as FormData;
    const sent = body.get('file');
    expect(isFile(sent) && sent.name).toBe('cv.pdf');
    expect([...body.keys()]).toEqual(['file']);
  });

  it('refuses an empty file, a non-PDF, a name without .pdf and an oversize file before any call', async () => {
    const cases = [
      file('cv.pdf', 'application/pdf', 0),
      file('cv.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
      file('cv', 'application/pdf'),
      file('cv.pdf', 'application/pdf', MAX_CV_BYTES + 1),
    ];
    for (const f of cases) {
      const err = await uploadCv(f, deps).catch((e: unknown) => e);
      expect(err).toBeInstanceOf(FormActionError);
      expect((err as FormActionError).field).toEqual({ name: 'cv', code: 'file' });
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('lands the refusal on the field the page names', async () => {
    const err = await uploadCv(file('cv', 'application/pdf'), { ...deps, field: 'resume' }).catch(
      (e: unknown) => e,
    );
    expect((err as FormActionError).field).toEqual({ name: 'resume', code: 'file' });
  });

  it('a door 400 is a file refusal; a key that is not a careers-cv PDF key is an outage', async () => {
    fetchMock.mockResolvedValueOnce(json(400, { message: 'Please upload your CV as a PDF file.' }));
    await expect(uploadCv(file('cv.pdf', 'application/pdf'), deps)).rejects.toMatchObject({
      name: 'FormActionError',
      field: { name: 'cv', code: 'file' },
    });
    fetchMock.mockResolvedValueOnce(json(201, { data: { key: 'general/abc.pdf' } }));
    await expect(uploadCv(file('cv.pdf', 'application/pdf'), deps)).rejects.toMatchObject({
      name: 'FormDoorError',
      result: { kind: 'unavailable', cause: 'server' },
    });
  });

  it('maps door failures like postForm does, without a retry', async () => {
    const cv = file('cv.pdf', 'application/pdf');
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 503 }));
    await expect(uploadCv(cv, deps)).rejects.toMatchObject({
      result: { kind: 'unavailable', cause: 'server' },
    });
    fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
    await expect(uploadCv(cv, deps)).rejects.toMatchObject({
      result: { kind: 'unavailable', cause: 'network' },
    });
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 429 }));
    await expect(uploadCv(cv, deps)).rejects.toMatchObject({ result: { kind: 'tripped' } });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('is unauthorized without OPS_API_URL, with no call', async () => {
    await expect(
      uploadCv(file('cv.pdf', 'application/pdf'), {
        ...deps,
        env: { NODE_ENV: 'test' } as NodeJS.ProcessEnv,
      }),
    ).rejects.toMatchObject({ result: { kind: 'unauthorized' } });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('uploadFraudEvidence', () => {
  it('posts to the door with the write token, the visitor headers and ONLY the `file` part', async () => {
    fetchMock.mockResolvedValueOnce(
      json(201, {
        data: {
          key: 'website-fraud/abc-123.png',
          mimeType: 'image/png',
          sizeBytes: 1024,
          dryRun: false,
        },
      }),
    );
    const shot = file('shot.png', 'image/png');
    expect(await uploadFraudEvidence(shot, visitor, deps)).toEqual({
      key: 'website-fraud/abc-123.png',
    });
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://operations.example.com/api/website/v1/uploads/fraud-evidence');
    expect(init.headers).toEqual({
      Authorization: `Bearer ${env.OPS_WEBSITE_WRITE_TOKEN}`,
      'X-Website-Visitor-Ip': '203.0.113.9',
      'X-Website-Visitor-Ua': 'Mozilla/5.0 test',
    });
    expect([...(init.body as FormData).keys()]).toEqual(['file']);
  });

  it('refuses an empty or oversize file before any call, on the `evidence` field by default', async () => {
    for (const f of [
      file('a.png', 'image/png', 0),
      file('a.png', 'image/png', MAX_EVIDENCE_BYTES + 1),
    ]) {
      const err = await uploadFraudEvidence(f, visitor, deps).catch((e: unknown) => e);
      expect(err).toBeInstanceOf(FormActionError);
      expect((err as FormActionError).field).toEqual({ name: 'evidence', code: 'file' });
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('a door 400 (sniff failed) is a file refusal; a null key (test-class dry run) is an outage', async () => {
    fetchMock.mockResolvedValueOnce(
      json(400, {
        code: 'FRAUD_EVIDENCE_TYPE',
        message: 'Only JPEG, PNG, WEBP or PDF files are accepted.',
      }),
    );
    await expect(
      uploadFraudEvidence(file('a.gif', 'image/gif'), visitor, deps),
    ).rejects.toMatchObject({
      field: { name: 'evidence', code: 'file' },
    });
    fetchMock.mockResolvedValueOnce(json(201, { data: { key: null, dryRun: true } }));
    await expect(
      uploadFraudEvidence(file('a.png', 'image/png'), visitor, deps),
    ).rejects.toMatchObject({
      result: { kind: 'unavailable', cause: 'server' },
    });
  });

  it('401 → unauthorized, 404 → off; no token → unauthorized without a call', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 401 }));
    await expect(
      uploadFraudEvidence(file('a.png', 'image/png'), visitor, deps),
    ).rejects.toMatchObject({
      result: { kind: 'unauthorized' },
    });
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 404 }));
    await expect(
      uploadFraudEvidence(file('a.png', 'image/png'), visitor, deps),
    ).rejects.toMatchObject({
      result: { kind: 'off' },
    });
    await expect(
      uploadFraudEvidence(file('a.png', 'image/png'), visitor, {
        ...deps,
        env: { ...env, OPS_WEBSITE_WRITE_TOKEN: '' } as NodeJS.ProcessEnv,
      }),
    ).rejects.toBeInstanceOf(FormDoorError);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
