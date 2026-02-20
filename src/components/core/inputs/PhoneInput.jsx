import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { cn } from '@lib/utils/cn'
import { Typography } from 'antd';

const CorePhoneInput = ({
  id,
  label,
  value,
  placeholder,
  onChange,
  onFocus,
  country,
  disabled,
  width = 'w-full',
  className,
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
        <PhoneInput
          country={country ?? 'tr'}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          disabled={disabled}
          onClick={onFocus}
          inputClass={`!relative !block !font-light !text-sm !w-full !h-10 !placeholder-gray-500 !bg-primary-extra-light !rounded-xl !focus:outline-none !border-none !focus:border-sky-400`}
        />
      </div>
    </div>
  )
}

export default CorePhoneInput
