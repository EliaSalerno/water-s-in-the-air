
#  Water's in the Air - Monitoraggio Climatologico

Sistema di monitoraggio di temperatura e umidità per aule scolastiche basato sull'ecosistema **Arduino + Raspberry Pi**.

---

##  Struttura del Progetto

```text
pr_water_s_in_the_air/
│
├── app.py                  # Flask Web App + logica di acquisizione seriale
├── data.json               # Dati storici in formato JSON (per il frontend)
├── data.csv                # Tabella dati in formato CSV (per Excel)
├── README.md               # Documentazione del progetto
│
├── arduino/
│   └── sketch.ino          # Firmware per la scheda Arduino
│
├── templates/
│   ├── index.html          # Dashboard web principale
│   └── img/                # Risorse grafiche per il sito web
│
└── template_old/           # Template di riferimento per il frontend

```

---

##  Come Funziona

1. **Hardware (Arduino)**: Rileva i dati ambientali (Pin `D2` per DHT11) e invia pacchetti binari strutturati via USB (Seriale).
2. **Server (Raspberry Pi)**: Esegue lo script `app.py` che si occupa di:
* Leggere e decodificare i dati dalla porta seriale.
* Salvare i record storici in formato JSON e CSV con campionamento intelligente:
* **Ogni 10 minuti** nella fascia diurna (07:30 - 17:00).
* **Ogni 30 minuti** nella fascia notturna (17:00 - 07:30).


* Avviare un server web Flask per mostrare i dati sulla porta `5000`.



---

##  Installazione ed Esecuzione

### 1. Installazione delle dipendenze

Assicurati di avere Python installato sul Raspberry Pi, quindi installa i pacchetti necessari:

```bash
pip install flask pyserial

```

### 2. Avvio dell'applicazione

```bash
python app.py

```

Una volta avviato, apri il browser e naviga all'indirizzo: `http://<ip-raspberry>:5000`

---

##  Configurazione Porta Seriale

Il sistema gestisce la comunicazione seriale in modo flessibile. È possibile forzare i parametri tramite **variabili d'ambiente**:

```bash
# Specifica una porta seriale dedicata
export SERIAL_PORT=/dev/ttyACM0

# Personalizza il Baud rate (Default: 9600)
export BAUD_RATE=115200

# Avvia l'applicazione con la nuova configurazione
python app.py

```

>  **Fallback Automatico:** Se non viene specificata alcuna variabile d'ambiente, lo script tenterà automaticamente di connettersi a una delle seguenti porte di default: `/dev/ttyACM0`, `/dev/ttyUSB0`, oppure `COM3` (Windows).

---

##  Funzionalità Frontend

La dashboard web è strutturata in due sezioni principali:

###  Dashboard (Dati Live)

* **Cards riassuntive**: Monitoraggio in tempo reale di temperatura e umidità.
* **Grafico combinato**: Visualizzazione di temperatura e umidità su un grafico a doppio asse Y.
* **Tabella Real-time**: Elenco delle ultime 20 letture effettuate.
* **Auto-refresh**: Aggiornamento automatico dei dati della pagina ogni 10 secondi.

###  Analisi (Dati Storici)

* **Soglie limite**: Configurazione personalizzata dei range ideali di temperatura e umidità per evidenziare anomalie (le impostazioni vengono salvate localmente nel browser).
* **Filtri avanzati**: Filtraggio dei dati storici per data, ora, temperatura e umidità.
* **Grafici storici**: Analisi temporale singola (solo temperatura, solo umidità) o combinata.
* **Tabella interattiva**: Evidenziazione automatica in **rosso** delle righe fuori soglia con relativo indicatore visivo di allarme.
* **Esportazione dati**: Pulsante dedicato per scaricare i dati filtrati direttamente in formato `.csv`.

---

##  Specifiche Hardware

| Componente | Tipo Sensore | Pin Arduino | Note |
| --- | --- | --- | --- |
| **DHT11** | Temperatura e Umidità | **D2** | Sensore digitale ambientale |

---

## Nuovo aggiornamento — DHT11 diretto su Raspberry Pi

Il progetto è stato revisionato: ora il DHT11 si collega direttamente al **GPIO del Raspberry Pi** eliminando la scheda Arduino.

### Struttura aggiornata (`repo_dht11_rasp/`)

```text
repo_dht11_rasp/
├── app.py                 # Flask + lettura DHT11 + scheduler
├── requirements.txt       # Dipendenze Python
├── plan.md                # Piano di lavoro
├── link.md                # Documentazione e riferimenti utili
└── templates/
    ├── index.html         # Dashboard web (Chart.js)
    └── data/
        ├── dht_readings.json   # Storico JSON
        └── dht_readings.csv    # Storico CSV
```

### Novità

- **Niente più Arduino**: il DHT11 è collegato direttamente al GPIO4 del Raspberry Pi.
- **Libreria**: `adafruit-circuitpython-dht` invece di `pyserial`.
- **Modalità simulazione**: variabile d'ambiente `DHT_SIMULATE=1` per test su PC senza sensore.
- **Durata 48h**: la raccolta dati si interrompe dopo 48 ore, il server web resta attivo.
- **Dati in `templates/data/`**: JSON e CSV separati dal vecchio progetto.

### Installazione nuove dipendenze

```bash
cd repo_dht11_rasp
pip install -r requirements.txt
sudo apt-get install libgpiod2
```

### Collegamento DHT11 ↔ Raspberry Pi

| Sensore | Pin Raspberry Pi |
|---------|-----------------|
| DATA    | GPIO4 (pin 7)   |
| VCC     | 3.3V o 5V       |
| GND     | GND (pin 6)     |

### Avvio

```bash
cd repo_dht11_rasp
python app.py
```

Per test con dati simulati:

```bash
DHT_SIMULATE=1 python app.py      # Linux/Mac
$env:DHT_SIMULATE=1; python app.py # Windows PowerShell
```

### API Endpoint

| Route | Output |
|-------|--------|
| `/api/latest` | Ultima lettura: `{"temperature": ..., "humidity": ..., "timestamp": "..."}` |
| `/api/data` | Array JSON completo |
| `/api/export` | CSV scaricabile |
