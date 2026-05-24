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

1. **Arduino** (pin D2 = DHT11, pin D3 = sensore prossimit&agrave;) invia pacchetti binari via USB.
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

## Hardware

| Componente          | Pin Arduino |
|---------------------|-------------|
| DHT11               | D2          |
| Sensore prossimit&agrave; | D3    |
