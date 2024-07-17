import { FC } from 'react'
import { Skeleton } from '@mui/material'
import { LabelItem } from '@/components/profile/bio/label/LabelItem'
import { LabelWithOptions } from './hook'

interface Props {
  handleSetSearch: {
    (value: number): void
    (value: string[]): void
  }
  labelList: Array<LabelWithOptions>
  loading: boolean
}
const DefaultLabels: FC<Props> = ({ handleSetSearch, labelList, loading }) => {
  const handleLabelItemClick = (index: number) => {
    labelList[index].isSelect = !labelList[index].isSelect
    const select = labelList.filter(item => item.isSelect).map(item => item.id)
    handleSetSearch(select)
  }

  return loading ? (
    <ul className="grid grid-cols-2 xl:grid-cols-7 gap-2">
      {new Array(14).fill(0).map((item, index) => (
        <li key={index} className="relative">
          <Skeleton variant="rounded" className="rounded-xl" width="100%" height={40} />
        </li>
      ))}
    </ul>
  ) : (
    <section className="flex flex-wrap gap-3">
      {labelList.map((item, index) => (
        <LabelItem
          key={item.id}
          iconSrc={item.icon}
          text={item.name}
          iconColor={item.color}
          isSelect={item.isSelect}
          className="h-11 xl:h-12 xl:px-6"
          iconClass="text-sm xl:text-xl"
          textClass="text-sm max-w-20 xl:max-w-50"
          onClick={() => handleLabelItemClick(index)}
        />
      ))}
    </section>
  )
}

export default DefaultLabels
