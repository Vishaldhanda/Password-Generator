import { useState } from 'react'
import { decryptString } from '../lib/crypto'

export default function VaultList({ items, masterPassword, onRefresh }: { items: any[], masterPassword: string, onRefresh?: ()=>void }) {
  const [query, setQuery] = useState('')
  const [decryptedCache, setDecryptedCache] = useState<Record<string,string>>({})

  async function decryptItem(it:any){
    try {
      const plain = await decryptString(it.ciphertext, it.iv, it.salt, masterPassword)
      setDecryptedCache(prev=>({ ...prev, [it._id]: plain }))
    } catch(e) { console.error('decrypt failed', e); alert('Decrypt failed (wrong master password?)') }
  }

  async function remove(id:string){
    if (!confirm('Delete?')) return
    const res = await fetch('/api/vault/' + id, { method: 'DELETE' })
    if (res.ok) onRefresh?.()
  }

  const filtered = items.filter(it => {
    const dec = decryptedCache[it._id]
    if (!dec) return true
    return dec.toLowerCase().includes(query.toLowerCase())
  })

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <div className="mb-3 flex gap-2">
        <input className="flex-1 p-2 border rounded bg-gray-50 dark:bg-gray-900" placeholder="Search (after decrypt)" value={query} onChange={e=>setQuery(e.target.value)} />
      </div>
      <div className="space-y-3">
        {filtered.map(it => (
          <div key={it._id} className="p-3 border rounded bg-gray-50 dark:bg-gray-900">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">Encrypted item: {it._id}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Created: {new Date(it.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>decryptItem(it)} className="px-2 py-1 border rounded">Decrypt</button>
                <button onClick={()=>remove(it._id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
              </div>
            </div>
            {decryptedCache[it._id] && (
              <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded">{decryptedCache[it._id]}</pre>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
