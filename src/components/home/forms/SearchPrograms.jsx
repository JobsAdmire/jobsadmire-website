import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'next-i18next'
import useSWR from 'swr'
import { UniversityService } from '@api/services'
import { degreeTypeOptions } from '@constants/filters'
import SearchForm from './SearchForm'

const SearchPrograms = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [degree, setDegree] = useState(null)
  const [program, setProgram] = useState(null)
  const [university, setUniversity] = useState(null)
  
  const degreeTypes = degreeTypeOptions
  
  const { data: universities, isLoading: isLoadingUniversities } = useSWR(
    'universities',
    async () => {
      //const response = await UniversityService.getUniversitiesIdsAndNames()
      const res = await fetch(`/api/universities?page=${pageNumber}&size=${pageSize}`);
      const response = await res.json();
      return response.data.map(({ id, name }) => ({ value: id, label: name }))
    }
  )
  
  const { data: programs, isLoading: isLoadingPrograms } = useSWR(
    ['programs', university, degree],
    async ([, universityId, degreeType]) => {
      if (!university) {
        return []
      }
      
      const response = await UniversityService.getAllProgramsNames({ universityId, degreeType })
      
      return response.data.map((name) => ({ value: name, label: name }))
    }
  )
  
  const handleSubmit = () => {
    if (isRedirecting) {
      return
    }
    
    setIsRedirecting(true)
    
    const searchParams = new URLSearchParams()

    for (const [key, value] of [
      ['degreeType', degree],
      ['name', program],
      ['universities', university]
    ]) {
      if (value) {
        searchParams.set(key, value)
      }
    }
    
    router.push(`/search/programs${searchParams.size > 0 ? `?${searchParams.toString()}` : ''}`)
  }
  
  return (
    <SearchForm.Form
      onSubmit={handleSubmit}
      isSubmitting={isRedirecting}
    >
      <SearchForm.Select
        label={t('labels.search.degree')}
        options={[{ value: '', label: t('labels.search.allDegrees') }, ...(degreeTypes ?? [])]}
        value={degree}
        onChange={setDegree}
        short
        notFoundContent={
          <SearchForm.NotFoundContent
            text={t('labels.search.noDegreeFound')}
          />
        }
      />
      <SearchForm.Select
        label={t('labels.search.university')}
        options={[{ value: '', label: t('labels.search.allUniversities') }, ...(universities ?? [])]}
        value={university}
        onChange={setUniversity}
        isLoadingOptions={isLoadingUniversities}
        notFoundContent={
          <SearchForm.NotFoundContent
            text={isLoadingUniversities ? t('labels.search.loadingUniversities') : t('labels.search.noUniversityFound')}
          />
        }
      />
      <SearchForm.Select
        label={t('labels.search.program')}
        options={(
          university
            ? (!programs || programs.length === 0)
              ? []
              : [{ value: '', label: t('labels.search.allPrograms') }, ...programs]
            : []
        )}
        value={program}
        onChange={setProgram}
        isLoadingOptions={isLoadingPrograms}
        notFoundContent={
          <SearchForm.NotFoundContent
            text={
              isLoadingPrograms
                ? t('labels.search.loadingPrograms')
                : !university
                  ? t('labels.search.pleaseSelectUniversity')
                  : t('labels.search.noProgramFound')
            }
          />
        }
      />
    </SearchForm.Form>
  )
}

export default SearchPrograms
