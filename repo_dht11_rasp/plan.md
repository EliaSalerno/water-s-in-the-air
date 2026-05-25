# Piano di Lavoro — Monitoraggio DHT11 con Raspberry Pi
## Obiettivo
Sistema di monitoraggio temperatura/umidità con Raspberry Pi + DHT11, web app Flask, salvataggio JSON+CSV, campionamento differenziato ogni 10/30 minuti.
## Struttura del progetto
repo_dht11_rasp/
├── app.py                 # Flask + lettura DHT11 + scheduler
├── requirements.txt       # Dipendenze Python
├── templates/
│   ├── index.html         # Dashboard (Chart.js) — adattata
│   └── data/
│       ├── dht_readings.json   # Storico JSON
│       └── dht_readings.csv    # Storico CSV
└── plan.md
## Task
### 1. Pulizia repository
- Eliminare `template_old/` (node_modules, codice React, ecc.)
- Creare directory `templates/data/`
### 2. requirements.txt
flask
adafruit-circuitpython-dht
RPi.GPIO
### 3. app.py — Sensore DHT11
- Sostituire lettura da seriale Arduino con `adafruit-circuitpython-dht` su GPIO
- Rimuovere campo `classroomOccupied` e logica Arduino
- Lettura: `dhtDevice.temperature` e `dhtDevice.humidity`
- Gestire errori di lettura (DHT11 può fallire)
### 4. app.py — Scheduler differenziato
- `07:30 <= now < 17:00` → campiona ogni **10 minuti** (600s)
- `17:00 <= now < 07:30` → campiona ogni **30 minuti** (1800s)
- Durata: 48 ore (conteggio con `time.time()` all'avvio + timeout)
- Thread separato (`read_loop`) come nel vecchio progetto
### 5. app.py — Salvataggio dati
- **JSON**: `templates/data/dht_readings.json` — array di oggetti `{timestamp, temperature, humidity}`, append con lettura+scrittura integrale
- **CSV**: `templates/data/dht_readings.csv` — header `timestamp,temperatura,umidita`, append riga per riga
- Entrambi i file tengono lo storico completo (nessuna sovrascrittura)
### 6. app.py — API Flask
| Route | Output |
|-------|--------|
| `/` | `render_template("index.html")` |
| `/api/latest` | `{"temperature": ..., "humidity": ..., "timestamp": "..."}` |
| `/api/data` | Array JSON completo da `dht_readings.json` |
| `/api/export` | CSV scaricabile |
- Avvio su `0.0.0.0:5000`
### 7. templates/index.html — Adattamento
- Rimuovere tutte le referenze a `classroomOccupied`, "classe", "occupata/libera"
- Mantenere:
  - **Dashboard**: cards con temperatura/umidità, grafico Chart.js combinato (ultimi dati), tabella ultimi 20
  - **Analisi**: soglie limite, filtri (data/ora, temperatura, umidità), grafici separati e combinati, tabella dati filtrati, pulsante export CSV filtrato
- Tutto lato client Chart.js via CDN (stessa libreria del progetto originale)
### 8. Test e validazione
- Avviare Flask: `python app.py`
- Verificare endpoint `/api/latest`, `/api/data`, `/api/export`
- Verificare scrittura su JSON e CSV
- Testare filtri e grafici nella web UI
## Specifiche tecniche
- **Libreria DHT11**: `adafruit-circuitpython-dht` su GPIO4 (configurabile)
- **Grafici**: Chart.js 4.x via CDN
- **Flask**: `0.0.0.0:5000`
- **Dati**: `templates/data/`
- **Esecuzione sensore**: thread separato `read_loop` (come vecchio `app.py`)
Quando switchiamo in implementazione, scrivo subito il file. Intanto: che pin GPIO userai per il DHT11? (Default: GPIO4)
