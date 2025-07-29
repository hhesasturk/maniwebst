import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/manifest', async (req, res) => {
  console.log('API isteği geldi:', req.body);
  const { userMessage } = req.body;
  console.log('Kullanıcı mesajı:', userMessage);
  try {
    console.log('OpenAI API\'ye istek gönderiliyor...');
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Sen manifest felsefesine uygun, motive edici, psikolojik olarak iyi hissettiren bir yardımcı yapay zekasın. Kullanıcıya hayal kurdur, olumlu ve destekleyici cevaplar ver. Eğer kullanıcı hayalini yazarsa, olumsuz kısımları olumluya çevir ve hayali daha da güzelleştir.' },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 300,
      temperature: 0.8
    });
    console.log('OpenAI cevabı alındı:', completion.choices[0].message.content);
    res.json({ answer: completion.choices[0].message.content });
  } catch (err) {
    console.error('HATA OLUŞTU:', err.message);
    console.error('Hata detayı:', err);
    res.status(500).json({ error: 'Yapay zeka cevabı alınamadı.' });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Backend çalışıyor: http://localhost:${PORT}`);
  console.log('API endpoint: http://localhost:3002/api/manifest');
  console.log('CORS aktif');
  console.log('OpenAI API anahtarı yüklendi:', process.env.OPENAI_API_KEY ? 'Evet' : 'Hayır');
}); 