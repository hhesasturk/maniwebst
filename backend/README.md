# Maniwebst Backend

Bu backend, maniwebst.com web sitesi için yapay zeka API'sini sağlar.

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Environment dosyası oluşturun:
```bash
cp .env.example .env
```

3. `.env` dosyasını düzenleyin ve OpenAI API anahtarınızı ekleyin:
```
OPENAI_API_KEY=your_openai_api_key_here
PORT=3002
HOST=0.0.0.0
NODE_ENV=production
```

## Çalıştırma

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### PM2 ile Production
```bash
npm install -g pm2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

## API Endpoints

- `POST /api/manifest` - Yapay zeka manifest yanıtı
- `GET /health` - Sunucu durumu kontrolü

## CORS Ayarları

Backend şu domainlerden erişime izin verir:
- https://maniwebst.com
- https://www.maniwebst.com
- http://localhost:3000
- http://localhost:5000

## Logs

PM2 ile çalıştırıldığında loglar `./logs/` klasöründe saklanır.

## Sorun Giderme

1. **API yanıt vermiyor**: OpenAI API anahtarını kontrol edin
2. **CORS hatası**: Domain'in CORS listesinde olduğundan emin olun
3. **Port hatası**: 3002 portunun açık olduğundan emin olun 