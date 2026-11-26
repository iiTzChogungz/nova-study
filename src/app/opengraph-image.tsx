import { ImageResponse } from 'next/og'

export const alt = 'Nova Study — AI Study Companion'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', color: 'white' }}>
        <div style={{ fontSize: 120, fontWeight: 800 }}>Nova Study</div>
        <div style={{ fontSize: 44, marginTop: 20, opacity: 0.9 }}>AI Study Companion · Free</div>
        <div style={{ fontSize: 34, marginTop: 14, opacity: 0.8 }}>Summaries · Quizzes · Flashcards · Q&A</div>
      </div>
    ),
    size
  )
}
