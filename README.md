# Interaktivní Mapa pro Orientaci ve Webovém Vývoji

## O projektu

Tato aplikace je interaktivní mapa určená k lepšímu pochopení a orientaci ve světě webového vývoje. Uživatelé mohou prozkoumávat různé koncepty a technologie pomocí vizuálního rozhraní, které umožňuje snadné přidávání, přesouvání a propojování jednotlivých prvků.

## Technologie a Architektura

- **Frontend:** React s využitím knihovny React Flow pro vizualizaci a manipulaci s grafy.
- **Backend:** Žádný backend, veškerá data jsou ukládána lokálně v prohlížeči pomocí LocalStorage.
- **Ukládání dat:** Stav mapy se ukládá do LocalStorage, což umožňuje zachování uživatelských změn mezi relacemi.

## Struktura složek

- `src/` – hlavní zdrojový kód aplikace
  - `components/` – React komponenty aplikace
  - `hooks/` – vlastní React hooky
  - `styles/` – styly aplikace
  - `utils/` – pomocné utility a funkce
- `public/` – statické soubory a assets

## Hlavní komponenty

- **Map** – hlavní komponenta zajišťující vykreslení a správu interaktivní mapy.
- **Node** – komponenta reprezentující jednotlivé uzly na mapě.
- **Controls** – ovládací prvky pro interakci s mapou (zoom, reset, přidání uzlů).
- **Sidebar** – panel s informacemi a možnostmi konfigurace.
- **nodeTypes** – definice typů uzlů, které jsou mimo hlavní komponentu pro lepší přehlednost a výkon.

## Instrukce pro spuštění projektu

1. Klonujte repozitář:
   ```
   git clone <url-repozitáře>
   ```
2. Nainstalujte závislosti:
   ```
   npm install
   ```
3. Spusťte vývojový server:
   ```
   npm start
   ```
4. Otevřete aplikaci v prohlížeči na adrese:
   ```
   http://localhost:3000
   ```

## Poznámky pro vývoj

- **nodeTypes** jsou definovány mimo hlavní komponentu, aby se zabránilo jejich opětovnému vytváření při každém renderu, což zlepšuje výkon.
- Velikost plátna (canvas) je klíčová pro správné fungování mapy a měla by být nastavena tak, aby pokrývala požadovaný prostor pro interakci.
- Ukládání do LocalStorage umožňuje zachovat stav mapy mezi relacemi, ale je potřeba počítat s omezeními velikosti a případným resetem dat.
- Doporučuje se pravidelně testovat aplikaci v různých prohlížečích a zařízeních kvůli kompatibilitě a responzivitě.

---

Tento projekt je otevřený pro další rozvoj a přispění, neváhejte se zapojit!
