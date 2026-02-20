import { Typography } from 'antd'
import Select from 'react-select'
import { cn } from '@utils/cn'

const SelectInput = ({
  label,
  value,
  onSelect,
  options = [],
  placeholder = 'Select...',
  formatOptionLabel = false,
  menuPlacement = 'bottom',
  labelPlacement = 'top',
  maxHeight = 200,
  isClearable = true,
  isDisabled = false,
  isMulti = false,
  error,
  backgroundColor,
  noOptionsMessage = () => 'No options',
  selectClassName,
  labelClassName,
  ...props
}) => {
  const handleChange = (selectedOption) => {
    onSelect(selectedOption || '')
  }

  return (
    <div {...props}>
      <div className={cn('group space-y-0.5',
        labelPlacement === 'bottom' && 'flex flex-col-reverse gap-2.5',
        labelPlacement === 'left' && 'flex flex-row items-center gap-2.5',
        labelPlacement === 'right' && 'flex flex-row-reverse items-center gap-2.5',
      )}>
        {
          label && (
            <Typography.Text className={cn('font-light group-focus-within:text-primary', labelClassName)}>
              {label}
            </Typography.Text>
          )
        }
        <Select
          placeholder={placeholder}
          closeMenuOnSelect
          formatOptionLabel={formatOptionLabel}
          options={options}
          onChange={handleChange}
          value={value}
          isClearable={isClearable}
          isDisabled={isDisabled}
          classNamePrefix="react_select"
          className={cn('capitalize', selectClassName)}
          menuPlacement={menuPlacement}
          noOptionsMessage={noOptionsMessage}
          isMulti={isMulti}
          styles={{
            option: (styles, { isFocused, isSelected }) => ({
              ...styles,
              backgroundColor: isSelected ? '#bae6fd' : isFocused ? '#e0f2fe' : null,
              color: '#4e4e4e',
              fontWeight: '300',
            })
          }}
        />
      </div>
      {error && <label className="xxl:text-xs text-base text-red-500">{error}</label>}
    </div>
  )
}

export default SelectInput
