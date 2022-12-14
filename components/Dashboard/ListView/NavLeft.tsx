import { IoHome } from 'react-icons/io5'
import SwiperCore from 'swiper'
import Arrow from '../Common/Arrow'

interface Props {
  swiperRef: SwiperCore | undefined
}

const NavLeft = ({ swiperRef }: Props) => {
  return (
    <nav className="z-30 md:w-16 absolute md:static top-14 left-2 flex flex-col items-center pt-2 md:border-r border-stone-200">
      <Arrow
        left
        onClick={(e: any) => e.stopPropagation() || swiperRef?.slidePrev()}
      />
      <button
        onClick={() => swiperRef?.slideTo(0)}
        className="mt-2 text-xl text-gray-400 hover:text-primary transition-all duration-300"
      >
        <IoHome />
      </button>
    </nav>
  )
}

export default NavLeft
