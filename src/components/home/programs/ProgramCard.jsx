import { IoTimeOutline, IoLocationOutline, IoGlobeOutline } from 'react-icons/io5'
import { Typography } from 'antd'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import moment from 'moment'
import { appURL } from '@constants/app'
import { formatAmount } from '@utils/number-format'
import { PrimaryButton } from '@components/core/buttons'

const removeUnderScores = (str) => {
  return str.replace(/_/g, ' ').toLowerCase()
}

const ProgramCard = ({ program }) => {
  const router = useRouter()
  
  const currentTime = new Date().getTime()
  const applicationStartDate = moment(program.applicationStartDate)
  const applicationEndDate = moment(program.applicationEndDate)
  
  const isApplicationClosed = moment(currentTime).isAfter(applicationEndDate)
  const isApplicationNotStarted = moment(currentTime).isBefore(applicationStartDate)
  const isApplyDisabled = isApplicationClosed || isApplicationNotStarted
  
  const handleApply = () => {
    if (isApplyDisabled) return
    
    const searchParams = new URLSearchParams()
    searchParams.set('external', 'true')
    searchParams.set('program', program.name)
    searchParams.set('universities', program.universityId)
    searchParams.set('universityType', program.universityType)
    searchParams.set('degreeType', program.degreeType)
    searchParams.set('campusType', program.campusType)
    searchParams.set('duration', program.duration)
    searchParams.set('language', program.language)
    router.push(`${appURL}/search-programs?${searchParams.toString()}`)
  }
  
  return (
    <div className="flex flex-col lg:flex-row gap-2.5 max-md:w-full md:h-48 rounded-xl shadow-md overflow-hidden">
      <div className="relative bg-primary-light max-md:w-full md:h-full max-md:aspect-video md:aspect-square">
        {
          program.universityImage && (
            <Image
              src={program.image?.url ?? program.universityImage?.url}
              alt={program.universityName}
              fill
              className="object-cover object-center"
            />
          )
        }
      </div>
      <div className="flex flex-col sm:flex-row justify-between max-sm:w-full sm:flex-1">
        <div className="flex flex-col justify-evenly h-full px-5 md:px-2.5">
          <div>
            <Typography.Text type="secondary" className="capitalize font-light line-clamp-1">
              {removeUnderScores(program.degreeType)}
            </Typography.Text>
            <Typography.Title level={4} className="uppercase text-xl line-clamp-1">
              {program.name}
            </Typography.Title>
            <Typography.Text className="capitalize font-light line-clamp-1">
              {program.universityName}
            </Typography.Text>
          </div>
          <hr className="w-full sm:w-1/2 max-md:my-2.5"/>
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <Typography.Text className="text-primary">
                <IoGlobeOutline className="w-4 h-4"/>
              </Typography.Text>
              <Typography.Text className="capitalize font-light text-sm">
                {removeUnderScores(program.language)}
              </Typography.Text>
            </div>
            <div className="flex items-center gap-1.5">
              <Typography.Text className="text-primary">
                <IoTimeOutline className="w-4 h-4"/>
              </Typography.Text>
              <Typography.Text className="capitalize font-light text-sm">
                {removeUnderScores(program.modeOfStudy)}
              </Typography.Text>
            </div>
            <div className="flex items-center gap-1.5">
              <Typography.Text className="text-primary">
                <IoLocationOutline className="w-4 h-4"/>
              </Typography.Text>
              <Typography.Text className="capitalize font-light text-sm">
                {removeUnderScores(program.campusType)}
              </Typography.Text>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between items-center w-full md:w-60 h-full p-5 md:py-2.5 max-md:space-y-2.5">
          <div className="flex flex-col justify-between w-full p-2.5 border border-primary bg-primary-extra-light rounded-lg">
            {
              program.discountPercentage
                ? (
                  <Typography.Text className="line-through text-danger">
                    {formatAmount(program.tuitionFee, program.currency)}
                  </Typography.Text>
                )
                : <div className="h-4"/>
            }
            <Typography.Text className="text-xl font-medium">
              {
                formatAmount(
                  program.discountPercentage
                    ? program.tuitionFee - (program.discountPercentage * program.tuitionFee) / 100
                    : program.tuitionFee,
                  program.currency
                )
              }
            </Typography.Text>
            <Typography.Text className="text-xs font-light">
              {program.degreeType === 'BACHELOR_DEGREE' ? 'Annual Price' : 'Entire Program Price'}
            </Typography.Text>
          </div>
          <PrimaryButton
            text="Apply"
            disabled={isApplyDisabled}
            onClick={handleApply}
            className={`w-full rounded-lg ${isApplyDisabled && 'bg-primary-light cursor-not-allowed'}`}
            textClassName="font-medium text-lg"
          />
          <Typography.Text className="text-xs font-light text-center">
            {
              isApplicationClosed
                ? 'Applications Closed'
                : isApplicationNotStarted
                ? `Apply Until ${applicationEndDate.format('DD/MM/YYYY')}`
                : `Application Starts On ${applicationEndDate.format('DD/MM/YYYY')}`
            }
          </Typography.Text>
        </div>
      </div>
    </div>
  )
}

export default ProgramCard
