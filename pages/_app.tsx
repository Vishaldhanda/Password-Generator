import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  const [dark, setDark] = useState(false)
  useEffect(()=> {
    const saved = localStorage.getItem('dark')
    if (saved) setDark(saved === '1')
  }, [])
  useEffect(()=> {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('dark', dark ? '1' : '0')
  }, [dark])
  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="p-4 border-b bg-white dark:bg-gray-800">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="text-lg font-semibold">Password Vault</div>
            <div className="flex items-center gap-3">
              <label className="text-sm">Dark</label>
              <input type="checkbox" checked={dark} onChange={e=>setDark(e.target.checked)} />
            </div>
          </div>
        </div>
        <Component {...pageProps} />
      </div>
    </div>
  )
}
