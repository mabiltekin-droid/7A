const { test, expect } = require('@playwright/test');

test.describe('Sınıf ve Okul Platformu - Testler', () => {
  
  // Test 1: Giriş Sayfası Yüklenmesi
  test('giriş sayfası yüklenmeli', async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/index.html');
    await expect(page.locator('.login-container')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Sınıf ve Okul Platformu');
  });

  // Test 2: Dil Butonları Çalışmalı
  test('dil butonları görünmeli', async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/index.html');
    const langButtons = page.locator('.lang-btn');
    await expect(langButtons).toHaveCount(13);
  });

  // Test 3: Admin Girişi
  test('admin girişi çalışmalı', async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/index.html');
    
    await page.fill('#username', 'admin');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');
    
    // Giriş başarılı olmalı
    await expect(page.locator('.login-success-overlay')).toBeVisible({ timeout: 5000 });
  });

  // Test 4: Dashboard Yüklenmesi
  test('dashboard yüklenmeli', async ({ page }) => {
    // Önce giriş yap
    await page.goto('file://' + process.cwd() + '/index.html');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // Dashboard'a yönlendir
    await page.goto('file://' + process.cwd() + '/dashboard.html');
    
    // Sidebar görünmeli
    await expect(page.locator('.sidebar')).toBeVisible();
    await expect(page.locator('.logo')).toContainText('Sınıf ve Okul Platformu');
  });

  // Test 5: Karanlık Mod Toggle
  test('karanlık mod toggle çalışmalı', async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/dashboard.html');
    
    const darkModeBtn = page.locator('#darkModeToggle');
    await darkModeBtn.click();
    
    // Dark mode class'ı eklenmeli
    await expect(page.locator('body')).toHaveClass(/dark-mode/);
    
    // Toggle butonu değişmeli (moon'dan sun'e)
    await expect(darkModeBtn.locator('i')).toHaveClass(/fa-sun/);
  });

  // Test 6: Dil Seçimi Dropdown
  test('dil seçimi dropdown çalışmalı', async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/dashboard.html');
    
    // Dil dropdown'ını aç
    await page.click('#langBtn');
    await expect(page.locator('#langMenu')).toBeVisible();
    
    // İngilizce butonuna tıkla
    await page.click('button:has-text("English")');
    await expect(page.locator('#langMenu')).not.toBeVisible();
    await expect(page.locator('#currentLang')).toHaveText('EN');
  });

  // Test 7: Sidebar Menü
  test('sidebar menü görünmeli', async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/dashboard.html');
    
    // Nav menü dolu olmalı
    const navItems = page.locator('.nav-item');
    const count = await navItems.count();
    expect(count).toBeGreaterThan(5);
  });

  // Test 8: Dashboard İstatistik Kartları
  test('dashboard istatistik kartları görünmeli', async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/dashboard.html');
    
    // Stat kartları kontrol et
    const statCards = page.locator('.stats-grid .stat-card');
    const count = await statCards.count();
    expect(count).toBeGreaterThan(0);
  });

  // Test 9: Hızlı İşlem Butonları
  test('hızlı işlem butonları görünmeli', async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/dashboard.html');
    
    const quickActions = page.locator('.quick-actions-grid .quick-action-btn');
    const count = await quickActions.count();
    expect(count).toBeGreaterThan(0);
  });

  // Test 10: Sayfa Geçişleri
  test('sayfa geçişleri çalışmalı', async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/dashboard.html');
    
    // Öğrenci sayfasına git
    await page.click('.nav-item:has-text("Öğrenci")');
    await expect(page.locator('.page-title')).toContainText('Öğrenci');
    
    // Notlar sayfasına git
    await page.click('.nav-item:has-text("Not")');
    await expect(page.locator('.page-title')).toContainText('Not');
  });

  // Test 11: Arama Kutusu
  test('arama kutusu görünmeli', async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/dashboard.html');
    
    const searchBox = page.locator('#globalSearch');
    await expect(searchBox).toBeVisible();
    
    // Yazı yazılabilmeli
    await searchBox.fill('test');
    await expect(searchBox).toHaveValue('test');
  });

  // Test 12: Bildirim Butonu
  test('bildirim butonu görünmeli', async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/dashboard.html');
    
    await expect(page.locator('#notificationBtn')).toBeVisible();
    await expect(page.locator('#notificationBtn i')).toHaveClass(/fa-bell/);
  });

  // Test 13: Export Butonu
  test('export butonu görünmeli', async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/dashboard.html');
    
    await expect(page.locator('#exportData')).toBeVisible();
    await expect(page.locator('#exportData i')).toHaveClass(/fa-download/);
  });

  // Test 14: Import Butonu
  test('import butonu görünmeli', async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/dashboard.html');
    
    await expect(page.locator('#importData')).toBeVisible();
    await expect(page.locator('#importData i')).toHaveClass(/fa-upload/);
  });

  // Test 15: Çıkış Butonu
  test('çıkış butonu görünmeli', async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/dashboard.html');
    
    const logoutBtn = page.locator('button:has-text("Çıkış")');
    await expect(logoutBtn).toBeVisible();
  });

  // Test 16: User Avatar ve İsim
  test('kullanıcı bilgileri görünmeli', async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/dashboard.html');
    
    await expect(page.locator('#userAvatar')).toBeVisible();
    await expect(page.locator('#userName')).toBeVisible();
  });

  // Test 17: Sınıf Bilgisi
  test('sınıf bilgisi görünmeli', async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/dashboard.html');
    
    await expect(page.locator('#classInfo')).toBeVisible();
    await expect(page.locator('#classInfo i')).toHaveClass(/fa-school/);
  });

  // Test 18: Mobil Uyumluluk
  test('mobilde düzgün görünmeli', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('file://' + process.cwd() + '/dashboard.html');
    
    // Sidebar gizlenmeli veya mobil menü olmalı
    const appContainer = page.locator('.app-container');
    await expect(appContainer).toBeVisible();
  });

  // Test 19: Hata Mesajı - Yanlış Şifre
  test('yanlış şifre hata vermeli', async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/index.html');
    
    await page.fill('#username', 'admin');
    await page.fill('#password', 'yanlisSifre');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('#loginError')).toBeVisible();
    await expect(page.locator('#loginError')).toContainText('hatalı');
  });

  // Test 20: Tab Geçişleri
  test('giriş tabları çalışmalı', async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/index.html');
    
    // Admin tab aktif
    await expect(page.locator('.login-tab:has-text("Admin")')).toHaveClass(/active/);
    
    // Öğretmen tabına tıkla
    await page.click('.login-tab:has-text("Öğretmen")');
    await expect(page.locator('.login-tab:has-text("Öğretmen")')).toHaveClass(/active/);
    await expect(page.locator('.login-tab:has-text("Admin")')).not.toHaveClass(/active/);
  });
});

test.describe('Sınıf ve Okul Platformu - Performans', () => {
  
  test('sayfa yüklenme süresi kabul edilebilir olmalı', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('file://' + process.cwd() + '/dashboard.html');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    console.log('Sayfa yüklenme süresi: ' + loadTime + 'ms');
    expect(loadTime).toBeLessThan(5000);
  });

  test('JS hatası olmamalı', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('file://' + process.cwd() + '/dashboard.html');
    await page.waitForTimeout(1000);
    
    // Kritik hataları kontrol et
    const criticalErrors = errors.filter(e => !e.includes('favicon'));
    expect(criticalErrors.length).toBe(0);
  });
});