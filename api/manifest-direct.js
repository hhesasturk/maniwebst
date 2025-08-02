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

  try {
    const { userMessage } = req.body;
    
    if (!userMessage || userMessage.trim().length === 0) {
      return res.status(400).json({ error: 'Kullanıcı mesajı boş olamaz.' });
    }

    console.log('Kullanıcı mesajı:', userMessage);

    // Doğrudan OpenAI API'sini çağır
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
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
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Hatası:', errorData);
      throw new Error(`OpenAI API Hatası: ${response.status} - ${errorData.error?.message || 'Bilinmeyen hata'}`);
    }

    const data = await response.json();
    console.log('OpenAI cevabı alındı:', data.choices[0].message.content);
    
    res.status(200).json({ answer: data.choices[0].message.content });
  } catch (err) {
    console.error('HATA OLUŞTU:', err.message);
    console.error('Hata detayı:', err);
    
    res.status(500).json({ error: 'Yapay zeka cevabı alınamadı. Lütfen tekrar deneyin. Hata: ' + err.message });
  }
}; 