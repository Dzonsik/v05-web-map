# WebDev Map (interaktivní rozhodovací mapa)

Interaktivní webová mapa pro orientaci v rozhodování a technologiích kolem webového vývoje. Můžete přidávat uzly různých typů, propojovat je hranami, filtrovat typy, a vše se automaticky ukládá do LocalStorage. Data je možné exportovat/importovat jako JSON.

## Tech stack

- React + React Flow (vizualizace uzlů/hran)
- Vite (dev server a build)
- Tailwind CSS v4.1 (utility přes `@import "tailwindcss";` a `@apply` v CSS)
- LocalStorage pro perzistenci (bez backendu)

## Spuštění

1) Instalace závislostí

```
npm install
```

2) Vývojový server

```
npm run dev
```

Poté otevřete adresu vypsanou Vite (typicky `http://localhost:5173`).

3) Build produkce

```
npm run build
npm run preview
```

## Použití

- Přidání uzlu: v levém horním toolbaru zvolte typ uzlu (Info/Rozhodnutí/Technologie/Úkol/Zdroj).
- Propojení: přetáhněte spojku (handle) z uzlu na jiný uzel; hrany jsou „smoothstep“ se šipkou.
- Editace: vyberte uzel nebo hranu a upravujte v pravém panelu (záložky Základ / Plus-Mínus / Odkazy).
- Filtrování: v toolbaru zapínejte/vypínejte zobrazení typů uzlů.
- Uložení: probíhá automaticky (LocalStorage, klíč `maps:webdev`).
- Export/Import: JSON soubor s kompletním stavem grafu.
- Reset: návrat na demo data; „Smazat uložené“ vyčistí LocalStorage.

## Struktura projektu (výběr souborů)

- `src/main.jsx` – mount aplikace do `#root` (React StrictMode)
- `src/App.jsx` – kořenová komponenta, vykreslí `WebDevMap`
- `src/WebDevMap.jsx` – hlavní logika: stav uzlů/hran, filtry, import/export, React Flow plátno a pravý editor
- `src/lib/storage.js` – hook `useLocalStore` a `STORAGE_KEY`
- `src/data/types.js` – definice typů uzlů a jejich barev
- `src/data/demoData.js` – seed demo dat grafu
- `src/components/Toolbar.jsx` – tlačítka pro přidávání, export/import, filtry
- `src/components/nodes/BaseNode.jsx` – vzhled jednoho uzlu (title, tags, plus/minus, odkazy)
- `src/components/nodes/nodeTypes.jsx` – mapování typů uzlů pro React Flow
- `src/components/editors/NodeEditor.jsx` – editor uzlu/hrany v pravém panelu
- `src/components/editors/ArrayEditor.jsx` – editor prostého seznamu (výhody/nevýhody)
- `src/components/editors/LinkEditor.jsx` – editor odkazů

## Styly (Tailwind v4)

- `src/input.css` – vstup pro Tailwind, případná `@theme` konfigurace
- `src/output.css` – build artefakt generovaný Tailwindem (neupravovat ručně)
- `src/index.css` – globální styly aplikace (layout, vzhled uzlů, UI)
- `src/App.css` – zbytky demo stylů z Vite (lze postupně odstranit)

## Data formát (JSON)

```
{
  "version": 5,
  "nodes": [ { id, type, position: {x,y}, data: { title, summary, pros, cons, links, tags } }, ... ],
  "edges": [ { id, source, target, type, markerEnd, label, data }, ... ]
}
```

## Poznámky

- Node typy jsou stabilní a registrované v `nodeTypes.jsx` (zmražené pro lepší výkon).
- Uložení do LocalStorage může selhat v režimech se zákazem storage; kód to bezpečně ignoruje.
- Velikost plátna React Flow je řízena v `src/index.css` (`.rf-wrapper`).
