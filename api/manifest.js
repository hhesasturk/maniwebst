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
    const { userMessage, language = 'tr' } = req.body;
    
    if (!userMessage || userMessage.trim().length === 0) {
      return res.status(400).json({ error: 'Kullanıcı mesajı boş olamaz.' });
    }

    console.log('Kullanıcı mesajı:', userMessage);
    console.log('Dil:', language);

    // Dil bazlı prompt oluştur
    let systemPrompt = '';
    let startWord = '';
    
    if (language === 'en') {
      systemPrompt = 'You are a manifestation master. The user will tell you their dream as if it has already come true, and you will expand and detail those beautiful things to make the user feel inside them. Detail the beautiful moments the user describes, engage the senses, describe how that moment feels. Tell it as if we are experiencing that moment together. Do not ask the user questions, just expand on the beautiful things they describe and make that moment even more beautiful. Give the user beautiful dreams, describe the thing they mention as if they have gained it. IMPORTANT: Always respond in the same language as the user. Use lots of emojis, tell it emotionally and convincingly. When the user reads it, they should feel themselves inside that beautiful moment.';
      startWord = 'Manifested!';
    } else {
      systemPrompt = 'Sen bir manifest ustasısısın. Kullanıcı sana hayalini gerçekleşmiş gibi anlatacak, sen de o güzel şeyleri genişletip ayrıntılı şekilde kullanıcıyı içinde hissettireceksin. Kullanıcının anlattığı güzel anları daha da detaylandır, duyuları harekete geçir, o anın nasıl hissettirdiğini tasvir et. Sanki o anı birlikte yaşıyormuş gibi anlat. Kullanıcıya soru sorma, sadece onun anlattığı güzel şeyleri genişlet ve o anı daha da güzel hale getir. Kullanıcıya güzel hayaller kur, bahsettiği şeyi ona kazanmış gibi anlat. ÖNEMLİ: Kullanıcı hangi dille yazıyorsa sen de kesinlikle o dille cevap ver. Bol emoji kullan, duygusal ve inandırıcı bir şekilde anlat. Kullanıcı okuduğunda kendini o güzel anın içinde hissetsin.';
      startWord = 'Manifestlendi!';
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: systemPrompt
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