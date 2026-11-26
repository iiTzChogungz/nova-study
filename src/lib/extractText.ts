import { generate, FAST_MODEL } from './gemini'

export async function extractTextFromFile(file: File): Promise<string> {
  const clean = (t: string) => t.replace(/\u0000/g, '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim()

  if (file.type === 'text/plain') return clean(await file.text())

  try {
    const base64 = Buffer.from(await file.arrayBuffer()).toString('base64')
    const text = await generate(FAST_MODEL, [
      'Extract all text from this file accurately, preserving headings and structure. If it is Thai, extract Thai correctly. Return only the extracted text.',
      { inlineData: { data: base64, mimeType: file.type } },
    ])
    return clean(text)
  } catch (error) {
    console.error('Gemini extraction error:', error)
    return ''
  }
}
