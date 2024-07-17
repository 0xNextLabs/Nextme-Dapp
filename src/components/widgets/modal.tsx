import React, { FC, ReactNode, useEffect, useState, useRef, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import classNames from 'classnames'
import { Backdrop, Box, createTheme, ThemeProvider, StyledEngineProvider, ThemeOptions } from '@mui/material'
import { CallModalProps, CreateCoverProps, CreateDropDownProps, DropDownProps, options } from './modal/index'
import { TempContextProvider } from '@/components/context/temp'
import { CacheRequestProvider } from '@/lib/api/cache'
import { store } from '@/lib/store'
import { useMobile } from '@/lib/hooks'
import { theme } from '@/config/common/theme'

export const useTailWindFade = (option?: { open: boolean }) => {
  const [open, setOpen] = useState(option?.open || false)
  const [isEnter, setEnter] = useState(false)

  useEffect(() => {
    if (open) {
      setOpen(true)
      setTimeout(() => {
        setEnter(true)
      }, 16)
    } else {
      setEnter(false)
      setTimeout(() => {
        setOpen(false)
      }, 300)
    }
  }, [open])

  return {
    className: (common: string, leave: string, enter: string) => {
      return ['duration-300 transition-all z-[999]', common, isEnter ? enter : leave]
    },
    style: (common: React.CSSProperties, leave: React.CSSProperties = {}, enter: React.CSSProperties = {}) => {
      return Object.assign(common, isEnter ? enter : leave)
    },
    open,
    setOpen,
  }
}

export const createEscape = (props: { render: (args: { onClose: () => void }) => ReactNode }): void => {
  const { render } = props
  const escapeNode = document.createElement('div')
  const body = document.getElementById('__next')
  body.appendChild(escapeNode)
  let root: any
  const onClose = () => {
    root.unmount()
    if (body.contains(escapeNode)) {
      body.removeChild(escapeNode)
    }
  }
  const Child = render({ onClose })
  root = createRoot(escapeNode)
  root.render(
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={createTheme(theme as ThemeOptions)}>
        <Provider store={store}>
          <TempContextProvider>
            <CacheRequestProvider>{Child}</CacheRequestProvider>
          </TempContextProvider>
        </Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

export const CreateCover: FC<CreateCoverProps> = ({
  type,
  isCoverClose = true,
  render: Render,
  onClose,
  modalClass,
  leaveAnimate,
  enterAnimate,
  disableMobile = false,
  ...rest
}) => {
  const isMobile = useMobile()
  const { className, setOpen } = useTailWindFade({ open: true })

  const mobileEnv = useMemo(() => isMobile && !disableMobile, [isMobile, disableMobile])

  return (
    <>
      <Backdrop
        open
        className="backdrop-blur-sm z-[999]"
        onClick={() => {
          if (isCoverClose) {
            setOpen(false)
            setTimeout(() => {
              onClose?.()
            }, 300)
          }
        }}
      />
      <Box
        className={classNames(
          mobileEnv ? 'w-full h-1/2 bg-white' : modalClass,
          ...className(
            mobileEnv
              ? 'fixed z-9999 bottom-0 origin-bottom ease-scale-cub'
              : 'fixed z-9999 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ease-scale-cub',
            leaveAnimate,
            enterAnimate
          )
        )}
      >
        {Render && (
          <Render
            {...rest}
            onClose={() => {
              setOpen(false)
              setTimeout(() => {
                onClose?.()
              }, 300)
            }}
            isMobile={mobileEnv}
          />
        )}
      </Box>
    </>
  )
}

export const CreateDropDown: FC<CreateDropDownProps> = ({
  dom,
  align = 'left',
  content: Content,
  onClose,
  modalClass,
  leaveAnimate,
  enterAnimate,
  overlayClickDisable = false,
  disableMobile = false,
  arrow = false,
}) => {
  const isMobile = useMobile()
  const containerRef = useRef<HTMLDivElement>(null)
  const [rect, setRect] = useState<DOMRect>(undefined)
  const { className, style, setOpen } = useTailWindFade({ open: true })
  const [calc, setCalc] = useState<{ left: number; top: number }>(undefined)

  useEffect(() => {
    if (dom) {
      const _rect = dom.getBoundingClientRect()
      setRect(_rect)
    }
  }, [dom])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !overlayClickDisable) {
        const { x, y } = e
        const _rect = containerRef.current.getBoundingClientRect()
        if (x < _rect.left || x > _rect.right || y > _rect.bottom || y < _rect.top) {
          setOpen(false)
          setTimeout(() => {
            onClose?.()
          }, 300)
          e.stopPropagation()
          e.preventDefault()
        }
      }
    }
    document.body.addEventListener('mousedown', handleClick)
    return () => {
      document.body.removeEventListener('mousedown', handleClick)
    }
  }, [onClose, containerRef, overlayClickDisable])

  useEffect(() => {
    const dom = containerRef.current
    setTimeout(() => {
      if (dom) {
        const { width, height } = dom.getBoundingClientRect()
        const viewWidth = document.body.offsetWidth - 20
        // default: width > rect.width
        const moveValue = (width - rect.width) / 2
        let top = 0
        if (align === 'top') {
          top = rect.top - height - 20
        } else {
          top = rect.top + rect.height + 10
        }

        if (moveValue + rect.right > viewWidth) {
          setCalc({
            left: viewWidth - width,
            top,
          })
        } else {
          setCalc({
            // TODO: 左对齐时存在border宽度问题
            left: align === 'left' ? rect.left : rect.left - moveValue,
            top,
          })
        }
      }
    }, 0)
  }, [containerRef.current])

  const triangle = useMemo(() => {
    if (!arrow) return null
    if (align === 'top') {
      return {
        className: 'absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[100%]',
        dom: (
          <div className="w-8 overflow-hidden inline-block">
            <div className=" h-5 w-5 bg-white -rotate-45 transform origin-top-left"></div>
          </div>
        ),
      }
    } else {
      return {
        dom: (
          <div className="w-16 overflow-hidden inline-block">
            <div className=" h-11 w-11 bg-white rotate-45 transform origin-bottom-left"></div>
          </div>
        ),
      }
    }
  }, [align, arrow])

  const mobileEnv = useMemo(() => isMobile && !disableMobile, [isMobile, disableMobile])

  if (!rect) {
    return null
  }

  return (
    <>
      <Backdrop
        open
        className="hidden backdrop-blur-sm z-[999] max-sm:block"
        onClick={() => {
          setOpen(false)
          setTimeout(() => {
            onClose?.()
          }, 300)
        }}
      />
      <div
        style={style({
          zIndex: 9999,
          visibility: Boolean(calc) || mobileEnv ? 'visible' : 'hidden',
          position: 'fixed',
          ...(mobileEnv
            ? { width: '100%', left: '0px', ...(align === 'top' ? { top: '0px' } : { bottom: '0px' }) }
            : {
                left: `${calc?.left ? calc.left : 0}px`,
                top: `${calc?.top ? calc.top : 0}px`,
              }),
        })}
        ref={ele => {
          containerRef.current = ele
        }}
      >
        <div
          className={classNames(
            modalClass,
            ...className(
              `relative ${
                align === 'top' ? 'max-sm:origin-top origin-bottom' : 'max-sm:origin-bottom origin-top'
              }  ease-scale-cub`,
              leaveAnimate,
              enterAnimate
            )
          )}
        >
          {!mobileEnv && triangle ? <div className={triangle?.className || ''}>{triangle.dom}</div> : null}
          <Content
            onClose={() => {
              setOpen(false)
              setTimeout(() => {
                onClose?.()
              }, 300)
            }}
            isMobile={isMobile}
          />
        </div>
      </div>
    </>
  )
}

export const callModal = (props: CallModalProps) => {
  const { type, onClose } = props
  const { component, modalClass, leaveAnimate, enterAnimate } = options(type)

  createEscape({
    render: ({ onClose: onDestroy }) => {
      return (
        <CreateCover
          {...props}
          onClose={() => {
            onClose?.()
            onDestroy()
          }}
          render={component}
          modalClass={modalClass}
          leaveAnimate={leaveAnimate}
          enterAnimate={enterAnimate}
        />
      )
    },
  })
}

export function callDropDown(props: DropDownProps) {
  createEscape({
    render: ({ onClose: onDestroy }) => {
      return (
        <CreateDropDown
          {...props}
          leaveAnimate="scale-y-0 pointer-events-none opacity-0"
          enterAnimate="scale-y-100"
          onClose={onDestroy}
        />
      )
    },
  })
}
