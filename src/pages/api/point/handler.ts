import { NextApiRequest, NextApiResponse } from 'next'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import prisma from '@/lib/prisma'
import { convertToNumber } from '@/lib/utils'

dayjs.extend(utc)

export const handlerBatchCreate = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req
  try {
    if (!Array.isArray(body)) {
      res.status(200).json({ ok: false, message: 'params error' })
    }
    const created_at = dayjs.utc().format()
    const result = await prisma.point.createMany({
      data: body.map(item => ({ ...item, created_at })),
    })
    res.status(200).json({ ok: true, data: result })
  } catch (error) {
    res.status(200).json({ ok: false, message: 'params error' })
  }
}

export const getListByType = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { query } = req
    const type = Number(query?.type as string)
    if (isNaN(type) || type === null || type === undefined) {
      res.status(200).json({ ok: false, message: 'type is required!', code: 400 })
    }
    const safePageNumber = convertToNumber(query?.pageNumber as string) || 1
    const safePageSize = convertToNumber(query?.pageSize as string) || 50
    const skipCount = (safePageNumber - 1) * safePageSize

    const result = {
      total: 0,
      records: [],
      totalPage: 0,
    }

    const queryOption = {
      type,
    }
    const total = await prisma.point.count({
      where: {
        ...queryOption,
      },
    })

    if (!total) {
      res.status(200).json({ ok: true, message: 'success', data: result })
    }

    const pointList = await prisma.point.findMany({
      where: {
        ...queryOption,
      },
      orderBy: [
        {
          created_at: 'asc', // 第二个排序条件：按照其他字段升序排序
        },
      ],
      skip: skipCount,
      take: safePageSize,
    })

    const userIds = pointList.map(item => item.user_id)

    let userList = await prisma.users.findMany({
      where: {
        uuid: {
          in: userIds,
        },
      },
    })

    let userMaps = {}

    userList.forEach(item => {
      userMaps[item.uuid] = item.username
    })

    const resultList = pointList.map(item => ({ ...item, username: userMaps[item.user_id] }))
    result.total = total
    result.totalPage = Math.ceil(total / safePageSize)
    result.records = resultList
    res.status(200).json({ ok: true, data: result })
  } catch (error) {
    res.status(200).json({ ok: false, message: 'error' })
  }
}
