import type { NextApiRequest, NextApiResponse } from 'next'
import authMiddleware from '@/middleware/authMiddleware'
import { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'
import { convertToNumber } from '@/lib/utils'

async function list(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req
  let chainType = typeof req?.query?.chainType === 'string' && req?.query?.chainType ? req.query.chainType : 'default'

  try {
    const safePageNumber = convertToNumber(query?.pageNumber as string) || 1
    const safePageSize = convertToNumber(query?.pageSize as string) || 50
    const skipCount = (safePageNumber - 1) * safePageSize

    const supportedFields = ['username', 'uuid', 'did', 'member', 'address', 'from', 'inviteCode', 'oauth_signup_type']
    const queryOption: Prisma.usersWhereInput = {}

    supportedFields.forEach(field => {
      const value = (query?.[field] as string) || ''
      if (value.trim()) {
        if (field === 'address') {
          let params = {
            chain: {
              is: {
                [chainType]: {
                  is: {
                    address: value,
                  },
                },
              },
            },
          }
          Object.assign(queryOption, params)
        } else {
          queryOption[field] = {
            contains: value,
            mode: 'insensitive',
          }
        }
      }
    })

    const total = await prisma.users.count({
      where: {
        ...queryOption,
      },
    })

    const records = await prisma.users.findMany({
      orderBy: [
        {
          id: 'asc',
        },
      ],
      where: {
        ...queryOption,
      },
      skip: skipCount,
      take: safePageSize,
    })
    const totalPage = Math.ceil(total / safePageSize)
    const result = {
      total,
      records,
      totalPage,
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
      code: 500,
    })
  }
}

export default authMiddleware(list)
