import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../lib/mongodb'
import bcrypt from 'bcryptjs'
import { serialize } from 'cookie'
import { ObjectId } from 'mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'missing' })
  const client = await clientPromise
  const db = client.db()
  const users = db.collection('users')
  const user = await users.findOne({ email })
  if (!user) return res.status(401).json({ error: 'invalid' })
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ error: 'invalid' })
  const cookie = serialize('session', String(user._id), { httpOnly: true, path: '/', maxAge: 60*60*24*7 })
  res.setHeader('Set-Cookie', cookie)
  return res.status(200).json({ ok: true })
}
