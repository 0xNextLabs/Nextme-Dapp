export * from './type'
import { FeedBackModalProps } from './feedback'
import { Confirm, ConfirmModalProps } from './confirm'
import { Token, TokenModalProps } from './token'
import { Text, TextModalProps } from './text'
import { Form, FormModalProps } from './form'
import { Container, ContainerModalProps } from './container'

export const options = (type: string) => {
  switch (type) {
    case 'confirm':
      return {
        modalClass: 'w-80 lg:w-96 p-4 bg-white rounded-lg',
        component: Confirm,
        leaveAnimate: 'scale-0 pointer-events-none opacity-0',
        enterAnimate: 'scale-100',
      }
    case 'container':
      return {
        modalClass: 'min-w-1/4 p-4 bg-white rounded-lg',
        component: Container,
        leaveAnimate: 'scale-0 pointer-events-none opacity-0',
        enterAnimate: 'scale-100',
      }
    case 'token':
      return {
        modalClass: 'w-80 lg:w-96 p-4 bg-white rounded-lg',
        component: Token,
        leaveAnimate: 'scale-0 pointer-events-none opacity-0',
        enterAnimate: 'scale-100',
      }
    case 'text':
      return {
        modalClass: 'min-w-1/2 p-4 bg-white rounded-lg',
        component: Text,
        leaveAnimate: 'scale-0 pointer-events-none opacity-0',
        enterAnimate: 'scale-100',
      }
    case 'form':
      return {
        modalClass: 'w-80 lg:w-96 p-4 bg-white rounded-lg',
        component: Form,
        leaveAnimate: 'scale-0 pointer-events-none opacity-0',
        enterAnimate: 'scale-100',
      }

    default:
      return {
        modalClass: 'w-80 lg:w-96',
        leaveAnimate: '-translate-y-1/2 opacity-0 pointer-events-none',
        enterAnimate: '-translate-y-1/3',
      }
  }
}

export type CallModalProps =
  | ConfirmModalProps
  | FeedBackModalProps
  | TokenModalProps
  | TextModalProps
  | FormModalProps
  | ContainerModalProps
