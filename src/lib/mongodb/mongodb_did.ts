import { getMongoDB } from './mongodb'

const uri = process.env.MONGODB_DID_URI as string // your mongodb connection string

export default getMongoDB(uri, 'nextme_did')
