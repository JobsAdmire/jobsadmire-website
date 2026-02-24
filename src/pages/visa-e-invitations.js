import React from 'react'
import Head from 'next/head'
import Visa from '@components/visa-price/visahero'
import Packages from '@components/visa-price/packages'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Plans from '@components/visa-price/plans'
const visy = () => {
  return (
    <div>
      <Visa/>
      <Packages/>
      {/* <Plans/> */}
    </div>
  )
}
export const getStaticProps = async ({ locale }) => {
  const { getPageAndLayoutContent } = require("@/lib/api/cmsContent");

  const cmsPageContent = await getPageAndLayoutContent("visa-relocation", locale);

  return {
    props: {  
      ...(await serverSideTranslations(locale, ['about', 'common', 'travel'])),
      cmsPageContent,
    },
    revalidate: 60,
  }
}
export default visy
