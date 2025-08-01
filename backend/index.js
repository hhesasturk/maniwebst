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
    'https://maniwebst.vercel.app',
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

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend API çalışıyor!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    apiKeyExists: !!process.env.OPENAI_API_KEY
  });
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/manifest', async (req, res) => {
  console.log('API isteği geldi:', req.body);
  const { userMessage } = req.body;
  
  if (!userMessage || userMessage.trim().length === 0) {
    return res.status(400).json({ error: 'Kullanıcı mesajı boş olamaz.' });
  }
  
  console.log('Kullanıcı mesajı:', userMessage);
  console.log('API Key mevcut:', process.env.OPENAI_API_KEY ? 'Evet' : 'Hayır');
  
  try {
    console.log('OpenAI API\'ye istek gönderiliyor...');
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