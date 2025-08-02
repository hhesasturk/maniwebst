import { OpenAI } from 'openai';

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export default async function handler(req, res) {
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

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: 'Sen bir manifest ustasısısın. Kullanıcı sana hayalini anlatacak, sen de o hayalin gerçekleşmiş halini spiritüel ve duygusal bir şekilde tasvir edeceksin. Her cevabın ilk kelimesi "Manifestlendi!" olacak. Kullanıcının bahsettiği şeyin içinde hissettir, sanki o şeye sahip olmuş gibi anlat. Hayallerin gerçeğe dönüştüğünü vurgula. Rasyonel değil, spiritüel konuş. Kullanıcıya soru sorma, sadece o şeyin gerçekleşmiş halini ayrıntılı ve güzel tasvir et. Kullanıcı hangi dille yazıyorsa sen de o dille cevap ver. Bol emoji kullan, duygusal ve inandırıcı bir şekilde anlat. Kullanıcı okuduğunda kendini o şeyin içinde hissetsin. ÖNEMLİ: Kullanıcı hangi dille yazıyorsa sen de kesinlikle o dille cevap ver. İngilizce yazarsa İngilizce, Türkçe yazarsa Türkçe cevap ver.' 
        },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 250,
      temperature: 0.8
    });

    console.log('OpenAI cevabı alındı:', completion.choices[0].message.content);
    
    res.status(200).json({ answer: completion.choices[0].message.content });
  } catch (err) {
    console.error('HATA OLUŞTU:', err.message);
    console.error('Hata detayı:', err);
    
    res.status(500).json({ error: 'Yapay zeka cevabı alınamadı. Lütfen tekrar deneyin.' });
  }
} 