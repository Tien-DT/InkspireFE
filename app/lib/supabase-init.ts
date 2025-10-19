import { supabase } from './supabase'

export async function ensureBucketsExist() {
  const bucketsToCreate = [
    { name: 'portfolio-images', public: true },
    { name: 'portfolio-pdfs', public: true }
  ]

  try {
    // Get existing buckets
    const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('[Supabase] Error listing buckets:', listError)
      return
    }

    const existingBucketNames = existingBuckets?.map(b => b.name) || []
    console.log('[Supabase] Existing buckets:', existingBucketNames)

    // Create missing buckets
    for (const bucket of bucketsToCreate) {
      if (!existingBucketNames.includes(bucket.name)) {
        console.log(`[Supabase] Creating bucket: ${bucket.name}`)
        const { data, error } = await supabase.storage.createBucket(bucket.name, {
          public: bucket.public,
          fileSizeLimit: bucket.name.includes('pdf') ? 10485760 : 5242880 // 10MB for PDFs, 5MB for images
        })

        if (error) {
          console.error(`[Supabase] Error creating bucket ${bucket.name}:`, error)
        } else {
          console.log(`[Supabase] Bucket ${bucket.name} created successfully`)
        }
      } else {
        console.log(`[Supabase] Bucket ${bucket.name} already exists`)
      }
    }
  } catch (error) {
    console.error('[Supabase] Error in ensureBucketsExist:', error)
  }
}
