interface ExploreRecord extends BaseRecordItem {
  avatar: string
  enable: boolean
  name?: string
  order: number
  path: string
  type: number
  userId: string
}
interface ExploreSearch {
  type?: number
  labels?: Array<string>
}

interface TypeRecord extends BaseRecordItem {
  group: number
  icon: string
  name: string
  value: number
}

interface LabelRecord extends BaseRecordItem {
  count: number
  icon: string
  name: string
  weight: number
}

interface LabelUpdateCount {
  preLabels: Array<CounterItem>
  nextLabels: Array<CounterItem>
}

interface LabelUserChange {
  labels: Array<CounterItem>
  userId: string
}

interface CounterItem {
  count?: number
  id: string
  name?: string
}
interface BaseResult<T = any> {
  ok: boolean
  message: string
  data?: T
  code: number
}

interface PageResult<T = any> {
  total: number
  records: Array<T>
  totalPage: number
}

interface BaseRecordItem {
  id: string
  createdAt: string
  updatedAt: string
  isDelete: boolean
}
