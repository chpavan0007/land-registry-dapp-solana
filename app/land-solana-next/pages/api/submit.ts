import type { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm } from 'formidable'
import fs from 'fs'
import { Connection, Keypair, SystemProgram, Transaction, sendAndConfirmTransaction } from '@solana/web3.js'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
)

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' })
  }

  const form = new IncomingForm()

  form.parse(req, async (err, fields) => {
  console.log("🧾 Parsing form...")
  try {
    if (err) {
      console.error('❌ Form parse error:', err)
      return res.status(500).json({ error: 'Form parse error', details: err.message })
    }

    console.log("✅ Parsed fields:", fields)

    const { propertyID, owner, publicKey } = fields

    if (!propertyID || !owner || !publicKey) {
      console.error("❌ Missing fields:", fields)
      return res.status(400).json({ error: 'Missing fields', fields })
    }

    console.log("🔐 Reading wallet.json...")
    const payer = Keypair.fromSecretKey(
      new Uint8Array(JSON.parse(fs.readFileSync('wallet.json', 'utf8')))
    )

    console.log("🔌 Connecting to Solana devnet...")
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed')

    console.log("📦 Creating transaction...")
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: payer.publicKey,
        lamports: 1,
      })
    )

    console.log("🚀 Sending transaction...")
    const signature = await sendAndConfirmTransaction(connection, tx, [payer])
    console.log("✅ Transaction sent with signature:", signature)

    console.log("💾 Inserting into Supabase...")
    const { error } = await supabase.from('land_records').insert([
      {
        property_id: propertyID,
        owner_name: owner,
        public_key: publicKey,
        tx_signature: signature,
      }
    ])

    if (error) {
      console.error("❌ Supabase insert error:", error)
      return res.status(500).json({ error: 'Supabase insert error', details: error.message })
    }

    console.log("✅ Supabase insert success")

    res.status(200).json({ message: 'Transaction submitted and stored', signature })
  } catch (e: any) {
    console.error("❌ Caught exception:", e)
    res.status(500).json({ error: 'Internal server error', details: e.message })
  }
})


}
