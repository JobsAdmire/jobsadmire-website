import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main id="main">
      <h1 data-testid="home-h1">{locale === 'tr' ? 'Ana sayfa' : 'Home'}</h1>
      <Link href="/hire-workers">hire</Link>
    </main>
  );
}
