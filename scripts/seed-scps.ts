/**
 * SCP Data Seed Script
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY (not the anon key).
 * The service role key bypasses RLS and should NEVER be exposed to the client.
 *
 * Get it from: Supabase Dashboard → Settings → API → service_role key
 * Add it to your .env.local file.
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const API_URL = 'https://scp-data.tedivm.com/data/scp/items/index.json'
const BATCH_SIZE = 500

interface ScpApiEntry {
  scp_number: number
  scp: string
  title: string
  series: string
  rating: number
  url: string
  content_file: string
  created_at?: string
}

interface ScpDbEntry {
  scp_number: number
  scp_id: string
  title: string
  series: string
  rating: number
  url: string
  content_file: string
}

async function seedScps() {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required for seeding')
    process.exit(1)
  }

  console.log('🚀 Starting SCP data ingestion...')

  // Initialize Supabase client (service role bypasses RLS)
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  try {
    // Fetch data from API
    console.log('📥 Fetching data from SCP-Data API...')
    const response = await fetch(API_URL)
    const data: Record<string, ScpApiEntry> = await response.json()

    // Convert to array and map to our schema
    const entries: ScpDbEntry[] = Object.values(data).map((entry) => ({
      scp_number: entry.scp_number,
      scp_id: entry.scp,
      title: entry.title,
      series: entry.series,
      rating: entry.rating,
      url: entry.url,
      content_file: entry.content_file,
    }))

    console.log(`📊 Total entries to insert: ${entries.length}`)

    // Insert in batches
    let inserted = 0
    let errors = 0

    for (let i = 0; i < entries.length; i += BATCH_SIZE) {
      const batch = entries.slice(i, i + BATCH_SIZE)
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1
      const totalBatches = Math.ceil(entries.length / BATCH_SIZE)

      console.log(
        `⏳ Processing batch ${batchNumber}/${totalBatches} (${batch.length} entries)...`
      )

      const { error } = await supabase
        .from('scps')
        .upsert(batch, {
          onConflict: 'scp_id',
          ignoreDuplicates: false,
        })

      if (error) {
        console.error(`❌ Error in batch ${batchNumber}:`, error.message)
        errors += batch.length
      } else {
        inserted += batch.length
        console.log(`✅ Batch ${batchNumber} complete`)
      }

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    console.log('\n🎉 Seeding complete!')
    console.log(`✅ Successfully inserted: ${inserted}`)
    console.log(`❌ Errors: ${errors}`)

    // Verify count
    const { count } = await supabase
      .from('scps')
      .select('*', { count: 'exact', head: true })

    console.log(`📊 Total records in database: ${count}`)
  } catch (error) {
    console.error('💥 Fatal error:', error)
    process.exit(1)
  }
}

seedScps()
