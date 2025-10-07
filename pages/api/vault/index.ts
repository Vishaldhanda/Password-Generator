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

  if (req.method === 'GET') {
    const vault = await vaults.findOne({ userId })
    return res.status(200).json({ items: (vault?.items ?? []) })
  }

  if (req.method === 'POST') {
    const { ciphertext, iv, salt } = req.body
    const item = { _id: new ObjectId(), ciphertext, iv, salt, createdAt: new Date(), updatedAt: new Date() }
    await vaults.updateOne({ userId }, { $push: { items: item }, $set: { updatedAt: new Date() } })
    return res.status(201).json({ ok: true })
  }

  res.status(405).end()
}
