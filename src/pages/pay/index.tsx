import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import classNames from 'classnames'
import StudioLayout from '@/components/layout/studio'
import Payments from '@/components/pay/payments'
import Credit from '@/components/pay/credit'

const tabsList = [
  {
    name: 'Payments',
  },
  {
    name: 'Credit',
  },
]

export default function Pay() {
  const router = useRouter()

  const currentTabIndex = useMemo(() => tabsList.findIndex(row => row.name == router.query?.tab), [router.query?.tab])
  const [tabIndex, setTabIndex] = useState(0)

  useEffect(() => {
    setTabIndex(currentTabIndex < 0 ? 0 : currentTabIndex)
  }, [currentTabIndex])

  const handleTabChange = index => {
    const { name } = tabsList[index]
    if (router.query?.tab !== name) {
      setTabIndex(index)
      if (router.query?.tab) {
        router.replace(router.asPath.replace(String(router.query?.tab), name), undefined, { shallow: true })
      } else {
        router.push(`${router.asPath.split('?')[0]}?tab=${name}`)
      }
    }
  }

  const handletabsContent = () => {
    switch (tabIndex) {
      case 0:
        return <Payments />
      case 1:
        return <Credit />
      default:
        break
    }
  }

  return (
    <StudioLayout>
      <main className="p-4 sm:p-8 pt-10 max-sm:pb-16">
        <header className="font-semibold text-3.5xl text-neutral-800">Pay</header>
        <ul className="tabs tabs-lg tabs-boxed inline-flex mt-8">
          {tabsList.map((row, index) => (
            <li
              key={`tab-item-${row?.name}`}
              className={classNames('tab w-40 h-11 bg-neutral-200/90 transition', {
                'tab-active bg-create-gradient-001': tabIndex == index,
                'tab-disabled tooltip tooltip-bottom pt-1': row['disabled'],
              })}
              data-tip={row['disabled'] && 'Upcoming'}
              onClick={() => handleTabChange(index)}
            >
              {row?.name}
            </li>
          ))}
        </ul>
        <ul className="pt-8">{handletabsContent()}</ul>
      </main>
    </StudioLayout>
  )
}
