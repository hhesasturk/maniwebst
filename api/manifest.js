const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { manifest } = req.body;

    if (!manifest || !manifest.trim()) {
      return res.status(400).json({ error: 'Manifest metni gerekli' });
    }

    // Check if OpenAI API key exists
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY bulunamadı');
      const fallbackResponse = `Bu harika, zaten bu gerçekliğe doğru çekiliyorsun. 

Şu an bu hayalin içindesin, hisset. Seninle uyum içinde. Manifesto enerjin çalıştı bile, kendini olmuş gibi hisset.✨

Tüm bunlar gerçek olmuş olsaydı, günlüğüne nasıl yazardın?`;

      return res.status(200).json({ response: fallbackResponse });
    }

    const prompt = `Sen spiritüel bir manifest koçusun. Kullanıcının yazdığı hayali gerçekleşmiş gibi kabul et ve ona çok detaylı, spiritüel ve motive edici bir yanıt ver.

Kullanıcının manifesti: "${manifest}"

Yanıtın şu özelliklerde olmalı:
1. "Bu harika, zaten bu gerçekliğe doğru çekiliyorsun" tarzında başla
2. Kullanıcının bahsettiği konuyu çok detaylı ele al
3. Bu hayalin gerçekleştiği dünyayı betimle
4. Kullanıcının hissettiği duyguları ve deneyimleri detaylandır
5. "Şu an bu hayalin içindesin, hisset. Seninle uyum içinde" gibi cümleler ekle
6. "Manifesto enerjin çalıştı bile, kendini olmuş gibi hisset.✨" tarzında devam et
7. Bu gerçekliğin nasıl hissettirdiğini detaylı anlat
8. En sonunda mutlaka şu soruyu sor: "Tüm bunlar gerçek olmuş olsaydı, günlüğüne nasıl yazardın?"

Yanıtın 4-5 paragraf uzunluğunda olsun, çok detaylı ve betimleyici olsun. Kullanıcıyı bu gerçekliğin içine çeksin. Emoji kullan ama abartma.`;

    console.log('OpenAI API çağrısı yapılıyor...');
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Sen spiritüel bir manifest koçusun. Kullanıcının hayallerini gerçekleşmiş gibi kabul eder ve onu çok detaylı, motive edici, spiritüel bir dille yanıtlarsın. Kullanıcının bahsettiği konuyu derinlemesine ele alır ve o gerçekliği yaşatırsın."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.8,
    });

    const response = completion.choices[0].message.content;
    console.log('OpenAI yanıtı alındı:', response.substring(0, 100) + '...');

    res.status(200).json({ response });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // More detailed error logging
    if (error.response) {
      console.error('Error response:', error.response.status, error.response.data);
    }
    
    // Fallback response if API fails
    const fallbackResponse = `Bu harika, zaten bu gerçekliğe doğru çekiliyorsun. 

Şu an bu hayalin içindesin, hisset. Seninle uyum içinde. Manifesto enerjin çalıştı bile, kendini olmuş gibi hisset.✨

Bu gerçeklik seninle uyum içinde çalışıyor. Her nefes alışında bu hayal daha da güçleniyor. Evren senin bu niyetini duyuyor ve gerçekleştiriyor.

Tüm bunlar gerçek olmuş olsaydı, günlüğüne nasıl yazardın?`;

    res.status(200).json({ response: fallbackResponse });
  }
}; 