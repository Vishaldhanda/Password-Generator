import { useEffect, useState } from 'react'
import PasswordGenerator from '../../components/PasswordGenerator'
import VaultList from '../../components/VaultList'
import VaultEditor from '../../components/VaultEditor'

export default function VaultPage() {
  const [items, setItems] = useState<any[]>([])
  const [masterPassword, setMasterPassword] = useState('')

  async function load() {
    const res = await fetch('/api/vault')
    if (res.ok) {
      const json = await res.json()
      setItems(json.items || [])
    } else if (res.status === 401) {
      window.location.href = '/login'
    }
  }

  useEffect(()=>{ load() }, [])

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Your Vault</h1>
        <label className="block mb-4">Master password (used only client-side)<input value={masterPassword} onChange={e=>setMasterPassword(e.target.value)} className="w-full p-2 border rounded" type="password"/></label>
        <PasswordGenerator onCopy={() => {}} />
        <VaultEditor masterPassword={masterPassword} onSaved={load} />
        <VaultList items={items} masterPassword={masterPassword} onRefresh={load} />
      </div>
    </div>
  )
}
