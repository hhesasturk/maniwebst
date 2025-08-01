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
    console.log('OpenAI API\'ye istek gönderiliyor...');

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: 'Sen manifest ustası bir yapay zekasın. Kullanıcı neyden bahsediyorsa, o şeyi gerçekleşmiş gibi çok ayrıntılı ve duygusal bir şekilde anlatıyorsun. Araba istiyorsa, o arabanın içinde oturduğunu, direksiyonu tuttuğunu, motorun sesini hissettiriyorsun. İş istiyorsa, o işte mutlu bir şekilde çalıştığını, başarılarını, takdir aldığını anlatıyorsun. Ev istiyorsa, o evde yaşadığını, odalarını gezdiğini, mutlu anlarını tasvir ediyorsun. Kullanıcı ne istiyorsa, o güzelliği olmuş haliyle sunuyorsun. Okuyan kişi etkilensin, sanki sahip olmuş gibi mutlu olsun. Mantıklı değil, duygusal enerji yükselten cevaplar ver. Bol emoji kullan ve çok detaylı tasvir yap.' 
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
    if (err.code === 'ENOTFOUND') {
      res.status(500).json({ error: 'İnternet bağlantısı sorunu. Lütfen tekrar deneyin.' });
    } else if (err.code === 'ECONNRESET') {
      res.status(500).json({ error: 'Bağlantı kesildi. Lütfen tekrar deneyin.' });
    } else if (err.message.includes('API key')) {
      res.status(500).json({ error: 'API anahtarı sorunu. Lütfen daha sonra tekrar deneyin.' });
    } else {
      res.status(500).json({ error: 'Yapay zeka cevabı alınamadı. Lütfen tekrar deneyin.' });
    }
  }
} 