export function chunkText(text: string, maxChunkSize: number = 1000): string[] {
  // A simple chunking function. It splits by paragraphs first.
  const paragraphs = text.split(/\n\s*\n/)
  const chunks: string[] = []
  
  let currentChunk = ''

  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length > maxChunkSize) {
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim())
      }
      currentChunk = paragraph
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim())
  }

  // If a single paragraph is still too large, we fall back to aggressive splitting by length
  const finalChunks: string[] = []
  for (const chunk of chunks) {
    if (chunk.length > maxChunkSize * 1.5) {
      // Split aggressively by word boundaries or fixed length
      for (let i = 0; i < chunk.length; i += maxChunkSize) {
        finalChunks.push(chunk.slice(i, i + maxChunkSize))
      }
    } else {
      finalChunks.push(chunk)
    }
  }

  return finalChunks
}
