import { useAuth } from '@/components/AuthContext'
import * as listService from '@/lib/list.service'
import * as todoService from '@/lib/todo.service'
import useListStore from '@/stores/lists'
import { useState } from 'react'
import { TbDotsVertical } from 'react-icons/tb'
import { TfiTrash } from 'react-icons/tfi'
import OutsideClickHandler from 'react-outside-click-handler'

interface Props {
  listId: string
}

const ListOption = ({ listId }: Props) => {
  const listStore = useListStore()
  const { user } = useAuth()
  const [isOptionOpen, setIsOptionOpen] = useState(false)

  const handleDeleteList = async () => {
    const confirmWindow = confirm(
      'Eits bentar... Are you sure about this?\n\nDeleting this list will also delete all to-dos within it.',
    )
    if (confirmWindow) {
      listStore.deleteList(listId)
      const todosInList = listStore.lists.find(
        (list) => list.id === listId,
      )!.order

      Promise.all([
        listService.deleteList(user!.uid, listId),
        listService.deleteFromListOrder(user!.uid, listId),
        todoService.deleteMultipleTodos(user!.uid, todosInList),
      ])
    } else {
      return
    }
  }

  return (
    <div className="relative left-14 md:left-0">
      <button
        onClick={() => setIsOptionOpen(!isOptionOpen)}
        className="mt-20 flex justify-start py-1 rounded text-xl hover:bg-zinc-300 transition-all"
      >
        <TbDotsVertical />
      </button>
      {isOptionOpen && (
        <OutsideClickHandler onOutsideClick={() => setIsOptionOpen(false)}>
          <div className="absolute left-0 top-8 rounded-xl shadow bg-white overflow-hidden">
            <button
              onClick={handleDeleteList}
              className="flex items-center px-3 py-2 hover:bg-zinc-50"
            >
              <TfiTrash /> <span className="ml-2 md:text-sm">Delete</span>
            </button>
          </div>
        </OutsideClickHandler>
      )}
    </div>
  )
}

{
  /*  */
}

export default ListOption
