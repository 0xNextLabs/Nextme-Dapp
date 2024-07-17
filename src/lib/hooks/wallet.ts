import { useEffect, useState } from 'react'
import { useCacheStore } from '@/lib/api/cache'
import { calcOncePoints, ListProps } from '@/lib/utils'

export const usePointsCoin = () => {
  const cache = useCacheStore()
  const [pointsCoin, setPointsCoin] = useState(0)
  const [pointsLoading, setPointsLoading] = useState(false)
  const [pointsData, setPointsData] = useState({
    list: [],
    rules: [],
  })
  useEffect(() => {
    ;(async () => {
      try {
        setPointsLoading(true)
        const results = await Promise.all([
          cache.post<{ data: { list: ListProps } }>({
            url: '/api/point/list',
          }),
          cache.post<{ data: { type: number; score: number; desc: string }[] }>({
            url: '/api/point/rules',
          }),
        ])
        if (results) {
          const [listResult, ruleResult] = results
          let list = listResult?.data?.list || [],
            rules = ruleResult.data || []
          setPointsData({
            list,
            rules,
          })
          setPointsCoin(calcOncePoints(list, rules)?.score)
        }
        setPointsLoading(false)
      } catch (e) {
      } finally {
        setPointsLoading(false)
      }
    })()
  }, [cache])
  return { pointsData, pointsCoin, pointsLoading }
}
