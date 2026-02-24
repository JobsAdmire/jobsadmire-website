import React from 'react'
import Hero from '@/components/turkeyresidence/hero'
import Benefits from '@/components/turkeyresidence/benefits'
import Stages from '@/components/turkeyresidence/stages'
import Choose from '@/components/turkeyresidence/choose'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const turkeyresidence = () => {
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
    getPageAndLayoutContent("immigration/turkey", locale),
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
export default turkeyresidence
