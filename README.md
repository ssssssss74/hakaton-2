# E-Tergov Lab | HMQA — Virtual Tergov Simulyatori

Huquqni muhofaza qilish akademiyasi (HMQA) «Kiberxavfsizlikni huquqiy ta’minlash» magistraturasi uchun 3D hodisa joyi, raqamli dalil zanjiri (JPK 204²), kiber-izlar tahlili, AI-so‘roq va virtual sud simulyatori.

## 1. Lokal (Internetsiz / Tezkor) Ishga Tushirish

Taqdimot vaqtida internet sustlashishi yoki uzilishidan qat’i nazar tizim to‘liq oflayn (PWA + lokal fallback) rejimda ishlaydi:

```bash
npm install
npm run build
npm run preview -- --port 3000 --host
```

Brauzerda `http://localhost:3000` ni oching (Chrome/Edge manzil satridagi **Lokal o‘rnatish** tugmasi orqali dasturni noutbukka PWA sifatida o‘rnatib olish ham mumkin — shundan keyin internet o‘chirilganda ham 100% ishlaydi).

## 2. GitHub ga yuklash

```bash
git init
git add .
git commit -m "E-Tergov Lab HMQA production ready"
git branch -M main
git remote add origin https://github.com/<USERNAME>/<REPO_NOMI>.git
git push -u origin main
```

## 3. Netlify ga joylash (1 klikda)

- **GitHub orqali**: Netlify -> *Add new site* -> *Import an existing project* -> GitHub repozitoriyni tanlang (`netlify.toml` avtomatik `npm run build` va `dist` ni sozlaydi).
- **Tezkor Drag & Drop**: `npm run build` bajaring va hosil bo‘lgan `dist/` papkasini Netlify *Drop* oynasiga tashlang (`public/_redirects` ichiga qo‘shilgan).
