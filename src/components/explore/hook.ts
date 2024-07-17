import { useCallback, useEffect, useState, KeyboardEvent } from 'react'
import { useDebounce, useDebounceFn, useResetState } from 'ahooks'
import randomcolor from 'randomcolor'
import { proxyExploreListSvc, proxyLabelPageListSvc, proxyTypeListSvc } from '@/services/oa'
import { getRandomLabelColor } from '@/lib/utils'

export type TypeWithSelect = TypeRecord & { isSelect: boolean }
export const useTypeList = () => {
  const [list, setList] = useState<Array<TypeWithSelect>>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const getList = async () => {
      try {
        setLoading(true)
        const { code, data } = await proxyTypeListSvc()
        if (code === 200 && data) {
          resetList(data)
          setLoading(false)
        }
      } catch (error) {
        setLoading(false)
      }
    }
    getList()
  }, [])

  const resetList = (data?: Array<TypeRecord | TypeWithSelect>) => {
    let tempList: Array<TypeRecord | TypeWithSelect> = list
    if (data) {
      tempList = data
    }
    const result = tempList.map(item => ({ ...item, isSelect: false }))
    setList(result)
  }

  return { list, setList, resetList, loading }
}

export type LabelWithOptions = LabelRecord & { isSelect: boolean; color: string }
export const useLabelList = () => {
  const [list, setList] = useState<Array<LabelWithOptions>>([])
  const [loading, setLoading] = useState(false)
  const [labelName, setLabelName, resetLabelName] = useResetState('')
  const debouncedValue = useDebounce(labelName, { wait: 500 })
  const getList = async () => {
    try {
      setLoading(true)
      const query = { pageNumber: 1, pageSize: 14 }
      if (labelName.trim()) {
        // @ts-ignore
        query.search = debouncedValue
      }
      const { code, data } = await proxyLabelPageListSvc(query)
      if (code === 200 && data && data?.records) {
        resetList(data?.records)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
    }
  }

  const handleInputChange = (value: string) => {
    setLabelName(value)
  }

  const { run: handleInputEnter } = useDebounceFn(
    (evt: KeyboardEvent<HTMLInputElement>) => {
      if (evt.key === 'Enter') {
        evt.preventDefault()
        getList()
      }
    },
    { wait: 500 }
  )

  useEffect(() => {
    getList()
  }, [debouncedValue])

  const resetList = (data?: Array<LabelRecord | LabelWithOptions>) => {
    let tempList: Array<LabelRecord | LabelWithOptions> = list
    if (data) {
      tempList = data
    }
    const result = tempList.map(item => ({
      ...item,
      isSelect: false,
      color: randomcolor({
        hue: getRandomLabelColor(),
        luminosity: 'bright',
      }),
    }))
    setList(result)
  }

  return { list, setList, resetList, loading, handleInputChange, handleInputEnter, labelName, resetLabelName }
}

export const useExplorePageList = () => {
  const [exploreList, setExploreList, resetExploreList] = useResetState<Array<ExploreRecord>>([])
  const [search, setSearch] = useState<ExploreSearch>({})
  const [loading, setLoading] = useState(false)
  const refreshList = useCallback(async () => {
    try {
      setLoading(true)
      const result = await proxyExploreListSvc(search)
      const { code, data } = result
      if (code === 200) {
        setExploreList(data)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
    }
  }, [search])

  const handleSetSearch: {
    (value: number): void
    (value: Array<string>): void
  } = (value: number | Array<string>) => {
    const query = { ...search }
    if (typeof value === 'number') {
      delete query.labels
      if (value) {
        query.type = value
      } else {
        delete query.type
      }
    }
    if (Array.isArray(value)) {
      delete query.type
      query.labels = value
    }

    setSearch(query)
  }

  useEffect(() => {
    refreshList()
  }, [search])

  return { search, exploreList, handleSetSearch, loading }
}
