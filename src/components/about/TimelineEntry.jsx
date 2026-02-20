import Image from 'next/image'
import { Typography } from 'antd'

const TimelineEntry = ({ year, imageURL, description }) => {
  return (
    <div className="space-y-5 md:w-[720px]">
      <div className="md:hidden relative aspect-[16/11]">
        <Image
          src={imageURL}
          alt={`About Us ${year}`}
          quality={100}
          fill
          className="rounded-2xl"
        />
      </div>
      <Image
        src={imageURL}
        alt={`About Us ${year}`}
        quality={100}
        width={720}
        height={497}
        className="max-md:hidden rounded-2xl aspect-video object-cover"
      />
      <div className="flex flex-col">
        <Typography.Title level={4}>
          {Array.isArray(year) ? year.join(' - ') : year}
        </Typography.Title>
        <Typography.Text className="font-light">
          {description}
        </Typography.Text>
      </div>
    </div>
  )
}

export default TimelineEntry
