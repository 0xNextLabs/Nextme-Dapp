import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { Avatar, Button } from '@mui/material'
import { FormInput, FormTextArea } from '@/components/profile/blocks/components/form-item'
import { useForm } from '@/components/profile/blocks/hooks'
import { callModal } from '@/components/widgets/modal'
import { getHexToRgba } from '@/lib/utils'
import { BaseModalProps, PropsModal } from './type'

export interface FeedBackModalProps extends BaseModalProps {
  type: 'feedback'
}

export const FeedBack: FC<PropsModal<FeedBackModalProps>> = ({ onClose }) => {
  const { onChange, validate, errors, resetError } = useForm<
    {
      contact?: string
      description?: string
    },
    {}
  >({
    value: [],
    validate: async ({ current }) => {
      const value = current.value
      if (!value.contact) {
        current.errorFields['contact'] = 'Contact is empty'
      } else {
        delete current.errorFields['contact']
      }

      if (!value.description) {
        current.errorFields['description'] = 'Description is empty'
      } else {
        delete current.errorFields['description']
      }
      return current
    },
  })

  return (
    <div className="h-full flex flex-col">
      <div className="flex h-12 font-extrabold text-xl justify-center items-center p-2 pb-0">FeedBack</div>
      <div className="flex flex-1 flex-col gap-6 p-8 pb-0">
        <FormInput
          placeholder="Contact"
          errorTip={errors('contact')}
          onFocus={() => {
            resetError('contact')
          }}
          onChange={e =>
            onChange(({ item }) => {
              item.value['contact'] = e.target.value
            })
          }
        />
        <FormTextArea
          placeholder="Description"
          outClassName="flex-1"
          errorTip={errors('description')}
          onFocus={() => {
            resetError('description')
          }}
          onChange={e =>
            onChange(({ item }) => {
              item.value['description'] = e.target.value
            })
          }
        />
      </div>
      <div className="flex justify-center items-center p-8">
        <Button
          variant="contained"
          size="large"
          className="w-full h-12"
          onClick={async () => {
            if (await validate()) {
              onClose?.()
            } else {
            }
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  )
}

let isDragFeedBack = false
let isMove = false
let start = null

export const FeedBackEntryBtn = () => {
  const [distance, setDistance] = useState(100)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      const dom = ref.current
      const handlePointerDown = (e: PointerEvent) => {
        let event = e as unknown as React.PointerEvent<HTMLDivElement>
        isDragFeedBack = true
        start = {
          x: event.pageX,
          y: event.pageY,
        }
      }
      const handlePointerUp = (e: PointerEvent) => {
        let event = e as unknown as React.PointerEvent<HTMLDivElement>
        if (isDragFeedBack && isMove) {
          setDistance(-event.pageY + start.y + distance)
          start = null
          setX(0)
          setY(0)
          isDragFeedBack = false
        }
        isDragFeedBack = false
      }
      const handlePointerMove = (e: PointerEvent) => {
        let event = e as unknown as React.PointerEvent<HTMLDivElement>
        if (isDragFeedBack && start) {
          isMove = true
          setX(event.pageX - start.x)
          setY(event.pageY - start.y)
        }
      }
      dom.addEventListener('pointerdown', handlePointerDown)
      document.body.addEventListener('pointerup', handlePointerUp)
      document.body.addEventListener('pointermove', handlePointerMove)
      return () => {
        dom.removeEventListener('pointerdown', handlePointerDown)
        document.body.removeEventListener('pointerup', handlePointerUp)
        document.body.removeEventListener('pointermove', handlePointerMove)
      }
    }
  }, [ref.current, distance])

  const transform = useMemo(() => {
    return `translate(${x}px, ${y}px)`
  }, [x, y])

  return (
    <div
      className="fixed right-0 rounded-full cursor-pointer h-12 flex justify-end items-center"
      style={{ bottom: distance + 'px', transform }}
      onClick={async () => {
        if (!isMove) {
          callModal({
            type: 'feedback',
          })
        }
        isMove = false
      }}
      ref={ref}
    >
      <Avatar style={{ backgroundColor: getHexToRgba('#1d4ed8', 0.2) }} className="p-2 box-border hover:opacity-70">
        <svg
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="5262"
          width="48"
          height="48"
        >
          <path
            d="M800.038 960.01H223.962c-52.98 0-95.984-43.003-95.984-95.983V224.134c0-52.98 43.004-95.983 95.984-95.983h447.925c17.718 0 31.995 14.277 31.995 31.994s-14.277 31.995-31.995 31.995H223.962c-17.545 0-31.994 14.449-31.994 31.994v639.893c0 17.717 14.449 31.995 31.994 31.995h575.904c17.717 0 31.994-14.278 31.994-31.995V351.94c0-17.718 14.277-31.995 31.995-31.995 17.717 0 31.994 14.277 31.994 31.995v511.914c0.173 52.98-43.003 96.156-95.811 96.156zM612.026 447.926c-8.256 0-16.341-3.097-22.706-9.461a31.873 31.873 0 0 1 0-45.24L907.374 75.342c12.557-12.557 32.683-12.557 45.24 0s12.557 32.683 0 45.24L634.56 438.636c-6.192 6.192-14.45 9.289-22.534 9.289z m-132.107 0H287.952c-17.718 0-31.995-14.277-31.995-31.995s14.277-31.995 31.995-31.995h191.967c17.718 0 31.995 14.278 31.995 31.995 0 17.718-14.277 31.995-31.995 31.995z m192.14 191.967H287.952c-17.718 0-31.995-14.277-31.995-31.994s14.277-31.995 31.995-31.995h383.935c17.718 0 31.995 14.277 31.995 31.995s-14.277 31.994-31.823 31.994z"
            p-id="5263"
            fill="#1d4ed8"
          ></path>
        </svg>
      </Avatar>
    </div>
  )
}
