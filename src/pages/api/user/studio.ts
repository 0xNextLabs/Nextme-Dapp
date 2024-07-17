import type { NextApiRequest, NextApiResponse } from 'next'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import prisma from '@/lib/prisma'
import OAService from '@/services/oa_service'
import { compareArrays } from '@/lib/server-utils'
import authMiddleware from '@/middleware/authMiddleware'

dayjs.extend(utc)

async function studio(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req
  switch (method.toLowerCase()) {
    case 'post':
      let { uuid, ...studioData } = req.body
      if (!uuid) return
      try {
        const preStudio = await prisma.studio.findUnique({
          where: {
            uuid,
          },
        })
        const updateStudio = await prisma.studio.upsert({
          where: {
            uuid,
          },
          update: {
            ...studioData,
            updated: dayjs.utc().unix(),
          },
          create: {
            uuid,
            ...studioData,
            updated: dayjs.utc().unix(),
          },
        })
        if (preStudio) {
          const preLabels = preStudio.profile?.labels ? preStudio.profile?.labels : []
          const nextLabels = updateStudio.profile?.labels ? updateStudio.profile?.labels : []
          const { added, removed } = compareArrays(
            preLabels.map(item => item.id),
            nextLabels.map(item => item.id)
          )
          if (added.length || removed.length) {
            OAService.apiLabelUserChange({ labels: nextLabels, userId: updateStudio.uuid })
            OAService.apiUpdateLabelCount({ preLabels, nextLabels })
          }
        } else {
          if (updateStudio.profile?.labels) {
            const nextLabels = updateStudio.profile?.labels
            OAService.apiLabelUserChange({ labels: nextLabels, userId: updateStudio.uuid })
            OAService.apiUpdateLabelCount({ preLabels: [], nextLabels })
          }
        }
        res.status(200).json({ ok: true, message: 'studio update success ᵔ◡ᵔ' })
      } catch (error) {
        res.status(200).json({ ok: false, message: 'studio update error ˙◠˙' })
      }

      break
    case 'get':
    default:
      if (!query?.uuid) return
      let response = await prisma.studio.findUnique({ where: { id: query?.uuid as string } })
      const { id, ...others } = response || {}
      if (id) {
        res.status(200).json({ ...others })
      } else {
        res.status(502).json({ ok: false, message: 'studio data not found ༼☯﹏☯༽' })
      }
      break
  }
}

export default authMiddleware(studio)
