<!-- DEBUG DOSYASI - Browser konsolunda test etmek için -->

## 🐛 Debugging Checklist

### 1. Server Kontrolü
```bash
# Terminal'de çalıştır:
npm start

# Beklenen output:
# GEMINI_API_KEY ayarlandı mı? false veya true
# PORT: 3000
# Sunucu http://localhost:3000 adresinde çalışıyor
```

### 2. Browser Console Test
F12 tuşuna bas, Console sekmesine git ve şunları çalıştır:

```javascript
// Test 1: API çağrısını simüle et
fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'test' })
})
.then(r => r.json())
.then(d => console.log('API Yanıtı:', d))
.catch(e => console.error('API Hatası:', e));
```

**Beklenen çıktılar:**
- ✅ `{ reply: "..." }` → API Key var, çalışıyor
- ❌ `{ error: "API Anahtarı girilmediği..." }` → API Key yok, lokal mod devrede

---

### 3. Button Elements Kontrol
```javascript
// Tüm button'lar yüklü mü?
console.log('chatToggleBtn:', !!document.getElementById('chatToggleBtn'));
console.log('sendChatBtn:', !!document.getElementById('sendChatBtn'));
console.log('chatInput:', !!document.getElementById('chatInput'));
console.log('addNoteBtn:', !!document.getElementById('addNoteBtn'));

// Hepsi "true" döndürmeli
```

---

### 4. Network Requests Kontrol
1. F12 → **Network** sekmesi
2. Chatbot butonuna tıkla
3. `/api/chat` request'ini bul
4. Status code nedir?
   - ✅ 200 = Başarı
   - ❌ 500 = Server hatası (API Key yok)
   - ❌ 404 = Route bulunamadı
   - ❌ 0 = Network/CORS hatası

---

### 5. Event Listeners Kontrol
```javascript
// Özel event'i test et
document.getElementById('chatToggleBtn').click();
// Chat penceresi açılmalı

document.getElementById('sendChatBtn').click();
// Mesaj gönderilmeli (eğer input'ta text varsa)
```

---

### 6. Local Storage Kontrol (Not tutma)
```javascript
// Kaydedilen notlar var mı?
JSON.parse(localStorage.getItem('saffronCurrentNotes'))
```

---

## 📋 Herşey Çalışmıyorsa Kontrol Listesi

- [ ] Server açık mı? (`npm start` çalışması gerekir)
- [ ] Port 3000'de bind ediliyor mu?
- [ ] API Key Render'da ayarlandı mı?
- [ ] Browser console'da hata var mı? (kırmızı yazılar)
- [ ] Network request'ler başarılı mı? (200/201 status)
- [ ] JavaScript dosyası yükledi mi? (script.js load edildi mi?)
- [ ] Firewall/antivirüs port 3000'i bloke ediyor mu?

---

## 🔧 Common Error Çözümleri

### Error: "Cannot read property 'addEventListener' of null"
→ Button HTML'de yok veya ID yanlış
**Çözüm**: `index.html`'de button ID'lerini kontrol et

### Error: "CORS policy: No 'Access-Control-Allow-Origin' header"
→ CORS ayarlanmamış
**Çözüm**: `server.js` başında cors() middleware'i kontrol et (düzeltildi ✅)

### Error: "fetch is not defined"
→ Browser fetch API'yi desteklemiyor (çok eski tarayıcı)
**Çözüm**: Modern tarayıcı kullan (Chrome 45+, Firefox 39+, Safari 10+)

### Butonlara tıklandığında hiçbir şey olmuyor
→ JavaScript hata veriyor
**Çözüm**: 
1. Console'da hata var mı kontrol et
2. Tarayıcıyı yenile (Ctrl+Shift+R)
3. node_modules yeniden yükle (`npm install`)
