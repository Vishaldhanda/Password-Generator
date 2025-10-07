import { useState } from 'react'
import { encryptString } from '../lib/crypto'

export default function VaultEditor({ masterPassword, onSaved }: { masterPassword: string, onSaved?: ()=>void }) {
  const [title, setTitle] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [url, setUrl] = useState('')
  const [notes, setNotes] = useState('')

  async function save(e:any){
    e.preventDefault()
    if(!masterPassword) return alert('Enter master password')
    const payload = JSON.stringify({ title, username, password, url, notes })
    const enc = await encryptString(payload, masterPassword)
    const res = await fetch('/api/vault', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...enc }) })
    if (res.ok) { setTitle(''); setUsername(''); setPassword(''); setUrl(''); setNotes(''); onSaved?.() }
    else alert('Save failed')
  }

  return (
    <form onSubmit={save} className="mb-6 p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h3 className="font-medium mb-2">Add item</h3>
      <input className="w-full p-2 border rounded mb-2 bg-gray-50 dark:bg-gray-900" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" />
      <input className="w-full p-2 border rounded mb-2 bg-gray-50 dark:bg-gray-900" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" />
      <input className="w-full p-2 border rounded mb-2 bg-gray-50 dark:bg-gray-900" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
      <input className="w-full p-2 border rounded mb-2 bg-gray-50 dark:bg-gray-900" value={url} onChange={e=>setUrl(e.target.value)} placeholder="URL" />
      <textarea className="w-full p-2 border rounded mb-2 bg-gray-50 dark:bg-gray-900" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Notes" />
      <button className="px-3 py-2 bg-green-600 text-white rounded">Save encrypted</button>
    </form>
  )
}
