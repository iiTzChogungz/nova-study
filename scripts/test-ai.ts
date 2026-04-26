import { openai } from '../src/lib/openai'

async function testAISummary() {
  console.log('--- Testing AI Summary Action ---')
  const mockContext = "นี่คือเนื้อหาทดสอบเกี่ยวกับระบบ Rocket Learn ซึ่งเป็น AI ผู้ช่วยนักเรียนที่สามารถสรุปบทเรียนและออกข้อสอบได้"
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert summarizer.' },
        { role: 'user', content: `Please summarize this: ${mockContext}` }
      ],
    })
    
    console.log('✅ AI Response Success:')
    console.log(response.choices[0].message.content)
  } catch (error) {
    console.error('❌ AI Response Failed:', error)
  }
}

testAISummary()
