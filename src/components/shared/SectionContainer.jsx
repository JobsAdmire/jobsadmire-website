import { cn } from '@utils/cn'

const SectionContainer = ({ className = '', children }) => {
  return (
    <section className={cn('snap-start w-screen max-md:px-5', className)}>
      {children}
    </section>
  )
}

export default SectionContainer
