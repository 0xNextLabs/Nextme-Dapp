import type { NextApiResponse } from 'next'

/**
 * 通用 success / err 模板
 */
export const err = (res: NextApiResponse, message = {}) => {
  return res.status(400).json({ ...message, ok: false })
}

export const ok: <T extends Record<string, unknown>>(res: NextApiResponse, data?: T) => void = (res, data) => {
  return res.status(200).json({ ...data, ok: true } || {})
}
