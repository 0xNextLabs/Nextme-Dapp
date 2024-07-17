import { getOneUserByUuid } from '@/lib/api/user'
import mongodbDIDPromise from '@/lib/mongodb/mongodb_did'
import { err } from '@/lib/server-utils'
import { ok } from '@/lib/server-utils'
import crypto from 'crypto'
import { NextApiRequest, NextApiResponse } from 'next'
import authMiddleware from '@/middleware/authMiddleware'
import { getPayloadByToken } from '@/lib/server-utils/jwt'

export const genKeyPairRSA = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
  })

  return { pubKey: publicKey, privKey: privateKey }
}

async function create(req: NextApiRequest, res: NextApiResponse) {
  const token = await getPayloadByToken(req)
  if (token && token.id) {
    const user = await getOneUserByUuid(token.id)
    if (user.did) {
      try {
        const { pubKey, privKey } = genKeyPairRSA()
        const client = await mongodbDIDPromise
        const db = await client.db().collection('did')
        await db.updateOne(
          { did: user.did },
          {
            $set: {
              pubKey,
            },
          }
        )
        const privateKey = privKey.export({ type: 'pkcs1', format: 'pem' })

        return ok(res, { privateKey })
      } catch (e) {
        return err(res, { message: 'did update error' })
      }
    } else {
      return err(res, { message: 'did not init' })
    }
  } else {
    return err(res, { message: 'token is not valid' })
  }
}

export default authMiddleware(create)
