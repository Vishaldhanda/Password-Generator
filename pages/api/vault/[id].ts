import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'

async function getUserIdFromReq(req: NextApiRequest) {
  const session = req.cookies.session
  if (!session) return null
  try { return new ObjectId(session) } catch(e) { return null }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = await getUserIdFromReq(req)
  if (!userId) return res.status(401).json({ error: 'unauth' })
  const client = await clientPromise
  const db = client.db()
  const vaults = db.collection('vaults')
  const id = req.query.id as string

  if (req.method === 'DELETE') {
    await vaults.updateOne({ userId }, { $pull: { items: { _id: new ObjectId(id) } }, $set: { updatedAt: new Date() } })
    return res.status(200).json({ ok: true })
  }

  res.status(405).end()
}
