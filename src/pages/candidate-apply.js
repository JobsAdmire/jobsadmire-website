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
  return {
    props: {
      ...(await serverSideTranslations(locale, ['about', 'common'])),
    },
  }
}
export default CandidateApply
