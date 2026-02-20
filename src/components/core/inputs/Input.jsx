import { cn } from '@utils/cn'
import { Typography } from 'antd'

const Input = ({
  id,
  label,
  value,
  placeholder,
  onChange,
  onFocus,
  error,
  type = 'text',
  autoComplete = 'none',
  disabled,
  labelClassName,
  ...props
}) => {
  return (
    <div {...props}>
      <div className="group space-y-0.5 w-full">
        {
          label && (
            <Typography.Text className={cn('font-light group-focus-within:text-primary', labelClassName)}>
              {label}
            </Typography.Text>
          )
        }
        <input
          id={id}
          value={value}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`placeholder:font-light relative block font-light text-sm w-full h-10 px-5 placeholder-gray-500 !bg-primary-extra-light rounded-xl focus:outline-none border-none focus:border-sky-400 ${
            error && 'focus:ring-red-100 border border-red-300'
          }`}
          onChange={(e) => onChange(e.target.value)}
          onClick={onFocus}
          type={type}
          placeholder={placeholder}
          aria-label={label}
        />
      </div>
      {error && <label className="xxl:text-xs text-base text-red-500">{error}</label>}
    </div>
  )
}

export default Input
