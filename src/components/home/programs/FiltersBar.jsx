import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { HiOutlineXMark } from 'react-icons/hi2'
import { RiFilter2Fill } from 'react-icons/ri'
import Collapse from 'react-collapse'
import { Typography } from 'antd'
import { PrimaryButton } from '@components/core/buttons'
import { SelectInput, SearchInput } from '@components/core/inputs'

const FiltersBar = ({
  filteredEntityName,
  filters,
  currentFiltersValues,
  onReset,
  initialSearchValue,
  onSearch,
  sortOptions,
  selectedSortOption,
  onSort,
  showSearch = true
}) => {
  const { t } = useTranslation('common')
  const [isOpened, setIsOpened] = useState(false)
  const currentFiltersValuesLength = currentFiltersValues.length
  
  const handleSearch = (event) => {
    onSearch(event.target.value)
  }
  
  return (
    <form onSubmit={(event) => event.preventDefault()} className="flex flex-col gap-2.5">
      <div
        onClick={() => setIsOpened(!isOpened)}
        className="flex flex-wrap justify-between items-center gap-2.5 md:px-5 md:py-2.5 w-full rounded-xl cursor-pointer md:shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px]"
      >
        <div className="hidden lg:block">
          <PrimaryButton text={isOpened ? t('labels.filters.closeFilter') : t('labels.filters.openFilter')} />
        </div>
        <div className="lg:hidden relative h-full p-2 text-secondary bg-primary rounded-lg">
          <RiFilter2Fill size={20}/>
          <Typography.Text className={`absolute top-0 right-0 translate-x-2 -translate-y-2 justify-center items-center w-5 h-5 text-sm text-secondary bg-danger rounded-full ${currentFiltersValuesLength === 0 ? 'hidden' : 'flex'
            }`}>
            {currentFiltersValuesLength}
          </Typography.Text>
        </div>
        {
          showSearch && <SearchInput
            onClick={(event) => event.stopPropagation()}
            onChange={handleSearch}
            defaultValue={initialSearchValue}
            placeholder={t('labels.search.searchIn', { entityName: filteredEntityName })}
            className="max-w-80 flex-1"
          />
        }
        {
          (sortOptions && sortOptions.length > 0) && (
            <div
              onClick={(event) => event.stopPropagation()}
              className="flex justify-start items-center gap-2.5 max-md:w-full"
            >
              <Typography.Text>{t('labels.filters.sortBy')}</Typography.Text>
              <SelectInput
                options={sortOptions}
                value={selectedSortOption}
                onSelect={onSort}
                className="flex justify-end"
                selectClassName="ml-auto w-48"
              />
            </div>
          )
        }
      </div>
      {
        (!isOpened && currentFiltersValuesLength > 0) && (
          <div className="flex flex-wrap justify-start items-center gap-5 w-full mb-5 md:mb-0">
            {
              currentFiltersValues.map(({ filter, onFilterRemove }) => (
                <Typography.Text
                  key={filter}
                  className="flex justify-between items-center gap-1 text-xs w-max h-8 pl-4 pr-2 rounded-md text-secondary bg-primary"
                >
                  {filter}
                  <HiOutlineXMark onClick={onFilterRemove} className="w-4 h-4 cursor-pointer"/>
                </Typography.Text>
              ))
            }
          </div>
        )
      }
      <Collapse isOpened={isOpened}>
        <div className="w-full p-5 md:px-10 space-y-5 rounded-xl bg-secondary shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px]">
          <div className="flex justify-start items-center gap-10">
            {
              isOpened && (
                <div className="flex flex-wrap justify-start items-center gap-5 w-full">
                  {
                    currentFiltersValues.map(({ filter, onFilterRemove }) => (
                      <Typography.Text
                        key={filter}
                        className="flex justify-between items-center gap-1 text-xs w-max h-8 pl-4 pr-2 rounded-md text-secondary bg-primary"
                      >
                        {filter}
                        <HiOutlineXMark onClick={onFilterRemove} className="w-4 h-4 cursor-pointer"/>
                      </Typography.Text>
                    ))
                  }
                </div>
              )
            }
          </div>
          {
            filters ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3.5 md:gap-x-5 md:gap-y-2.5 w-full">
                {
                  filters.map((filter, index) => (
                    <div
                      key={filter.label ?? index}
                      className="flex justify-between md:justify-start items-center md:items-start md:flex-col gap-1 w-full md:w-auto">
                      {
                        filter.label && (
                          <Typography.Text className="text-start font-medium w-3/4 md:w-full">
                            {filter.label}
                          </Typography.Text>
                        )
                      }
                      <div
                        className="flex md:block justify-center md:justify-start items-center md:items-start gap-6 md:gap-0 w-full">
                        {filter.input}
                      </div>
                    </div>
                  ))
                }
              </div>
            ) : (
              <Typography.Text type="secondary" className="w-full text-center">
                {t('labels.filters.noFilters')}
              </Typography.Text>
            )
          }
          <hr className="w-full"/>
          <div className="flex justify-between items-center py-2 md:py-0 p-1">
            <PrimaryButton
              text={t('labels.filters.clear')}
              onClick={onReset}
              className="pl-0 pr-3 bg-transparent"
              textClassName="text-secondary-dark font-normal hover:font-medium"
            />
            <PrimaryButton
              text={t('labels.filters.closeFilter')}
              onClick={() => setIsOpened(false)}
              className="px-5"
            />
          </div>
        </div>
      </Collapse>
    </form>
  )
}

export default FiltersBar
