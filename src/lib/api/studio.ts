import { studio } from '@prisma/client'
import prisma from '@/lib/prisma'

export async function getUserStudioByUuid(uuid: string) {
  const response = (await prisma.studio.findFirst({
    where: {
      uuid,
    },
  })) as studio & { _id: string }
  const { _id, id, ...others } = response || {}
  return _id || id ? others : null
}
