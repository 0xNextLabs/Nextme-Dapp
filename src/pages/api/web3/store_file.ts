//此处等待和刘年配合修改，所以可以先不必审核，页面中未实际调用
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function store_file(req: NextApiRequest, res: NextApiResponse) {
  const web3Token = process.env.Web3Storage_Master
  res.status(200).json({
    data: {
      key: web3Token,
    },
  })
}
