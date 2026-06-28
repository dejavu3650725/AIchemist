export default async function handler(req, res) {
  // 1. POST 메서드만 허용 (요청사항 2번)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // 2. 환경 변수에서 API 키 읽기 (요청사항 4번)
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key is not configured' });
    }

    // 3. 내장 fetch를 사용하여 Gemini REST API 호출 (요청사항 5번, 6번, 7번)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    // 4. 응답 텍스트만 추출해서 프론트엔드로 반환 (요청사항 6번)
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    return res.status(200).json({ result: textResponse });
    
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'Failed to generate content' });
  }
}
