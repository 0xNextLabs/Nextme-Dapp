import prisma from '@/lib/prisma'
import dayjs from 'dayjs'

enum TypeEnum {
  PUBLISH = 0,
  INVITED,
  INVITE_OTHER,
  CLAIM_SBT,
  DISCORD_CHECK,
  TWITTER_CHECK,
}

type PointAddProps = { type: number; uuid: string; opt: string; extra?: Record<string, any> }

export const addPoint = async (props: PointAddProps | PointAddProps[]) => {
  const created_at = dayjs.utc().format()
  const inputs = Array.isArray(props) ? props : [props]
  return await prisma.point.createMany({
    data: inputs.map(prop => ({
      type: prop.type,
      user_id: prop.uuid,
      opt_id: prop.opt,
      ...(prop.extra ? { extra: prop.extra } : {}),
      created_at,
    })),
  })
}

export const getPoint = async (props: { user_id: string }) => {
  const { user_id } = props
  const result = await prisma.point.findMany({
    where: {
      user_id,
    },
    select: {
      user_id: false,
    },
  })
  return result
}

export const getRule = async () => {
  const results = await prisma.point_rule.findMany()
  return JSON.parse(JSON.stringify(results, (key, value) => (typeof value === 'bigint' ? Number(value) : value))) as any
}

export const addRule = async (props: { type: number; score: number; desc: string }) => {
  const { type, score, ...rest } = props
  const result = await prisma.point_rule.findFirst({
    where: {
      type,
    },
  })
  if (result) {
    throw Error('Type exists')
  } else {
    await prisma.point_rule.create({
      data: {
        type: Number(type),
        score: Number(score),
        ...rest,
      },
    })
  }
}

export const updateRule = async (props: { id: string; type: number; score: number; desc: string }) => {
  const { id, score, ...rest } = props
  await prisma.point_rule.update({
    where: {
      id,
    },
    data: {
      score: Number(score),
      ...rest,
    },
  })
}

export const deleteRule = async (props: { type: number }) => {
  const { type } = props
  await prisma.point_rule.deleteMany({
    where: {
      type,
    },
  })
}

export const checkPoint = async (props: Omit<PointAddProps, 'opt'>) => {
  const { type, uuid, ...rest } = props
  const exist = await prisma.point.findFirst({
    where: {
      type: {
        equals: type,
      },
      user_id: uuid,
    },
  })
  if (!exist) {
    const created_at = dayjs.utc().format()
    await prisma.point.create({
      data: {
        type: Number(type),
        user_id: uuid,
        opt_id: uuid,
        created_at,
        ...rest,
      },
    })
  }
}
