// pages/records.tsx

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Record {
  property_id: string
  owner_name: string
  public_key: string
  tx_signature: string
  timestamp?: string
}

export default function Records() {
  const [records, setRecords] = useState<Record[]>([])
  const [filtered, setFiltered] = useState<Record[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/records')
      .then(res => res.json())
      .then(data => {
        setRecords(data)
        setFiltered(data)
        })
  }, [])

    //search button
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    setFiltered(
      records.filter(r => r.property_id.toLowerCase().includes(value.toLowerCase()))
    )
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>📜 Registered Land Records</h1>
      <Link href="/" style={{ color: '#0070f3', textDecoration: 'underline' }}>
        ← Back to Submit
      </Link>

        
      <input
        type="text"
        placeholder="Search by Property ID"
        value={search}
        onChange={handleSearch}
        style={{ padding: '0.5rem', margin: '1rem 0', width: '100%', maxWidth: '400px' }}
      />

      <div style={{ marginTop: '2rem' }}>
        {filtered.length === 0 ? (
        <p>No matching records found.</p>
      ) : (
        filtered.map((r, i) => (
          <div key={i} style={{
            border: '1px solid #ccc',
            padding: '1rem',
            borderRadius: '6px',
            marginBottom: '1rem',
            backgroundColor: 'black'
          }}>
            <p><strong>Property ID:</strong> {r.property_id}</p>
            <p><strong>Owner:</strong> {r.owner_name}</p>
            <p><strong>Wallet:</strong> {r.public_key.slice(0, 4)}...{r.public_key.slice(-4)}</p>
            <p><strong>Tx:</strong> <a href={`https://explorer.solana.com/tx/${r.tx_signature}?cluster=devnet`} target="_blank" rel="noreferrer">{r.tx_signature}</a></p>
            {r.timestamp && <p><strong>Date:</strong> {new Date(r.timestamp).toLocaleString()}</p>}
          </div>
        ))
      )}
      </div>
    </div>
  )
}
