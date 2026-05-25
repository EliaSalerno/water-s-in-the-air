# Water's in the Air - Monitoraggio Climatologico

Sistema di monitoraggio di temperatura e umidit&agrave; per aule scolastiche basato su **Arduino + Raspberry Pi**.

## Struttura del Progetto

```
pr_water_s_in_the_air/
│   app.py              (Flask Web App + logica acquisizione)
│   data.json           (Dati storici per il frontend)
│   data.csv            (Tabella per Excel)
│   README.md
├───arduino/
│       sketch.ino      (Sketch per Arduino)
├───templates/
│       index.html      (Dashboard web)
│       img/            (Immagini per il sito)
└───template_old/       (Template di riferimento frontend)
```

## Come Funziona

1. **Arduino** (pin D2 = DHT11) invia pacchetti binari via USB.
2. **Raspberry Pi** esegue `app.py` che:
   - Legge i dati dalla porta seriale
   - Li salva ogni **10 minuti** (7:30-17:00) o **30 minuti** (17:00-7:30) in JSON e CSV
   - Serve una dashboard web sulla porta **5000**

## Esecuzione

```bash
pip install flask pyserial
python app.py
```

Aprire il browser su `http://<ip-raspberry>:5000`.

## Configurazione Porta Seriale

La porta seriale &egrave; configurabile tramite variabile d'ambiente `SERIAL_PORT`:

```bash
# Porta specifica
export SERIAL_PORT=/dev/ttyACM0
python app.py

# Baud rate personalizzato (default: 9600)
export BAUD_RATE=115200
python app.py
```

Se la variabile non viene impostata, il sistema prova automaticamente: `/dev/ttyACM0`, `/dev/ttyUSB0`, `COM3`.

## Funzionalit&agrave; Frontend

La dashboard web ha due tab:

### Dashboard (Live)
- Cards riassuntive: temperatura, umidit&agrave;
- Grafico combinato temperatura + umidit&agrave; (doppio asse Y)
- Tabella ultime 20 letture
- Aggiornamento automatico ogni 10 secondi

### Analisi (Dati Storici)
- **Soglie limite**: configurazione dei range di temperatura e umidit&agrave; per evidenziare allarmi (salvate nel browser)
- **Filtri**: filtro per data, ora, temperatura e umidit&agrave;
- **Grafici**: temperatura nel tempo, umidit&agrave; nel tempo, grafico combinato
- **Tabella**: dati filtrati con righe fuori soglia evidenziate in rosso e indicatore di allarme
- **Esportazione CSV**: scarica i dati filtrati in formato CSV

## Hardware

| Componente          | Pin Arduino |
|---------------------|-------------|
| DHT11               | D2          |
