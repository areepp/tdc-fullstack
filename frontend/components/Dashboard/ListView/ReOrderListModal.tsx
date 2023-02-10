import { Dispatch, SetStateAction } from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { HiOutlineX } from 'react-icons/hi'
import { useQuery } from 'react-query'
import MyOutsideClickHandler from '@/components/Common/MyOutsideClickHandler'
import * as listCollectionService from '@/lib/listCollection.service'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { IList } from '@/types/IList'

interface Props {
  setIsReOrderModalVisible: Dispatch<SetStateAction<boolean>>
}

const ReOrderListModal = ({ setIsReOrderModalVisible }: Props) => {
  const axiosPrivate = useAxiosPrivate()
  const { isError, data } = useQuery('listCollection', () =>
    listCollectionService.getListCollection(axiosPrivate),
  )

  if (isError || !data) return <div>error</div>

  const orderedLists = data?.listOrder.map(
    (id) => data.lists.find((list) => list.id === id) as IList,
  )

  return (
    // MODAL BACKDROP
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-20">
      {/* MODAL */}
      <MyOutsideClickHandler
        onOutsideClick={() => setIsReOrderModalVisible(false)}
      >
        <div className="w-[300px] md:w-[650px] max-h-[600px] p-5 flex flex-col bg-white rounded-lg shadow-lg">
          {/* HEADER */}
          <div className="flex items-start justify-between">
            <h3 className="text-4xl font-gothic">RE-ORDER LIST</h3>
            <button
              type="button"
              className="text-black text-lg"
              onClick={() => setIsReOrderModalVisible(false)}
            >
              <HiOutlineX />
            </button>
          </div>

          {/* BODY */}
          <Droppable droppableId="list-order" type="list">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="my-8 pr-4 overflow-y-scroll"
              >
                {orderedLists.length > 0 &&
                  orderedLists.map((list, index) => (
                    <Draggable
                      key={list.id}
                      draggableId={list.id.toString()}
                      index={index}
                    >
                      {(draggableProvided) => (
                        <div
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.dragHandleProps}
                          {...draggableProvided.draggableProps}
                          key={list.id}
                          className="mt-2 w-full bg-zinc-100 p-2 rounded"
                        >
                          {list.title === '' ? '{untitled}' : list.title}
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* FOOTER */}
          <div className="flex items-center justify-center">
            <button
              type="button"
              className="border border-primary px-3 py-1 rounded hover:bg-primary hover:text-white transition-all"
              onClick={() => setIsReOrderModalVisible(false)}
            >
              Done
            </button>
          </div>
        </div>
      </MyOutsideClickHandler>
    </div>
  )
}

export default ReOrderListModal
