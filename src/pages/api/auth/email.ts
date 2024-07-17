import { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const transporter = nodemailer.createTransport({
    port: 465,
    host: 'smtp.larksuite.com',
    auth: {
      user: '',
      pass: '',
    },
    secure: true,
  })

  await new Promise((resolve, reject) => {
    transporter.verify((error, success) => {
      if (error) {
        reject(error)
      } else {
        resolve(success)
      }
    })
  })

  const mailContent = {
    from: {
      name: '',
      address: '',
    },
    replyTo: '',
    to: '',
    subject: '',
    text: '',
    html: ``,
  }

  await new Promise((resolve, reject) => {
    transporter.sendMail(mailContent, (error, info) => {
      if (error) {
        reject(error)
      } else {
        resolve(info)
      }
    })
  })

  res.status(200).json({ ok: true })
}
