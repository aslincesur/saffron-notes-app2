# Render Deployment ve Configuration Rehberi

## 🔑 Environment Variables Ayarlanması

Render'da uygulamayı deploy ettikten sonra, şu adımları takip et:

### 1. Render Dashboard'a Git
- yaklasik olarak `https://dashboard.render.com`enza git

### 2. Deployed Service'i Seç
- "Web Services" → Senin service ismini tıkla (örn: `saffron-notes-app`)

### 3. Environment Variables Ekle
- **Settings** sekmesine tıkla
- **Environment** bölümüne git
- **Add Environment Variable** butonuna tıkla

### 4. Gerekli Environment Variables
Şu variable'ları ekle:

```
GEMINI_API_KEY = "YOUR_ACTUAL_API_KEY_HERE"
```

### Değerleri Nerede Bulacağın:
1. **GEMINI_API_KEY**: 
   - Google AI Studio'ya git → https://aistudio.google.com/app/apikeys
   - "Create API Key" → Copy API Key
   - Render'a yapıştır (Kesinlikle **değeri değişme**, aynen kopyala)

### 5. Deploy'u Redeploy Et
- **Redeploy latest commit** butonuna tıkla
- Sistem yeniden başlayacak ve environment variables'ı yükleyecek

---

## 🧪 Test Etme

### Tarayıcı Konsolunda Test:
1. Siteni aç
2. **F12** tuşu ile Developer Tools aç
3. **Console** sekmesine git
4. Chatbot butonuna tıkla ("✨" butonu)
5. Bir mesaj yaz ve gönder

### Beklenen Sonuçlar:
- ✅ **API Key doğru**: Bot yapay zeka yanıtı verecek
- ❌ **API Key yok/yanlış**: Bot lokal fallback response verecek (önceden hazırlanmış cevaplar)

### Console'da Hata Kontrol:
1. Console'da herhangi bir **kırmızı hata** var mı?
2. Varsa, hata mesajını oku ve not et

---

## 🚀 Yaygın Sorunlar ve Çözümleri

### Sorun 1: "Sunucuya API Anahtarı girilmediği..." mesajı
**Neden**: Environment variable ayarlanmamış
**Çözüm**: Yukarıdaki RENDER_SETUP adımlarını takip et ve GEMINI_API_KEY ekle

### Sorun 2: Butonlara tıklandığında hiçbir şey olmaz
**Neden**: JavaScript load edilmemiş veya hata var
**Çözüm**: 
- Tarayıcı konsolunda (F12) hata var mı kontrol et
- Network sekmesinde `/api/chat` request'i başarı bulmuş mu bak (200 status?)

### Sorun 3: CORS Hatasız ama yanıt boş
**Neden**: Google API hata dönmüş olabilir
**Çözüm**: 
- API Key'in doğru mu kontrol et
- Google AI'nin rate limit'e basılmamış mı kontrol et

---

## 📝 Notlar
- Her değişiklikten sonra **Redeploy latest commit** yapmalısın
- Environment Variable değişiklikleri yeni deploy'dan sonra etkin olur
- Local test için `.env` dosyası oluşturabilirsin (Git'e commit'leme!)

```env
GEMINI_API_KEY=your_test_key_here
PORT=3000
```
