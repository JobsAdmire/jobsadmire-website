'use client';
import dynamic from 'next/dynamic';
import type { PostFilterProps } from './PostFilter';

/** B-5 / W13 amended: the tools island is client-only and fetched as its own chunk after
 *  hydration — `ssr: false` is legal only inside a `'use client'` module (final review §6). The
 *  page mounts this only from `TOOLS_MIN_POSTS` non-featured written articles, inside a slot
 *  whose reserved height keeps the late mount from shifting the list. */
const PostFilter = dynamic(() => import('./PostFilter').then((m) => m.PostFilter), {
  ssr: false,
});

export function PostFilterLoader(props: PostFilterProps) {
  return <PostFilter {...props} />;
}
