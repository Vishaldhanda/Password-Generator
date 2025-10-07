import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../lib/mongodb'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'missing' })
  const client = await clientPromise
  const db = client.db()
  const users = db.collection('users')
  const exists = await users.findOne({ email })
  if (exists) return res.status(409).json({ error: 'exists' })
  const hash = await bcrypt.hash(password, 10)
  const r = await users.insertOne({ email, passwordHash: hash, createdAt: new Date() })
  await db.collection('vaults').insertOne({ userId: r.insertedId, items: [], createdAt: new Date(), updatedAt: new Date() })
  return res.status(201).json({ ok: true })
}
