import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  async function submit(e:any){
    e.preventDefault()
    const res = await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})})
    if(res.ok) router.push('/vault')
    else alert('Login failed')
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="p-6 bg-white dark:bg-gray-800 rounded shadow w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Log in</h2>
        <label className="block mb-2 text-sm">Email<input value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-2 border rounded" type="email"/></label>
        <label className="block mb-4 text-sm">Password<input value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-2 border rounded" type="password"/></label>
        <button className="w-full py-2 bg-blue-600 text-white rounded">Log in</button>
      </form>
    </div>
  )
}
