import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const uploadFileToSupabase = async (
  file: File,
  bucket: string,
  path?: string
): Promise<string> => {
  const fileName = path || `${Date.now()}_${file.name.replace(/\s+/g, '_')}`
  
  console.log(`[Supabase] Uploading to bucket: ${bucket}, file: ${fileName}`)
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true // Changed to true to allow overwrite if exists
    })

  if (error) {
    console.error('[Supabase] Upload error:', error)
    throw new Error(`Failed to upload file: ${error.message}`)
  }

  console.log('[Supabase] Upload success:', data)

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName)

  console.log('[Supabase] Public URL:', publicUrl)
  return publicUrl
}

export const deleteFileFromSupabase = async (
  bucket: string,
  filePath: string
): Promise<void> => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath])

  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`)
  }
}
