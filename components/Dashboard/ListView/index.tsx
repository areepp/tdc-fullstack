import { useAuth } from '@/components/AuthContext'
import useListStore, { IList } from '@/stores/lists'
import { useEffect, useState } from 'react'
import { IoIosAdd, IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io'
import ListColumn from './ListColumn'
import * as listService from '@/lib/list.service'
import useTodoStore, { ITodo } from '@/stores/todos'
import SwiperCore from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import NavLeft from './NavLeft'
import NavRight from './NavRight'
import ReOrderListModal from './ReOrderListModal'
import SlideProgress from './SlideProgress'

const ListView = () => {
  const [isListVisible, setIsListVisible] = useState(true)
  const [isReOrderModalVisible, setIsReOrderModalVisible] = useState(false)
  const listStore = useListStore()
  const todoStore = useTodoStore()
  const { user } = useAuth()
  const [swiperRef, setSwiperRef] = useState<SwiperCore>()
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)

  useEffect(() => {
    async function syncColumnToFirebase() {
      const [listResponse, listOrderResponse] = await Promise.all([
        listService.getLists(user!.uid),
        listService.getListOrder(user!.uid),
      ])
      const listMapped = listResponse.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))

      listStore.setLists(listMapped as IList[])
      listStore.setListOrder(listOrderResponse!.data()!.order)
    }
    syncColumnToFirebase()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAddList = async () => {
    const res = await listService.addList(user!.uid)
    await listService.addToListOrder(user!.uid, res.id)
    listStore.addList(res.id)
  }

  return (
    <div className="bg-zinc-50 py-2">
      <div className="px-5 flex items-center justify-between">
        <button
          className={`text-3xl ${
            isListVisible ? 'text-primary' : 'text-gray-400'
          }`}
          onClick={() => setIsListVisible(!isListVisible)}
        >
          {isListVisible ? <IoMdArrowDropdown /> : <IoMdArrowDropup />}
        </button>
        <div className="flex items-center">
          <SlideProgress activeSlideIndex={activeSlideIndex} />
          <button
            className="ml-4 px-3 py-1 text-xs rounded bg-zinc-200 hover:bg-zinc-300 transition-all"
            onClick={() => setIsReOrderModalVisible(true)}
          >
            Re-order
          </button>
        </div>

        {isReOrderModalVisible && (
          <ReOrderListModal
            setIsReOrderModalVisible={setIsReOrderModalVisible}
          />
        )}

        <button onClick={handleAddList} className="text-3xl text-gray-400">
          <IoIosAdd />
        </button>
      </div>
      {isListVisible && (
        <div className="relative flex min-h-[500px]">
          <NavLeft activeSlideIndex={activeSlideIndex} swiperRef={swiperRef} />

          <div className="flex w-full md:w-main">
            <Swiper
              className="w-full"
              onSwiper={setSwiperRef}
              initialSlide={0}
              slidesPerView={1}
              allowTouchMove={false}
              speed={600}
              breakpoints={{
                768: {
                  slidesPerView: 3,
                },
              }}
              onActiveIndexChange={(e) => setActiveSlideIndex(e.activeIndex)}
              onSlidesLengthChange={(e) => {
                if (e.slides.length <= 4) return
                swiperRef?.slideTo(e.slides.length - 3) // swipe when new list is created
              }}
            >
              {listStore.listOrder.map((id) => {
                let listTodos
                const list = listStore.lists.filter((list) => list.id === id)[0]
                if (list.order.length === 0) {
                  listTodos = null
                } else {
                  listTodos = list.order.map(
                    (id) =>
                      todoStore.todos.find((todo) => todo.id === id) as ITodo,
                  )
                }

                return (
                  <SwiperSlide className="w-full" key={list.id}>
                    <ListColumn list={list} todos={listTodos} key={list.id} />
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </div>

          <NavRight activeSlideIndex={activeSlideIndex} swiperRef={swiperRef} />
        </div>
      )}
    </div>
  )
}

export default ListView
