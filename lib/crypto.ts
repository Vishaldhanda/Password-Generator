// client-side crypto helpers (Web Crypto API)
function bufToBase64(buf: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
}
function base64ToBuf(b64: string) {
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer
}

export async function deriveKey(password: string, saltB64: string) {
  const enc = new TextEncoder()
  const salt = base64ToBuf(saltB64)
  const baseKey = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey'])
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt, iterations: 150000, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt','decrypt']
  )
  return key
}

export async function encryptString(plaintext: string, password: string) {
  const enc = new TextEncoder()
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const saltB64 = bufToBase64(salt.buffer)
  const key = await deriveKey(password, saltB64)
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(plaintext))
  return { ciphertext: bufToBase64(ct), iv: bufToBase64(iv.buffer), salt: saltB64 }
}

export async function decryptString(ciphertextB64: string, ivB64: string, saltB64: string, password: string) {
  const dec = new TextDecoder()
  const key = await deriveKey(password, saltB64)
  const ct = base64ToBuf(ciphertextB64)
  const iv = base64ToBuf(ivB64)
  const plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct)
  return dec.decode(plainBuf)
}
