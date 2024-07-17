import { NextApiRequest, NextApiResponse } from 'next'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { encodeURL, findReference, validateTransfer } from '@solana/pay'
import BigNumber from 'bignumber.js'
import { getSolanaRPCUrl } from '@/lib/web3'

import config from '@/config'

const { title } = config

let endpoint = getSolanaRPCUrl()

const paymentRequests = new Map<string, { recipient: PublicKey; amount: BigNumber; memo: string }>()

const verifyTransaction = async (reference: PublicKey) => {
  // 1 - Check that the payment request exists
  const paymentData = paymentRequests.get(reference.toBase58())
  if (!paymentData) {
    throw new Error('Payment request not found')
  }
  const { recipient, amount, memo } = paymentData
  // 2 - Establish a Connection to the Solana Cluster
  const connection = new Connection(endpoint, 'confirmed')
  console.log('recipient', recipient.toBase58())
  console.log('amount', amount)
  console.log('reference', reference.toBase58())
  console.log('memo', memo)

  // 3 - Find the transaction reference
  const found = await findReference(connection, reference)
  console.log(found.signature)

  // 4 - Validate the transaction
  const response = await validateTransfer(
    connection,
    found.signature,
    {
      recipient,
      amount,
      splToken: undefined,
      reference,
      //memo
    },
    { commitment: 'confirmed' }
  )
  // 5 - Delete the payment request from local storage and return the response
  if (response) {
    paymentRequests.delete(reference.toBase58())
  }
  return response
}

export default async function payment(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      let memo = req.body?.memo || `By ${title} Pay`
      const { recipient, amount, message, label, splToken } = req.body
      const reference = new Keypair().publicKey

      if (!recipient || !amount || !reference) {
        throw new Error('Invalid payment request')
        return
      }

      let defaultParams = {
        recipient,
        amount,
        reference,
        label,
        message,
        memo,
      }
      if (splToken) Object.assign(defaultParams, splToken)

      const url = encodeURL(defaultParams)
      const ref = reference.toBase58()
      paymentRequests.set(ref, { recipient, amount, memo })
      res.status(200).json({ url: url.toString(), ref })
    } catch (error) {
      console.error('Error:', error)
      res.status(500).json({ error: 'Server error' })
    }
    // Handle Verify Payment Requests
  } else if (req.method === 'GET') {
    // 1 - Get the reference query parameter from the NextApiRequest
    const reference = req.query.reference
    if (!reference) {
      res.status(400).json({ error: 'Missing reference query parameter' })
      return
    }
    // 2 - Verify the transaction
    try {
      const referencePublicKey = new PublicKey(reference as string)
      const response = await verifyTransaction(referencePublicKey)
      if (response) {
        res.status(200).json({ status: 'Transaction verified' })
      } else {
        res.status(404).json({ status: 'Transaction not found' })
      }
    } catch (error) {
      console.error('Error:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
  // ...
}
