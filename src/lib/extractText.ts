import { geminiModel } from './gemini'

export async function extractTextFromFile(file: File): Promise<string> {
  try {
    console.log(`Extracting text from ${file.name} using Gemini...`)

    const buffer = Buffer.from(await file.arrayBuffer())
    const base64File = buffer.toString('base64')

    // 1. For Images & PDFs: Use Gemini's multi-modal capabilities
    // Gemini can handle PDF and Image directly
    const result = await geminiModel.generateContent([
      "Extract all text from this file accurately. If it's Thai, extract Thai correctly. Return only the extracted text.",
      {
        inlineData: {
          data: base64File,
          mimeType: file.type
        }
      }
    ])

    const text = result.response.text()
    
    // Clean up
    const cleanedText = text
      .replace(/\u0000/g, '')
      .replace(/\s+/g, ' ')
      .trim()

    console.log(`Gemini Extraction complete. Length: ${cleanedText.length}`)
    return cleanedText

  } catch (error) {
    console.error('Gemini Extraction Error:', error)
    
    // Fallback for simple PDFs if Gemini fails
    if (file.type === 'application/pdf') {
       try {
         const pdf = require('pdf-extraction')
         const buffer = Buffer.from(await file.arrayBuffer())
         const data = await pdf(buffer)
         return data.text
       } catch (e) {
         return ""
       }
    }
    
    return ""
  }
}
