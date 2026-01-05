# VoimaAI 💪

AI-pohjainen treeniapuri ja valmentaja. Seuraa treenejäsi, saa palautetta ja keskustele AI-valmentajan kanssa!

## Ominaisuudet

- 🏋️ Treenien seuranta (sarjat, toistot, painot)
- 🤖 AI-valmentaja (Aino tai Arnold Schwarzenegger!)
- 📊 Treenihistoria ja analytiikka
- 💧 Veden ja kreatiinin seuranta
- 🔐 Salasanasuojaus

## Asennus (kehittäjille)

### Paikalliset vaatimukset
- Node.js 18+
- npm

### Käynnistys

```bash
npm install
npm run dev
```

### Ympäristömuuttujat

Luo `.env`-tiedosto projektin juureen:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_APP_PASSWORD=optional_lock_screen_password
```

## Julkaisu (Vercel)

1. Pushaa koodi GitHubiin
2. Yhdistä repo Verceliin
3. Aseta ympäristömuuttujat Vercelin dashboardissa:
   - `VITE_GEMINI_API_KEY`
   - `VITE_APP_PASSWORD`
4. Deploy!

## PWA-asennus puhelimeen

1. Avaa sovellus selaimessa
2. iOS: Safari → Jaa → "Lisää kotinäyttöön"
3. Android: Chrome → ⋮ → "Asenna sovellus"

---

Tehty ❤️ ja AI:n avulla
