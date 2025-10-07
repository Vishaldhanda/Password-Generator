import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../lib/mongodb'
import speakeasy from 'speakeasy'
import { ObjectId } from 'mongodb'

async function getUserId(req: NextApiRequest) {
  const s = req.cookies.session
  if (!s) return null
  try { return new ObjectId(s) } catch(e){ return null }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = await getUserId(req)
  if (!userId) return res.status(401).json({ error: 'unauth' })
  if (req.method !== 'POST') return res.status(405).end()
  const { token } = req.body
  const client = await clientPromise
  const db = client.db()
  const users = db.collection('users')
  const user = await users.findOne({ _id: userId })
  const tempSecret = user?.totpTemp
  if (!tempSecret) return res.status(400).json({ error: 'no-temp' })
  const ok = speakeasy.totp.verify({ secret: tempSecret, encoding: 'base32', token, window: 1 })
  if (!ok) return res.status(400).json({ error: 'invalid' })
  // promote temp to active secret
  await users.updateOne({ _id: userId }, { $set: { totpSecret: tempSecret }, $unset: { totpTemp: '' } })
  return res.status(200).json({ ok: true })
}
