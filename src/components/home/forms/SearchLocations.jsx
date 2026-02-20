import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'next-i18next'
import useSWR from 'swr'
import { AccommodationService, UniversityService } from '@api/services'
import { findCountryByCode } from '@utils/countries'
import { appURL } from '@constants/app'
import SearchForm from './SearchForm'

const SearchLocations = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [country, setCountry] = useState(null)
  const [city, setCity] = useState(null)
  const [university, setUniversity] = useState(null)
  
  const { data: countries, isLoading: isLoadingCountries } = useSWR(
    'countries',
    async () => {
      const response = await AccommodationService.getCountries()
      return response.data.map((countryCode) => ({ value: countryCode, label: findCountryByCode(countryCode).label }))
    }
  )
  
  const { data: cities, isLoading: isLoadingCities } = useSWR(
    country ? ['cities', country] : null,
    async ([, countryCode]) => {
      const response = await AccommodationService.getCities({ country: countryCode })
      return response.data.map((city) => ({ value: city, label: city }))
    }
  )
  
  const { data: universities, isLoading: isLoadingUniversities } = useSWR(
    'universities',
    async () => {
      const response = await UniversityService.getUniversitiesIdsAndNames()
      const query = new URLSearchParams()
      return response.data.map(({ id, name, longitude, latitude }) => {
        // To ensure that the value is unique for each option
        query.set('universityId', id)
        
        // Will be used to get the nearest accommodations
        query.set('longitude', longitude)
        query.set('latitude', latitude)
        
        return {
          label: name,
          value: query.toString()
        }
      })
    }
  )

  const handleSubmit = () => {
    if (isRedirecting) {
      return
    }
    
    setIsRedirecting(true)
    
    const searchParams = new URLSearchParams()
    searchParams.set('external', 'true')
    
    for (const [key, value] of [
      ['countries', country],
      ['cities', city],
    ]) {
      if (value) {
        searchParams.set(key, value)
      }
    }
    
    if (university) {
      const universityQuery = new URLSearchParams(university)
      searchParams.set('longitude', universityQuery.get('longitude'))
      searchParams.set('latitude', universityQuery.get('latitude'))
    }
    
    router.push(`${appURL}/accommodations${searchParams.size > 0 ? `?${searchParams.toString()}` : ''}`)
  }
  
  return (
    <SearchForm.Form
      onSubmit={handleSubmit}
      isSubmitting={isRedirecting}
    >
      <SearchForm.Select
        label={t('labels.search.country')}
        options={[{ value: '', label: t('labels.search.allCountries') }, ...(countries ?? [])]}
        value={country}
        onChange={setCountry}
        isLoadingOptions={isLoadingCountries}
      />
      <SearchForm.Select
        label={t('labels.search.city')}
        options={[{ value: '', label: t('labels.search.allCities') }, ...(cities ?? [])]}
        value={city}
        onChange={setCity}
        isLoadingOptions={isLoadingCities}
      />
      <SearchForm.Select
        label={t('labels.search.university')}
        options={[{ value: '', label: t('labels.search.allUniversities') }, ...(universities ?? [])]}
        value={university}
        onChange={setUniversity}
        isLoadingOptions={isLoadingUniversities}
      />
    </SearchForm.Form>
  )
}

export default SearchLocations
