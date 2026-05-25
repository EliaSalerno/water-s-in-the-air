# Water's in the Air — Rapporto di Completamento

## Stato iniziale
- Tutti i file scheletro esistenti, progetto funzionante ma incompleto
- `app.py` con porta seriale hardcoded `COM3`, nessuna riconnessione, thread moriva su disconnessione
- `templates/index.html` con dashboard live ma mancanti analisi, filtri, soglie, esportazione
- `template_old/` con progetto React di riferimento Figma (non usato)

## Modifiche effettuate

### 1. `app.py` — Backend Flask
**Obiettivo:** Funzionamento su Raspberry Pi con resilienza seriale

- **Porta seriale configurabile** via env `SERIAL_PORT` (default `/dev/ttyACM0`)
- **Baud rate configurabile** via env `BAUD_RATE` (default `9600`)
- **Fallback automatico**: se `SERIAL_PORT` non impostato, prova: `/dev/ttyACM0` → `/dev/ttyUSB0` → `COM3`
- **Riconnessione automatica**: su `SerialException` il thread non muore ma tenta la riconnessione con backoff esponenziale (1s → 30s max)
- **Nuovo endpoint** `GET /api/export` → scarica `data.csv` come file

### 2. `templates/index.html` — Frontend Dashboard
**Obiettivo:** Unire monitoring live + analisi dati stile template_old in un unico file vanilla (no build step)

**Tab Dashboard (live):**
- Cards riassuntive (temp, umidità, ultimo aggiornamento)
- Grafico combinato temperatura + umidità (Chart.js, doppio asse Y)
- Tabella con ultime 20 letture in ordine inverso
- Auto-refresh ogni 10 secondi

**Tab Analisi (dati storici):**
- **Soglie limite**: 4 input (temp min/max, umidità min/max), persistenza via localStorage
- **Filtri**: 8 input (data da/a, ora da/a, temp min/max, umidità min/max)
- **3 grafici**: temperatura, umidità, combinato (distrutti/ricreati al cambio dati)
- **Tabella**: dati filtrati sorted by timestamp, righe fuori soglia evidenziate in rosso, badge allarme/OK
- **Esportazione CSV**: download lato client dei dati filtrati

**Dettagli tecnici:**
- Chart.js 4 caricato da CDN
- Tema scuro coerente (#0f172a, #1e293b, #38bdf8)
- Nessuna dipendenza/build → zero configurazione

### 3. `arduino/sketch.ino` — Sketch Arduino
- Aggiunto `static_assert(sizeof(SensorPacket) == 16, ...)` per verificare a compile-time che l'allineamento della struct corrisponda al formato Python `"<ff?3xI"`
- Pin: D2 (DHT11)

### 4. `README.md`
- Sezione "Configurazione Porta Seriale" (env vars)
- Sezione "Funzionalità Frontend" (descrizione tab e feature)

## Architettura dati

```
Arduino ──USB──→ app.py (pyserial) ──→ data.json (storico JSON)
                          │                data.csv (storico CSV)
                          │
                     Flask API
                     ├── GET / → templates/index.html
                     ├── GET /api/latest → ultima lettura
                     ├── GET /api/data → tutto il JSON
                     └── GET /api/export → CSV scaricabile
```

**Formato pacchetto seriale** (16 byte):
```
offset 0: float temperature     (4 byte)
offset 4: float humidity        (4 byte)
offset 8: unsigned long timestamp (4 byte)
```

**Campionamento:**
- 7:30-17:00 → ogni 10 minuti
- 17:00-7:30 → ogni 30 minuti

## Pattern da mantenere per modifiche future

1. **Aggiungere un filtro frontend**: modificare `getFilters()` in index.html + `applyFilters()` — la pipeline è: `allData.slice()` → filtri sequenziali → `renderAnalisiTable()` + `renderAnalisiCharts()`

2. **Aggiungere un campo dati**: serve modifica in 3 punti:
   - Arduino struct (`sketch.ino`)
   - Python struct format string (`app.py` — `SENSOR_FORMAT`)
   - Python `append_json` / `append_csv` entry
   - Frontend: `renderAnalisiTable()` e grafici

3. **Modificare soglie default**: cambiare i `value` degli input `limit-*` in index.html (righe ~166-179)

4. **Cambiare intervallo campionamento**: modificare `INTERVAL_DAY` e `INTERVAL_NIGHT` in `app.py`

5. **Aggiungere una nuova API**: creare una nuova route Flask in `app.py` + chiamata fetch in `updateDashboard()` nel frontend

## Dipendenze
- **Python**: `flask`, `pyserial` (standard library per tutto il resto)
- **Frontend**: Chart.js 4 (CDN)
- **Arduino**: libreria DHT sensor library

## Comandi utili
```bash
# Avvio
python app.py

# Con porta specifica
SERIAL_PORT=/dev/ttyACM0 python app.py

# Con baud rate personalizzato
BAUD_RATE=115200 python app.py
```
