import { Children } from 'react'
import { Typography, Divider, Select as AntSelect } from 'antd'

const Form = ({ onSubmit, isSubmitting, children }) => {
  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit()
  }
  
  return (
    <form
      onSubmit={handleSubmit}
      className="flex max-md:flex-col gap-5 md:min-w-[700px] md:h-full bg-secondary rounded-2xl md:rounded-full overflow-hidden shadow-lg"
    >
      <div className="flex max-md:flex-col justify-between md:items-center max-md:gap-2.5 flex-1 px-5 max-md:pt-5 md:rounded-l-full">
        {
          Children.map(children, (child, index) => {
            return (
              <div className="flex items-center">
                {index > 0 && <Divider type="vertical" className="max-md:hidden mr-5 h-10"/>}
                {child}
              </div>
            )
          })
        }
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex justify-center items-center h-16 px-8 md:rounded-r-full bg-primary disabled:cursor-not-allowed"
      >
        <Typography.Text className="min-w-max font-semibold text-secondary">
          Search
        </Typography.Text>
      </button>
    </form>
  )
}

const Select = ({ label, options, value, onChange, isLoadingOptions, notFoundContent, short = false }) => {
  return (
    <div className="relative flex flex-col">
      <Typography.Text type="secondary" className="pl-3 text-[12px]">
        {label}
      </Typography.Text>
      <AntSelect
        value={value}
        onChange={onChange}
        options={options}
        variant="borderless"
        suffixIcon={null}
        placeholder={`Select ${label}`}
        loading={isLoadingOptions}
        notFoundContent={notFoundContent}
        allowClear
        showSearch
        className={`home-select ${short ? 'w-40' : 'w-48'}`}
      />
    </div>
  )
}

const NotFoundContent = ({ text }) => {
  return (
    <div className="flex justify-center w-full">
      <Typography.Text type="secondary" className="text-[12px]">
        {text}
      </Typography.Text>
    </div>
  )
}

const SearchForm = {
  Form,
  Select,
  NotFoundContent
}

export default SearchForm
