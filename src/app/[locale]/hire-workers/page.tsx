import { setRequestLocale } from 'next-intl/server';

export default async function HireWorkers({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main id="main">
      <h1 data-testid="hire-h1">{locale}</h1>
    </main>
  );
}
