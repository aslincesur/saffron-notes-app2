require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Tüm statik dosyaları (HTML, CSS, JS) bu klasörden sun
app.use(express.static(path.join(__dirname)));

// Güvenilir AI Proxy Uç Noktası (Frontend buraya bağlanacak)
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        // Sunucu ortam değişkenlerinden GİZLİ API anahtarını çek ("Render" panelinizden Environment Variables kısmına girilecek)
        const apiKey = process.env.GEMINI_API_KEY;
        
        // Eğer sunucuya şifre girilmemişse Frontend'i uyar ve lokal modla devam etmesini sağla
        if (!apiKey) {
            return res.status(500).json({ error: "Sunucuya API Anahtarı girilmediği için lokal modda çalışılıyor." });
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        
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
