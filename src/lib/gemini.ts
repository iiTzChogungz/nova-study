import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export const FAST_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
export const PRO_MODEL = process.env.GEMINI_PRO_MODEL || 'gemini-2.5-pro'

export async function generate(
  modelName: string,
  parts: string | Array<string | { inlineData: { data: string; mimeType: string } }>,
  opts: { json?: boolean } = {}
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: opts.json ? { responseMimeType: 'application/json' } : undefined,
  })
  const result = await model.generateContent(parts as any)
  return result.response.text()
}
