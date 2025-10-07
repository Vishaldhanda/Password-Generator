import { MongoClient } from 'mongodb'
const uri = process.env.MONGODB_URI!
let clientPromise: Promise<MongoClient>
if (!uri) throw new Error('Please add MONGODB_URI to .env.local')
if (process.env.NODE_ENV === 'development') {
  ;(global as any)._mongoClientPromise ??= new MongoClient(uri).connect()
  clientPromise = (global as any)._mongoClientPromise
} else {
  clientPromise = new MongoClient(uri).connect()
}
export default clientPromise
