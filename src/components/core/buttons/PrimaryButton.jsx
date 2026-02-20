import { Typography } from 'antd'
import { cn } from '@utils/cn'

const PrimaryButton = ({ text, className, textClassName, negative = false, type = 'button', ...props }) => {
  return (
    <button
      {...props}
      type={type}
      className={cn(
        'group text-white px-6 py-2 rounded-lg hover:bg-primary-hover',
        negative ? 'bg-secondary' : 'bg-primary',
        className
      )}
    >
      <Typography.Text
        className={cn(
          'font-bold',
          negative ? 'text-primary group-hover:text-secondary' : 'text-secondary',
          textClassName
        )}
      >
        {text}
      </Typography.Text>
    </button>
  )
}

export default PrimaryButton
