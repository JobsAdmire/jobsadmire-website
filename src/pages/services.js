import ServicesPage from '@/components/services/service';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
export default function Services() {
  return <ServicesPage />;
}

// Add these Next.js specific functions to fix the error
export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['about', 'common'])),
    },
  }
}
