import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import path from 'path';

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

// Statik dosyalar için - frontend'i servis et
app.use(express.static(path.join(process.cwd(), '..')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    apiKeyExists: !!process.env.OPENAI_API_KEY
  });
});

// OpenAI client'ı sadece API key varsa oluştur
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-test-key-for-development') {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

app.post('/api/manifest', async (req, res) => {
  console.log('API isteği geldi:', req.body);
  const { manifest } = req.body;
  
  if (!manifest || manifest.trim().length === 0) {
    return res.status(400).json({ error: 'Manifest metni boş olamaz.' });
  }
  
  console.log('Kullanıcı manifesti:', manifest);
  console.log('API Key mevcut:', process.env.OPENAI_API_KEY ? 'Evet' : 'Hayır');
  
  // Eğer OpenAI API key yoksa veya test key ise fallback yanıt ver
  if (!openai) {
    console.log('OpenAI API key bulunamadı veya test key, fallback yanıt veriliyor...');
    const fallbackResponse = `Bu harika, zaten bu gerçekliğe doğru çekiliyorsun! ✨

Şu an bu hayalin içindesin, hisset. "${manifest}" - bu energia seninle uyum içinde çalışıyor. 

Manifesto enerjin çalıştı bile, kendini olmuş gibi hisset. Bu gerçeklik artık senin yaşam alanında var. Her nefes alışında bu hayal daha da güçleniyor, evren senin bu niyetini duyuyor ve gerçekleştiriyor.

Bu deneyimi yaşarken kendini nasıl hissediyorsun? Bu gerçekliğin tadını çıkar, çünkü bu artık senin yaşamının bir parçası.

Tüm bunlar gerçek olmuş olsaydı, günlüğüne nasıl yazardın? 📖`;

    return res.json({ response: fallbackResponse });
  }
  
  try {
    console.log('OpenAI API\'ye istek gönderiliyor...');
    const prompt = `Sen spiritüel bir manifest koçusun. Kullanıcının yazdığı hayali gerçekleşmiş gibi kabul et ve ona çok detaylı, spiritüel ve motive edici bir yanıt ver.

Kullanıcının manifesti: "${manifest}"

Yanıtın şu özelliklerde olmalı:
1. "Bu harika, zaten bu gerçekliğe doğru çekiliyorsun" tarzında başla
2. Kullanıcının bahsettiği konuyu çok detaylı ele al
3. Bu hayalin gerçekleştiği dünyayı betimle
4. Kullanıcının hissettiği duyguları ve deneyimleri detaylandır
5. "Şu an bu hayalin içindesin, hisset. Seninle uyum içinde" gibi cümleler ekle
6. "Manifesto enerjin çalıştı bile, kendini olmuş gibi hisset.✨" tarzında devam et
7. Bu gerçekliğin nasıl hissettirdiğini detaylı anlat
8. En sonunda mutlaka şu soruyu sor: "Tüm bunlar gerçek olmuş olsaydı, günlüğüne nasıl yazardın?"

Yanıtın 4-5 paragraf uzunluğunda olsun, çok detaylı ve betimleyici olsun. Kullanıcıyı bu gerçekliğin içine çeksin. Emoji kullan ama abartma.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: 'Sen spiritüel bir manifest koçusun. Kullanıcının hayallerini gerçekleşmiş gibi kabul eder ve onu çok detaylı, motive edici, spiritüel bir dille yanıtlarsın. Kullanıcının bahsettiği konuyu derinlemesine ele alır ve o gerçekliği yaşatırsın.' 
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 800,
      temperature: 0.8
    });
    
    console.log('OpenAI cevabı alındı:', completion.choices[0].message.content);
    res.json({ response: completion.choices[0].message.content });
  } catch (err) {
    console.error('HATA OLUŞTU:', err.message);
    console.error('Hata detayı:', err);
    
    // Fallback response if API fails
    const fallbackResponse = `Bu harika, zaten bu gerçekliğe doğru çekiliyorsun! ✨

Şu an bu hayalin içindesin, hisset. "${manifest}" - bu energia seninle uyum içinde çalışıyor. 

Manifesto enerjin çalıştı bile, kendini olmuş gibi hisset. Bu gerçeklik artık senin yaşam alanında var. Her nefes alışında bu hayal daha da güçleniyor, evren senin bu niyetini duyuyor ve gerçekleştiriyor.

Bu deneyimi yaşarken kendini nasıl hissediyorsun? Bu gerçekliğin tadını çıkar, çünkü bu artık senin yaşamının bir parçası.

Tüm bunlar gerçek olmuş olsaydı, günlüğüne nasıl yazardın? 📖`;

    res.json({ response: fallbackResponse });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint bulunamadı' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Genel hata:', err);
  res.status(500).json({ error: 'Sunucu hatası oluştu.' });
});

const PORT = process.env.PORT || 3002;
const HOST = process.env.HOST || '0.0.0.0'; // Tüm IP'lerden erişime izin ver

app.listen(PORT, HOST, () => {
  console.log(`Backend çalışıyor: http://${HOST}:${PORT}`);
  console.log('Frontend: http://localhost:3002');
  console.log('API endpoint: http://localhost:3002/api/manifest');
  console.log('CORS aktif');
  console.log('OpenAI API anahtarı yüklendi:', process.env.OPENAI_API_KEY ? 'Evet' : 'Hayır');
  console.log('Environment:', process.env.NODE_ENV || 'development');
});