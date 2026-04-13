# Playwright Test Kurulumu

## Kurulum

```bash
npm install
npx playwright install
```

## Test Çalıştırma

```bash
# Tüm testleri çalıştır
npm test

# UI modunda çalıştır
npm run test:ui

# Tarayıcı ile çalıştır
npm run test:headed
```

## Test Kapsamı

- ✅ Giriş sayfası yüklenmesi
- ✅ Dil butonları (13 dil)
- ✅ Admin girişi
- ✅ Dashboard yüklenmesi
- ✅ Karanlık mod toggle
- ✅ Dil seçimi dropdown
- ✅ Sidebar menü
- ✅ İstatistik kartları
- ✅ Hızlı işlem butonları
- ✅ Sayfa geçişleri
- ✅ Arama kutusu
- ✅ Bildirim butonu
- ✅ Export/Import butonları
- ✅ Çıkış butonu
- ✅ Kullanıcı bilgileri
- ✅ Mobil uyumluluk
- ✅ Hata mesajları
- ✅ Tab geçişleri
- ✅ Performans testi
- ✅ JS hata kontrolü

## Not

Testler `file://` protokolü ile çalışır. 
İstersen `playwright.config.js` ekleyerek local server üzerinde de çalıştırabilirsin.