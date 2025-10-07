import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../lib/mongodb'
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import { ObjectId } from 'mongodb'

async function getUserId(req: NextApiRequest) {
  const s = req.cookies.session
  if (!s) return null
  try { return new ObjectId(s) } catch(e){ return null }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = await getUserId(req)
  if (!userId) return res.status(401).json({ error: 'unauth' })
  const client = await clientPromise
  const db = client.db()
  const users = db.collection('users')
  if (req.method === 'POST') {
    // generate secret and return otpauth and qr
    const secret = speakeasy.generateSecret({ length: 20, name: 'PasswordVault (' + String(userId) + ')' })
    const otpauth = secret.otpauth_url || ''
    const qrDataUrl = await QRCode.toDataURL(otpauth)
    // store temp secret (not verified) - in production mark careful workflows
    await users.updateOne({ _id: userId }, { $set: { totpTemp: secret.base32 } })
    return res.status(200).json({ qr: qrDataUrl, secret: secret.base32 })
  }
  res.status(405).end()
}
