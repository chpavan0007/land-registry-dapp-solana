import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function NavBar() {
  const [wallet, setWallet] = useState<string | null>(null)

  useEffect(() => {
    const solana = (window as any).solana
    if (solana?.isPhantom) {
      solana.connect({ onlyIfTrusted: true }).then(() => {
        setWallet(solana.publicKey.toString())
      }).catch(() => {})
    }
  }, [])

  return (
    <nav style={{
      padding: '1rem 2rem',
      backgroundColor: '#111827',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <Link href="/" style={{ marginRight: '1rem', color: 'white', textDecoration: 'none' }}>
          🏠 Home
        </Link>
        <Link href="/records" style={{ color: 'white', textDecoration: 'none' }}>
          📜 Records
        </Link>
      </div>
      <div style={{ fontSize: '0.9rem' }}>
        {wallet ? `🔗 ${wallet.slice(0, 4)}...${wallet.slice(-4)}` : '🔌 Wallet not connected'}
      </div>
    </nav>
  )
}
