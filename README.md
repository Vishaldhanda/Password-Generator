# Password Vault MVP (Ready ZIP)

## Quick start

1. Extract the zip.
2. Create `.env.local` in the project root with:
   ```
   MONGODB_URI="your_mongodb_connection_string"
   ```
3. Install deps:
   ```bash
   npm install
   ```
4. Run:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000

## Features included
- Next.js + TypeScript starter
- Tailwind CSS
- Signup/Login (bcrypt) with simple session cookie
- Client-side encryption helpers (Web Crypto API, PBKDF2 + AES-GCM)
- Password generator component
- Vault CRUD (server stores ciphertext + iv + salt only)
- Dark mode toggle
- TOTP 2FA enable/verify endpoints (speakeasy + QR code generation)

## Notes
- This is an MVP starter. For production, improve session security (signed cookies or session store), rate-limiting, CSRF protection, and stronger KDF (Argon2/libsodium).
- Do not commit `.env.local`.
