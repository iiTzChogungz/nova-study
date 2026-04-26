import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const docId = id
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch doc to get file_url for storage deletion
    const { data: doc, error: fetchError } = await supabase
      .from('documents')
      .select('file_url, user_id')
      .eq('id', docId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Delete from storage (extract the path from the public URL)
    const url = new URL(doc.file_url)
    // Path is everything after /storage/v1/object/public/documents/
    const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/documents\/(.+)/)
    if (pathMatch) {
      await supabase.storage.from('documents').remove([pathMatch[1]])
    }

    // Cascade delete will remove document_chunks and conversations too
    const { error: deleteError } = await supabase
      .from('documents')
      .delete()
      .eq('id', docId)
      .eq('user_id', user.id)

    if (deleteError) {
      return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
