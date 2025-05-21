import React, { useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

export default function Home() {
  const [propertyID, setPropertyID] = useState('')
  const [owner, setOwner] = useState('')
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [txSignature, setTxSignature] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const wallet = (window as any).solana
    if (!wallet?.isPhantom) return alert('Phantom wallet not found')

    await wallet.connect()
    const publicKey = wallet.publicKey.toString()

    const formData = new FormData()
    formData.append('propertyID', propertyID)
    formData.append('owner', owner)
    formData.append('publicKey', publicKey)
    if (pdfFile) formData.append('pdf', pdfFile)

    try {
      const res = await axios.post('/api/submit', formData)
      setTxSignature(res.data.signature)
    } catch (err) {
      console.error('Submission error:', err)
      alert('❌ Submission failed. See console.')
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Land Registration</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Property ID"
          value={propertyID}
          onChange={(e) => setPropertyID(e.target.value)}
          required
        />
        <br />
        <input
          type="text"
          placeholder="Owner Name"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          required
        />
        <br />
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
          required
        />
        <br />
        <button type="submit">Submit</button>
      </form>

      {txSignature && (
        <div style={{ marginTop: '2rem' }}>
          <h2>✅ Submitted to Solana Devnet</h2>
          <p>
            Transaction Signature:{' '}
            <a
              href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {txSignature}
            </a>
          </p>
        </div>
      )}

      {/* ✅ Moved inside JSX return block */}
      <Link href="/records" passHref>
        <button
          style={{
            marginTop: '2rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          View Registered Land Records
        </button>
      </Link>
    </div>
  )
}
