import { useRef, useLayoutEffect, useState, useCallback, Fragment } from 'react'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import useSWR from 'swr'
import { UniversityService } from '@api/services'
import { SectionHeader } from '@components/shared'

const PartnersSection = () => {
  const { t } = useTranslation('common')
  const { data: universities } = useSWR(
    'all-universities',
    async () => {
      const response = await UniversityService.getUniversitiesIdsAndNames()
      return response.data
    }
  )
  
  return (
    <div className="flex flex-col items-center w-full gap-y-12">
      <SectionHeader
        
        title={
          <span className="text-5xl font-bold !text-transparent bg-gradient-to-b pb-12 from-primary-light to-primary bg-clip-text">
            Thank you for your trust
          </span>
        }
        
        description={t("labels.general.partnersSectionDescription")}
      />
      <div className="relative w-full md:px-20 xl:px-40 md:after:content-[''] md:after:w-full md:after:h-full after:absolute after:top-0 after:right-0 after:bg-gradient-to-r after:from-white after:from-5% after:via-transparent after:to-white after:to-95% after:z-20 after:pointer-events-none">
        {
          universities && (
            <InfiniteScrollLoop>
              <div className="flex w-full gap-5 md:gap-10 min-w-max">
                {
                  universities.map((university) => (
                    university.logo && <div
                      key={university.id}
                      className="relative w-32 h-32 group aspect-square"
                    >
                      <Image
                        src={university.logo.url}
                        alt={university.name}
                        fill
                        className="object-cover object-center transition-all duration-300 ease-in-out opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100"
                      />
                    </div>
                  ))
                }
              </div>
            </InfiniteScrollLoop>
          )
        }
      </div>
    </div>
  )
}


const InfiniteScrollLoop = ({ surroundingBackup = 2, children }) => {
  const contentRef = useRef(null)
  const scrollRef = useRef(null)
  const [width, setWidth] = useState(0)
  
  const backupWidth = width * surroundingBackup
  
  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const scroll = scrollRef.current.scrollLeft
      
      if (scroll < backupWidth || scroll >= backupWidth + width) {
        scrollRef.current.scrollLeft = backupWidth + (scroll % width)
      }
    }
  }, [width]);
  
  useLayoutEffect(() => {
    if (contentRef.current) {
      setWidth(contentRef.current.offsetWidth)
      scrollRef.current.scrollLeft = backupWidth
    }
  });
  
  return (
    <div
      className="flex overflow-y-scroll no-scrollbar !h-max !w-full"
      ref={scrollRef}
      style={{ width }}
      onScroll={handleScroll}
    >
      {
        Array(surroundingBackup)
          .fill()
          .map((_, index) => (
            <Fragment key={index}>{children}</Fragment>
          ))
      }
      <div
        ref={contentRef}
        className="mx-5 md:mx-10"
      >
        {children}
      </div>
      {
        Array(surroundingBackup)
          .fill()
          .map((_, index) => (
            <Fragment key={index}>{children}</Fragment>
          ))
      }
    </div>
  );
}

export default PartnersSection
