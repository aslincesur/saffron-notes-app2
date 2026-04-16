# Stage 1: Standard Node JS environment
FROM node:18-alpine

# Uygulama klasörü oluştur
WORKDIR /usr/src/app

# Package dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Kalan tüm dosyaları sunucuya kopyala
COPY . .

# Render sisteminin de gördüğü standart Express portu
EXPOSE 3000

# Uygulamayı başlat komutu
CMD ["npm", "start"]
