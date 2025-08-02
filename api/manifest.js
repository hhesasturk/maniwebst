const { OpenAI } = require('openai');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if API key exists
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY bulunamadı');
    return res.status(500).json({ error: 'API anahtarı yapılandırılmamış. Lütfen Vercel dashboard\'da environment variable\'ları kontrol edin.' });
  }

  try {
    const { userMessage } = req.body;
    
    if (!userMessage || userMessage.trim().length === 0) {
      return res.status(400).json({ error: 'Kullanıcı mesajı boş olamaz.' });
    }

    console.log('Kullanıcı mesajı:', userMessage);
    console.log('API Key mevcut:', process.env.OPENAI_API_KEY ? 'Evet' : 'Hayır');

    const openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY 
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: 'Sen manifest felsefesine uygun, motive edici, psikolojik olarak iyi hissettiren bir yardımcı yapay zekasın. Kullanıcıya hayal kurdur, olumlu ve destekleyici cevaplar ver. Eğer kullanıcı hayalini yazarsa, olumsuz kısımları olumluya çevir ve hayali daha da güzelleştir. Türkçe cevap ver.' 
        },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 300,
      temperature: 0.8
    });

    console.log('OpenAI cevabı alındı:', completion.choices[0].message.content);
    
    res.status(200).json({ answer: completion.choices[0].message.content });
  } catch (err) {
    console.error('HATA OLUŞTU:', err.message);
    console.error('Hata detayı:', err);
    
    // Daha detaylı hata mesajları
    if (err.message.includes('API key') || err.message.includes('authentication')) {
      res.status(500).json({ error: 'API anahtarı sorunu. Lütfen Vercel dashboard\'da OPENAI_API_KEY environment variable\'ını kontrol edin.' });
    } else if (err.message.includes('rate limit')) {
      res.status(429).json({ error: 'Çok fazla istek. Lütfen biraz bekleyip tekrar deneyin.' });
    } else if (err.message.includes('quota') || err.message.includes('billing')) {
      res.status(500).json({ error: 'API kotası doldu. Lütfen daha sonra tekrar deneyin.' });
    } else if (err.message.includes('network') || err.message.includes('fetch')) {
      res.status(500).json({ error: 'Ağ bağlantısı sorunu. Lütfen internetinizi kontrol edin ve tekrar deneyin.' });
    } else {
      res.status(500).json({ error: 'Yapay zeka cevabı alınamadı. Lütfen tekrar deneyin. Hata: ' + err.message });
    }
  }
}; 