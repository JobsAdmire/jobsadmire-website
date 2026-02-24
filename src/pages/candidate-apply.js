import React from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import HomeForm from '@components/candidate-form/homeform'
const CandidateApply = () => {
  return (
    <div>
      <HomeForm/>
    </div>
  )
}
export const getStaticProps = async ({ locale }) => {
  const { getLayoutCmsProps } = require("@/lib/api/cmsHelper");
  const { getPageAndLayoutContent } = require("@/lib/api/cmsContent");

  const [layoutProps, cmsPageContent] = await Promise.all([
    getLayoutCmsProps(locale),
    getPageAndLayoutContent("candidate-apply", locale),
  ]);

  return {
    props: {
      ...(await serverSideTranslations(locale, ['about', 'common'])),
      ...layoutProps,
      cmsPageContent,
    },
    revalidate: 60,
  }
}
export default CandidateApply
