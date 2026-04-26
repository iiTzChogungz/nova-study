import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { checkUsageLimit, recordUsage } from '@/lib/usage'
import { extractTextFromFile } from '@/lib/extractText'

export const maxDuration = 60 

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // 1. Authenticate
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // 2. Validate File
    const formData = await request.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const isAllowed = await checkUsageLimit(user.id, 'upload')
    if (!isAllowed) return NextResponse.json({ error: 'Upload limit exceeded' }, { status: 403 })

    // 3. Fast Upload to Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${crypto.randomUUID()}.${fileExt}`

    const { error: storageError } = await supabase.storage
      .from('documents')
      .upload(fileName, file)

    if (storageError) throw storageError

    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName)

    // 4. Initial Database Record
    const { data: docData, error: docError } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        title: file.name,
        file_url: publicUrl,
        file_type: file.type,
        content: null, 
      })
      .select()
      .single()

    if (docError) throw docError

    // 5. Update Usage
    await recordUsage(user.id, 'upload')

    // 6. ASYNC EXTRACTION (Using Gemini)
    // We simplify this by removing the Embedding/RAG for now 
    // because Gemini can handle huge context directly.
    const processInBg = async () => {
      try {
        const extractedText = await extractTextFromFile(file)
        if (!extractedText) {
          await supabase.from('documents').update({ content: 'ERROR: Extraction failed.' }).eq('id', docData.id)
          return
        }

        await supabase.from('documents').update({ content: extractedText }).eq('id', docData.id)
        // Note: No more vector search chunks needed for now as Gemini can take full text
      } catch (err: any) {
        console.error('Async Gemini Processing Error:', err)
        await supabase
          .from('documents')
          .update({ content: `ERROR: ${err.message || 'AI Processing failed'}` })
          .eq('id', docData.id)
      }
    }

    processInBg()

    return NextResponse.json({ success: true, document: docData })

  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
