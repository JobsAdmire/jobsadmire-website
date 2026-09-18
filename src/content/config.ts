export type ContentSource = 'LOCAL' | 'OPS';
export const FIXTURE_ONLY_COLLECTIONS = ['pool', 'stories', 'representatives'] as const;

export function contentSource(): ContentSource {
  const wanted = process.env.CONTENT_SOURCE === 'OPS';
  const configured =
    Boolean(process.env.OPS_API_URL) && (process.env.OPS_WEBSITE_READ_TOKEN?.length ?? 0) >= 32;
  return wanted && configured ? 'OPS' : 'LOCAL';
}
