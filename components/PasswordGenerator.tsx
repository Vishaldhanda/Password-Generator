import { useState } from 'react'

export default function PasswordGenerator({ onCopy }: { onCopy?: () => void }) {
  const [len, setLen] = useState(16)
  const [upper, setUpper] = useState(true)
  const [lower, setLower] = useState(true)
  const [numbers, setNumbers] = useState(true)
  const [symbols, setSymbols] = useState(false)
  const [excludeLookalikes, setExcludeLookalikes] = useState(true)
  const [password, setPassword] = useState('')

  function generate() {
    const lookalikes = new Set(['0','O','o','l','1','I','|'])
    let charset = ''
    if (upper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (lower) charset += 'abcdefghijklmnopqrstuvwxyz'
    if (numbers) charset += '0123456789'
    if (symbols) charset += '!@#$%^&*()-_=+[]{};:,.<>?'
    if (excludeLookalikes) charset = [...charset].filter(c => !lookalikes.has(c)).join('')
    if (!charset) return
    const arr = new Uint32Array(len)
    crypto.getRandomValues(arr)
    const pwd = Array.from(arr).map(n => charset[n % charset.length]).join('').slice(0, len)
    setPassword(pwd)
  }

  async function copy() {
    if (!password) return
    try {
      await navigator.clipboard.writeText(password)
      onCopy?.()
      setTimeout(async ()=>{ try { await navigator.clipboard.writeText('') } catch(e){} }, 15000)
    } catch(e){ alert('Clipboard failed') }
  }

  return (
    <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded shadow">
      <div className="flex gap-2 mb-3">
        <input className="flex-1 p-2 border rounded bg-gray-50 dark:bg-gray-900" value={password} readOnly />
        <button onClick={copy} className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded">Copy</button>
        <button onClick={generate} className="px-3 py-2 bg-blue-600 text-white rounded">Generate</button>
      </div>
      <div className="flex gap-3 items-center flex-wrap">
        <label>Length: <input type="range" min={8} max={64} value={len} onChange={e=>setLen(Number(e.target.value))} /></label>
        <label><input type="checkbox" checked={upper} onChange={e=>setUpper(e.target.checked)} />Upper</label>
        <label><input type="checkbox" checked={lower} onChange={e=>setLower(e.target.checked)} />Lower</label>
        <label><input type="checkbox" checked={numbers} onChange={e=>setNumbers(e.target.checked)} />Numbers</label>
        <label><input type="checkbox" checked={symbols} onChange={e=>setSymbols(e.target.checked)} />Symbols</label>
        <label><input type="checkbox" checked={excludeLookalikes} onChange={e=>setExcludeLookalikes(e.target.checked)} />Exclude lookalikes</label>
      </div>
    </div>
  )
}
