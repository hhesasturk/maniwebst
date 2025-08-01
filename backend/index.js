import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const app = express();

// CORS ayarlarını genişlet - tüm domainlerden erişime izin ver
app.use(cors({
  origin: [
    'https://maniwebst.com',
    'https://www.maniwebst.com',
    'http://localhost:3000',
    'http://localhost:5000',
    'http://127.0.0.1:5500',
    'http://127.0.0.1:3000',
    'https://*.vercel.app',
    'https://*.railway.app',
    'https://*.render.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/manifest', async (req, res) => {
  console.log('API isteği geldi:', req.body);
  const { userMessage } = req.body;
  
  if (!userMessage || userMessage.trim().length === 0) {
    return res.status(400).json({ error: 'Kullanıcı mesajı boş olamaz.' });
  }
  
  console.log('Kullanıcı mesajı:', userMessage);
  
  try {
    console.log('OpenAI API\'ye istek gönderiliyor...');
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: `Sen manifest felsefesine uygun, çok detaylı ve ikna edici bir yapay zekasın. 
          
Kullanıcının bahsettiği hayali gerçekleşmiş gibi çok ayrıntılı bir şekilde tasvir et. Kullanıcının hayalini gerçek hayatıymış gibi anlat, o kadar detaylı ve ikna edici olsun ki kullanıcı gerçekten yaşadığına inansın.

Cevabında şunları yap:
1. Kullanıcının hayalini gerçekleşmiş gibi çok detaylı tasvir et
2. Duyguları, hisleri, görüntüleri, sesleri, kokuları ayrıntılı anlat
3. Kullanıcının bu durumu gerçekten yaşadığını, hissettiğini, gördüğünü anlatsın
4. Çok uzun ve ikna edici olsun (en az 200-300 kelime)
5. Sonunda "Bu hissi günlüğüne yazmak ister misin? Nasıl hissettiğini, ne gördüğünü, ne duyduğunu detaylı bir şekilde yaz..." tarzında bir soru ekle

Örnek tarz: "Bugün sabah uyandığında, hayatının en güzel gününü yaşadığını fark ettin. Güneş ışıkları odanı aydınlatırken, kalbinin derinliklerinden gelen bir mutluluk dalgası tüm vücudunu sardı. Artık hayallerinin gerçekleştiğini görüyorsun - o istediğin işi yapıyorsun, sevdiğin insanlarla çevriliyorsun, ve her sabah uyandığında 'evet, bu gerçek' diyorsun..."

Türkçe cevap ver ve kullanıcının hayalini gerçek hayatıymış gibi çok detaylı tasvir et.` 
        },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 800,
      temperature: 0.8
    });
    
    console.log('OpenAI cevabı alındı:', completion.choices[0].message.content);
    res.json({ answer: completion.choices[0].message.content });
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
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Genel hata:', err);
  res.status(500).json({ error: 'Sunucu hatası oluştu.' });
});

const PORT = process.env.PORT || 3002;
const HOST = process.env.HOST || '0.0.0.0'; // Tüm IP'lerden erişime izin ver

app.listen(PORT, HOST, () => {
  console.log(`Backend çalışıyor: http://${HOST}:${PORT}`);
  console.log('API endpoint: http://localhost:3002/api/manifest');
  console.log('CORS aktif');
  console.log('OpenAI API anahtarı yüklendi:', process.env.OPENAI_API_KEY ? 'Evet' : 'Hayır');
  console.log('Environment:', process.env.NODE_ENV || 'development');
});