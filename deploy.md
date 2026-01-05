# VoimaAI - Mobiiliasennus-opas

VoimaAI on suunniteltu toimimaan parhaiten mobiililaitteilla. Voit käyttää sitä joko suoraan selaimessa tai asentaa sen puhelimeesi sovelluksena.

## Tapa 0: Julkaisu Verceliin (Pilvipalvelu)

Ennen kuin voit asentaa sovelluksen puhelimeen, se on julkaistava internetiin. Suosittelemme Vercel-palvelua.

### 1. Projektin vieminen Verceliin
1. Lataa koodi GitHubiin, GitLabiin tai BitBucketiin.
2. Kirjaudu [Vercel.com](https://vercel.com) ja valitse "Add New..." -> "Project".
3. Valitse repositoriosi listasta.

### 2. Ympäristömuuttujien asettaminen (TÄRKEÄÄ)
Vercelin "Environment Variables" -kohdassa, lisää seuraavat avaimet:

- **VITE_GEMINI_API_KEY**: Sinun Google Gemini API -avaimesi.
- **VITE_APP_PASSWORD**: Salasana, jolla suojaat sovelluksen ulkopuolisilta.

Sovellus **ei toimi** ilman näitä asetuksia. Salasana vaaditaan nyt aina julkisessa verkossa.

---

## Tapa 1: PWA - "Lisää kotinäyttöön" (Suositeltu)
Tämä on nopein tapa saada sovellus kännykkään ilman sovelluskauppoja:

### iOS (iPhone/iPad)
1. Avaa sovellus **Safari**-selaimella.
2. Paina **Jaa**-painiketta (neliö, jossa nuoli ylöspäin).
3. Selaa valikkoa alaspäin ja valitse **"Lisää kotinäyttöön"**.
4. Vahvista painamalla "Lisää". Sovellus ilmestyy aloitusnäytöllesi.

### Android
1. Avaa sovellus **Chrome**-selaimella.
2. Paina kolmea pistettä oikeassa yläkulmassa.
3. Valitse **"Asenna sovellus"** tai **"Lisää aloitusnäyttöön"**.
4. Seuraa ohjeita ja sovellus löytyy hetken kuluttua sovellusvalikostasi.

---

## Tapa 2: Natiivisovellukseksi kääntäminen (Edistyneet)
Jos haluat rakentaa varsinaisen `.apk` (Android) tai `.ipa` (iOS) tiedoston, käytä **Capacitor**-työkalua:

1. **Alustus:**
   ```bash
   npm install @capacitor/core @capacitor/cli
   npx cap init
   ```

2. **Rakenna web-projekti:**
   ```bash
   npm run build
   ```

3. **Lisää alustat:**
   ```bash
   npm install @capacitor/android @capacitor/ios
   npx cap add android
   npx cap add ios
   ```

4. **Kopioi tiedostot ja avaa kehitysympäristö:**
   - **Android (vaatii Android Studion):**
     ```bash
     npx cap copy
     npx cap open android
     ```
   - **iOS (vaatii Xcoden ja Mac-tietokoneen):**
     ```bash
     npx cap copy
     npx cap open ios
     ```

5. **Kääntäminen:**
   Käytä Android Studiota tai Xcodea kääntääksesi projektin lopulliseksi asennustiedostoksi. Muista asettaa tarvittavat oikeudet kameralle ja mikrofonille, jos käytät sovelluksen AI-ominaisuuksia laajasti.