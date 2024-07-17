import type { NextApiRequest, NextApiResponse } from 'next'
import authMiddleware from '@/middleware/authMiddleware'
import { convertToNumber } from '@/lib/utils'
import { bigintFactory } from '@/lib/prisma/common'
import prisma from '@/lib/prisma'

async function list(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req
  let chainType = typeof req?.query?.chainType === 'string' && req?.query?.chainType ? req.query.chainType : 'default'

  try {
    const pageNumber = convertToNumber(query?.pageNumber as string) || 1
    const pageSize = convertToNumber(query?.pageSize as string) || 50
    const startIndex = (pageNumber - 1) * pageSize // 起始索引
    const endIndex = pageNumber * pageSize // 结束索引

    const supportedFields = ['username', 'uuid', 'did', 'member', 'from', 'inviteCode', 'oauth_signup_type']
    let queryOption = {}

    supportedFields.forEach(field => {
      const value = (query?.[field] as string) || ''
      if (value.trim()) {
        queryOption[field] = {
          contains: value,
          mode: 'insensitive',
        }
      }
    })

    if (req?.query?.address) {
      Object.assign(queryOption, {
        chain: {
          is: {
            [chainType]: {
              is: {
                address: req?.query?.address,
              },
            },
          },
        },
      })
    }

    let records = await prisma.users.findMany({
      orderBy: [
        {
          id: 'asc',
        },
      ],
      where: {
        ...queryOption,
      },
    })

    records = bigintFactory(records)

    if (req?.query?.chainType && records) {
      records = records.filter(row => row?.chain?.[chainType]?.address)
    }

    let total = records?.length || 0,
      totalPage = Math.ceil(total / pageSize),
      result = {
        total,
        totalPage,
        records: records.slice(startIndex, endIndex),
      }

    res.status(200).json({
      ok: true,
      data: result,
    })
  } catch (error) {
    console.log('🐅', error)
    res.status(500).json({
      ok: false,
      message: 'request error',
    })
  }
}

export default authMiddleware(list)
