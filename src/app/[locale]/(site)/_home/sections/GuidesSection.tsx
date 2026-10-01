import { blogNavVisible } from '@/content/collections';
import { makeTf } from '@/content/pure';
import { PostCard } from '@/design/blocks/PostCard';
import { Button } from '@/design/primitives/Button';
import { Eyebrow } from '@/design/primitives/Eyebrow';
import { Section } from '@/design/primitives/Section';
import { Link } from '@/i18n/navigation';
import { guidesPosts } from '../lib/guides';
import { H2, SECTION_HEAD } from './styles';
import type { SectionProps } from './types';

/**
 * "Guides and market updates" (design lines 1026–1069). W4: `/blog` is noindex and out of every
 * chrome list until six Turkish bodies exist, and every related-article block — this one included
 * — renders nothing below that threshold (`blogNavVisible`). When visible, the design's hard-coded
 * featured card and four-item list (home.203–205, 262–273, 290–293) are replaced by the `blog`
 * collection through `PostCard` (the newest written article featured, the next four as rows; the
 * category pills are the rows' own `categoryLabelId`s, home.262–265). The side list and the top
 * CTA hide at ≤ 460 px, where the bottom CTA shows (W10).
 */
export function GuidesSection({ locale, bundle }: SectionProps) {
  if (!blogNavVisible(bundle)) return null;
  const posts = guidesPosts(bundle, locale);
  if (posts.length === 0) return null;
  const tf = makeTf(bundle, locale);
  const [featured, ...rest] = posts;
  return (
    <Section tone="light" id="guides">
      <div data-testid="guides" className="container-site">
        <div className={SECTION_HEAD}>
          <div className="min-w-0">
            <Eyebrow>{tf('home.220')}</Eyebrow>
            <h2 className={`${H2} m-0 mt-3`}>{tf('home.175')}</h2>
          </div>
          <div className="max-xs:hidden">
            <Button variant="nav" href="/blog">
              {tf('home.176')}
            </Button>
          </div>
        </div>
        <div className="grid items-stretch gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <PostCard
            bundle={bundle}
            locale={locale}
            post={featured}
            variant="featured"
            headingLevel={3}
          />
          {rest.length > 0 ? (
            <div className="flex flex-col gap-3 max-xs:hidden">
              {rest.slice(0, 4).map((post) => (
                <PostCard
                  key={post.key}
                  bundle={bundle}
                  locale={locale}
                  post={post}
                  variant="row"
                  headingLevel={3}
                />
              ))}
              <Link
                href="/blog"
                className="py-2 text-body-sm font-extrabold text-blue-safe no-underline hover:underline"
              >
                {tf('home.179')}
              </Link>
            </div>
          ) : null}
        </div>
        <div className="mt-4 flex flex-col xs:hidden">
          <Button variant="nav" href="/blog">
            {tf('home.176')}
          </Button>
        </div>
      </div>
    </Section>
  );
}
