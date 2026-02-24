
import React from 'react'
import Hero from '@/components/kazakhstanresidence/hero'
import Benefits from '@/components/kazakhstanresidence/benefits'
import Stages from '@/components/kazakhstanresidence/stages'
import Choose from '@/components/kazakhstanresidence/choose'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const kazakhstanresidence = () => {
  return (
    <div>
      <Hero/>
      <Benefits/>
      <Stages/>
      <Choose/>
      
    </div>
  )
}
export const getStaticProps = async ({ locale }) => {
  const { getLayoutCmsProps } = require("@/lib/api/cmsHelper");
  const { getPageAndLayoutContent } = require("@/lib/api/cmsContent");

  const [layoutProps, cmsPageContent] = await Promise.all([
    getLayoutCmsProps(locale),
    getPageAndLayoutContent("immigration/kazakhstan-1", locale),
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
export default kazakhstanresidence
