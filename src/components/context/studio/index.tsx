import { Dispatch, HTMLAttributes, SetStateAction, createContext, useContext, useState } from 'react'
export interface StudioProvider {
  previewMode?: number
  setPreviewMode?: Dispatch<SetStateAction<number>>
  shareCardShow?: number
  setShareCardShow?: Dispatch<SetStateAction<number>>
  bottomCardShow?: number
  setBottomCardShow?: Dispatch<SetStateAction<number>>
  expand?: boolean
  setExpand?: Dispatch<SetStateAction<boolean>>
}
export interface IStudioProviderProps extends HTMLAttributes<HTMLDivElement> {}

export const StudioContext = createContext<StudioProvider>({} as StudioProvider)
export const StudioContextProvider = (props: IStudioProviderProps) => {
  const [previewMode, setPreviewMode] = useState(0)
  const [shareCardShow, setShareCardShow] = useState(0)
  const [bottomCardShow, setBottomCardShow] = useState(0)
  const [expand, setExpand] = useState(false)

  return (
    <StudioContext.Provider
      value={{
        previewMode,
        setPreviewMode,
        shareCardShow,
        setShareCardShow,
        bottomCardShow,
        setBottomCardShow,
        expand,
        setExpand,
      }}
    >
      {props.children}
    </StudioContext.Provider>
  )
}
export const useStudioContext = () => useContext(StudioContext)
