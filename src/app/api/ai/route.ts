import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { geminiModel, geminiProModel } from '@/lib/gemini'
import { checkUsageLimit, recordUsage } from '@/lib/usage'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // 1. Authenticate user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { documentId, action, prompt } = body 

    if (!documentId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check usage limits
    const isAllowed = await checkUsageLimit(user.id, 'query')
    if (!isAllowed) {
      return NextResponse.json({ error: 'AI query limit exceeded for your current plan.' }, { status: 403 })
    }

    // 2. Fetch document content
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .eq('user_id', user.id)
      .single()

    if (docError || !document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    if (!document.content) {
      return NextResponse.json({ error: 'Document content is empty or still processing' }, { status: 400 })
    }

    // 3. Prepare Gemini Prompt
    let systemPrompt = "You are an expert AI tutor. Answer based on the provided document content."
    let userTask = ""
    let selectedModel = geminiModel // Default to Flash for speed/free tier

    switch (action) {
      case 'summarize':
        userTask = "Please provide a concise summary of this document."
        break
      case 'detailed_summary':
        userTask = "Please provide a detailed section-by-section summary of this document."
        selectedModel = geminiProModel // Use Pro for better summaries
        break
      case 'quiz':
        userTask = "Generate a 5-question multiple choice quiz based on this text. Format as JSON with question, options, and answer."
        break
      case 'qa':
        userTask = `Question: ${prompt}. Answer based on the document.`
        break
      case 'report':
        userTask = "Generate an academic lab report based on this text."
        selectedModel = geminiProModel
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const fullPrompt = `${systemPrompt}\n\nDocument Content:\n${document.content}\n\nTask: ${userTask}`

    // 4. Call Gemini
    const result = await selectedModel.generateContent(fullPrompt)
    const aiResponseText = result.response.text()

    // 5. Log conversation
    await supabase.from('conversations').insert({
      user_id: user.id,
      document_id: documentId,
      message: prompt || action,
      response: aiResponseText
    })

    // 6. Update Usage
    await recordUsage(user.id, 'query')
    
    return NextResponse.json({ result: aiResponseText })

  } catch (error: any) {
    console.error('Gemini AI route error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
