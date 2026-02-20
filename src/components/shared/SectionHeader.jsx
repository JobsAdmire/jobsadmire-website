import { Typography } from 'antd';

const SectionHeader = ({ surtitle, title, description }) => {
  return (
    <div className="flex flex-col justify-center gap-y-1 w-full sm:w-4/5 md:w-2/5">
      {
        surtitle && (
          <Typography.Text type="secondary" className="text-center w-full font-light">
            {surtitle}
          </Typography.Text>
        )
      }
      <Typography.Title level={3} className="text-center">
        {title}
      </Typography.Title>
      {
        description && (
          <Typography.Title level={5} type="secondary" className="text-center !font-light">
            {description}
          </Typography.Title>
        )
      }
    </div>
  )
}

export default SectionHeader
