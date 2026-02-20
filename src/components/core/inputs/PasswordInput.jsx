import { useMemo, useState } from 'react'
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5'
import { cn } from '@lib/utils/cn'
import { Typography } from 'antd';

const PasswordInput = ({
  id,
  value,
  label,
  placeholder,
  onChange,
  disabled,
  autoComplete = 'none',
  width = "w-full",
  labelClassName,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false)
  
  const toggleVisibility = () => setShowPassword((prev) => !prev)
  
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
        <div className="relative">
          <input
            id={id}
            type={showPassword ? 'text' : 'password'}
            autoComplete={autoComplete}
            value={value}
            className={`placeholder:font-light relative block font-light text-sm w-full h-10 px-5 placeholder-gray-500 !bg-primary-extra-light rounded-xl focus:outline-none border-none focus:border-sky-400`}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
          <div
            onClick={toggleVisibility}
            className="absolute inset-y-0 right-0 px-3 flex items-center cursor-pointer text-gray-400">
            {showPassword ? (
              <IoEyeOffOutline className="w-4 h-4"/>
            ) : (
              <IoEyeOutline className="w-4 h-4"/>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PasswordInput
