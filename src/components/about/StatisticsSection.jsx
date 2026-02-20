import { Typography } from 'antd'
import useSWR from 'swr'
import { useTranslation } from 'next-i18next'
import { UniversityService, PartnerService, StudentService } from '@api/services'
import { compactFormat } from '@utils/number-format'

const Statistics = ({ value, label, subLabel }) => {
  return (
    <div className="flex flex-col items-center">
      <Typography.Text className="text-[48px] font-bold">
        {value}
      </Typography.Text>
      <div className="flex flex-col">
        <Typography.Text className="text-[25px] font-medium text-center">
          {label}
        </Typography.Text>
        <Typography.Text className="text-[16px] font-light text-center">
          {subLabel}
        </Typography.Text>
      </div>
    </div>
  )
}

const StatisticsSection = () => {
  const { t } = useTranslation('about')
  
  const { data: studentsCount, isLoading: isLoadingStudentsCount } = useSWR('students-count', async () => {
    const response = await StudentService.getStudentsCount()
    return response.data
  })
  
  const { data: universitiesCount, isLoading: isLoadingUniversitiesCount } = useSWR('universities-count', async () => {
    const response = await UniversityService.getUniversitiesCount()
    return response.data
  })
  
  const { data: partnersCount, isLoading: isLoadingPartnersCount } = useSWR('partners-count', async () => {
    const response = await PartnerService.getPartnersCount()
    return response.data
  })
  
  return (
    <section className="flex max-md:flex-col justify-evenly max-md:gap-y-10">
      <Statistics
        value={isLoadingStudentsCount ? 0 : `+${compactFormat(studentsCount) ?? 0}`}
        label={t('statistics.students')}
      />
      <Statistics
        value={isLoadingUniversitiesCount ? 0 : compactFormat(universitiesCount) ?? 0}
        label={t('statistics.universities')}
      />
      <Statistics
        value={isLoadingPartnersCount ? 0 : `+${compactFormat(partnersCount) ?? 0}`}
        label={t('statistics.agencyMentor')}
      />
    </section>
  )
}

export default StatisticsSection
