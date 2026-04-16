require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS konfigürasyonu - Render'da çalışması için
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:5000', process.env.CLIENT_URL || '*'],
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// Tüm statik dosyaları (HTML, CSS, JS) bu klasörden sun
app.use(express.static(path.join(__dirname)));

// Debug: API Key kontrol
console.log('GEMINI_API_KEY ayarlandı mı?', !!process.env.GEMINI_API_KEY);
console.log('PORT:', PORT);

// Güvenilir AI Proxy Uç Noktası (Frontend buraya bağlanacak)
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        // 1. API anahtarını al ve görünmez boşluklardan arındır
        const apiKey = process.env.GEMINI_API_KEY?.trim();
        
        // Eğer sunucuya şifre girilmemişse Frontend'i uyar ve lokal modla devam etmesini sağla
        if (!apiKey) {
            console.error('❌ GEMINI_API_KEY ortam değişkeni tanınmamış!');
            return res.status(500).json({ 
                error: "Sunucuya API Anahtarı girilmediği için lokal modda çalışılıyor. Render Environment Variables'a ekle!",
                debug: process.env.NODE_ENV
            });
        }

        // 2. URL'yi en güncel model ismiyle ve sıfır boşlukla oluştur
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-latest:generateContent?key=${apiKey}`;
        
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            "contents": [{
              "parts": [{
                "text": `Sen, bir not tutma uygulamasının 'İlham Perisi' adlı asistanısın. Kullanıcıya not yazması konusunda ilham vermeli, kısa, nazik ve çok yaratıcı konuşmalısın. Soru: ${message}`
              }]
            }]
          })
        });

        if (!response.ok) {
            throw new Error(`Google API reddetti: ${response.status}`);
        }
        
        const data = await response.json();
        const botText = data.candidates[0].content.parts[0].text;
        
        // Sadece temizlenmiş metni frontend'e geri gönder
        res.json({ reply: botText });
        
    } catch (error) {
        console.error("Backend Hatası:", error);
        res.status(500).json({ error: "İlham perilerine ulaşılamadı." });
    }
});

// Geri kalan her istek için ana sayfayı yolla (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
