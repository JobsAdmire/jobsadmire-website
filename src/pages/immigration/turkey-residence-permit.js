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
  return {
    props: {
      ...(await serverSideTranslations(locale, ['about', 'common'])),
    },
  }
}
export default turkeyresidence
