import { createClient } from '@/lib/supabase/server'
import { storagePath } from '@/lib/storage'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: doc } = await supabase
      .from('documents').select('file_url').eq('id', id).eq('user_id', user.id).single()
    if (!doc) return NextResponse.json({ error: 'Document not found' }, { status: 404 })

    await supabase.storage.from('documents').remove([storagePath(doc.file_url)])
    const { error } = await supabase.from('documents').delete().eq('id', id).eq('user_id', user.id)
    if (error) return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
