import type React from 'react';
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);

/** R17: the typed-pathname href `Link` accepts — the target of the one sanctioned
 *  string→href cast, in `Button`, where hrefs arrive as plain strings. */
export type Href = React.ComponentProps<typeof Link>['href'];
