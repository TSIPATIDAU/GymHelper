# Voima - Treeniloki 💪

Nopea, selkeä ja mobiilioptimoitu treeniloki ja edistymisen seuranta (PWA). Sovellus toimii suoraan selaimessa ja tallentaa treenidatan lokaalisti, joten se on salamannopea ja käytettävissä ilman ulkoisia API-riippuvuuksia.

## Ominaisuudet

- 🏋️ **Treenien kirjaaminen:** Sarjat, toistot, painot, edellisten sarjojen pikakopiointi ja automaattiset PR-merkinnät (Personal Record).
- 📋 **Treenihistoria:** Selkeä aikajana menneistä treeneistä, lepopäivistä ja muista aktiviteeteista.
- 💧 **Nesteytys & Kreatiini:** Päivittäisen vedenjuonnin ja kreatiiniannoksen seuranta pikapainikkeilla sekä automaattisella keskiyön nollauksella.
- 🏆 **Voimatasot & SBD-laskuri:** Laskee tason (Beginner, Intermediate, Advanced, Elite jne.) kyykyn, penkin ja maastavedon yhteistuloksesta suhteessa omaan painoon.
- 📱 **PWA-tuki (Progressive Web App):** Voidaan asentaa suoraan puhelimen kotinäytölle kuin natiivisovellus.
- ⚡ **100 % Nopea & Lokaali:** Ei vaadi ulkoisia tekoäly- tai API-avaimia toimiakseen.
- 🔐 **Valinnainen salasanasuojaus:** Mahdollisuus asettaa pääsykoodi sovelluksen avaamiseen julkisessa verkossa.

---

## Paikallinen kehitys

### Vaatimukset
- Node.js 18+
- npm

### Käynnistys

```bash
npm install
npm run dev
```

Sovellus aukeaa osoitteeseen `http://localhost:5173`.

### Ympäristömuuttujat (Valinnainen)

Jos haluat suojata sovelluksen salasanalla, luo `.env`-tiedosto:

```env
# Valinnainen: suojaa sovelluksen lukitusnäytöllä
VITE_APP_PASSWORD=oma_salasana
```

---

## PWA-asennus puhelimeen

Voit asentaa sovelluksen kotivalikkoon ilman sovelluskauppoja:

### iOS (iPhone / Safari)
1. Avaa sovellus Safari-selaimella.
2. Paina alareunasta **Jaa**-kuvaketta (neliö ja nuoli ylöspäin).
3. Valitse listasta **"Lisää kotinäyttöön"** (*Add to Home Screen*).

### Android (Chrome)
1. Avaa sovellus Chrome-selaimella.
2. Paina oikean yläkulman kolmea pistettä (valikko).
3. Valitse **"Asenna sovellus"** tai **"Lisää aloitusnäyttöön"**.

