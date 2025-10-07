import Link from 'next/link'
export default function Home(){
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded shadow">
        <h1 className="text-2xl font-semibold mb-4">Password Vault (MVP)</h1>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">Privacy-first vault: client-side encryption, Next.js + MongoDB.</p>
        <div className="flex gap-2">
          <Link href="/signup"><a className="px-4 py-2 bg-blue-600 text-white rounded">Sign up</a></Link>
          <Link href="/login"><a className="px-4 py-2 border rounded">Log in</a></Link>
        </div>
      </div>
    </div>
  )
}
