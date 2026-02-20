import { FiSearch } from 'react-icons/fi'
import { cn } from '@utils/cn'

const SearchInput = ({
  id,
  placeholder,
  onChange,
  onClick,
  onFocus,
  value,
  defaultValue,
  className,
  iconClassName
}) => {
  return (
    <div
      onClick={onClick}
      onFocus={onFocus}
      className={cn(
        'relative flex items-center w-96 max-w-full h-10 pl-10 pr-2.5 bg-primary-extra-light rounded-xl',
        className
      )}
    >
      <FiSearch className={cn(
        'absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-primary',
        iconClassName
      )}/>
      <input
        type="search"
        name={id}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full text-sm bg-transparent focus:outline-none"
      />
    </div>
  )
}

export default SearchInput
