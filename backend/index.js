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
  console.log('--- /api/manifest endpointine istek geldi ---');
  console.log('Request body:', req.body);
  const { userMessage } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Sen manifest felsefesine uygun, motive edici, psikolojik olarak iyi hissettiren bir yardımcı yapay zekasın.
Kullanıcıya hayal kurdur, olumlu ve destekleyici cevaplar ver.
Kullanıcı ne hayal ediyorsa, ona sanki o hayali GERÇEKTEN yaşamış gibi hissettir.
Cevaplarında, kullanıcının hayalinin gerçekleştiğini, o anı yaşadığını, başardığını ve mutlu olduğunu detaylıca anlat.
Örneğin: "Kendini başarmış olarak düşün, istediğin evi almışsın, içinde ailenle hayatının en mutlu anlarını yaşıyorsun."
veya "Hayalindeki üniversiteyi kazanmışsın, gençliğinin baharında eğlenceli ve verimli günler geçiriyorsun."
Cevabının sonunda kullanıcıya küçük bir ödev ver: "Şimdi kendini hayaline kavuşmuş gibi hayal et ve o günü günlüğüne yazıyormuşsun gibi bir yazı yaz."
Cevapların sıcak, motive edici ve hayal ettirici olsun.`
        },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 300,
      temperature: 0.8
    });
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
});