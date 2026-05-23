# Monitoraggio Ambientale Smart

Dashboard per il monitoraggio ambientale con visualizzazione di dati relativi a qualità dell'aria, consumo idrico ed energia.

## Struttura del progetto

```
pr_water_s_in_the_air/
├── .git/                   # Repository Git
├── img/                    # Immagini e risorse statiche
│   └── Monitoraggio_Ambientale_Smart.png
├── template/               # Applicazione frontend
│   ├── public/             # Asset pubblici
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ # Componenti React riutilizzabili
│   │   │   ├── types.ts    # TypeScript type definitions
│   │   │   └── utils/      # Funzioni di utilità
│   │   ├── styles/         # Fogli di stile (globals, tailwind, theme, fonts)
│   │   └── main.tsx        # Entry point dell'applicazione
│   ├── guidelines/         # Linee guida del progetto
│   ├── ATTRIBUTIONS.md     # Attribuzioni (shadcn/ui, Unsplash)
│   ├── default_shadcn_theme.css
│   ├── index.html          # HTML principale
│   ├── package.json        # Dipendenze e script
│   ├── pnpm-workspace.yaml
│   ├── postcss.config.mjs
│   └── vite.config.ts      # Configurazione Vite
└── README.md
```

## Tecnologie

- **React 18** + **TypeScript**
- **Vite** come bundler
- **Tailwind CSS 4** per lo styling
- **Material UI (MUI)** e **Radix UI** per componenti UI
- **Recharts** per grafici
- **React Router** per navigazione
- **PapaParse** per parsing CSV

## Esecuzione

```bash
cd template
npm install
npm run dev
```

Il progetto è basato su un design Figma: [Data Visualization Dashboard](https://www.figma.com/design/LD9XAT0MEcmMLYSOlZ3nUN/Data-Visualization-Dashboard).
  