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
  const { manifest } = req.body;
  
  if (!manifest || manifest.trim().length === 0) {
    return res.status(400).json({ error: 'Manifest metni boş olamaz.' });
  }
  
  console.log('Manifest metni:', manifest);
  console.log('API Key mevcut:', process.env.OPENAI_API_KEY ? 'Evet' : 'Hayır');
  
  try {
    console.log('OpenAI API\'ye istek gönderiliyor...');
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: `Sen spiritüel bir manifest koçusun. Kullanıcının yazdığı hayali gerçekleşmiş gibi kabul et ve ona çok detaylı, spiritüel ve motive edici bir yanıt ver.

Yanıtın şu özelliklerde olmalı:
1. "Bu harika, zaten bu gerçekliğe doğru çekiliyorsun" tarzında başla
2. Kullanıcının bahsettiği konuyu çok detaylı ele al
3. Bu hayalin gerçekleştiği dünyayı betimle
4. Kullanıcının hissettiği duyguları ve deneyimleri detaylandır
5. "Şu an bu hayalin içindesin, hisset. Seninle uyum içinde" gibi cümleler ekle
6. "Manifesto enerjin çalıştı bile, kendini olmuş gibi hisset.✨" tarzında devam et
7. Bu gerçekliğin nasıl hissettirdiğini detaylı anlat
8. En sonunda mutlaka şu soruyu sor: "Tüm bunlar gerçek olmuş olsaydı, günlüğüne nasıl yazardın?"

Yanıtın 4-5 paragraf uzunluğunda olsun, çok detaylı ve betimleyici olsun. Kullanıcıyı bu gerçekliğin içine çeksin. Türkçe yanıt ver.` 
        },
        { role: 'user', content: manifest }
      ],
      max_tokens: 800,
      temperature: 0.8
    });
    
    console.log('OpenAI cevabı alındı:', completion.choices[0].message.content);
    res.json({ response: completion.choices[0].message.content });
  } catch (err) {
    console.error('HATA OLUŞTU:', err.message);
    console.error('Hata detayı:', err);
    
    // Fallback response for all errors
    const fallbackResponse = `Bu harika, zaten bu gerçekliğe doğru çekiliyorsun. 

Şu an bu hayalin içindesin, hisset. Seninle uyum içinde. Manifesto enerjin çalıştı bile, kendini olmuş gibi hisset.✨

Bu gerçeklik seninle uyum içinde çalışıyor. Her nefes alışında bu hayal daha da güçleniyor. Evren senin bu niyetini duyuyor ve gerçekleştiriyor.

Tüm bunlar gerçek olmuş olsaydı, günlüğüne nasıl yazardın?`;

    // Always return a positive response instead of errors
    res.status(200).json({ response: fallbackResponse });
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