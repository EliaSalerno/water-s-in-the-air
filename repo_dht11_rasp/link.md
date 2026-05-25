# Link e riferimenti utili

## DHT11 + Raspberry Pi

### Libreria Adafruit CircuitPython DHT
- **Documentazione ufficiale**: https://docs.circuitpython.org/projects/dht/en/latest/
- **Repository GitHub**: https://github.com/adafruit/Adafruit_CircuitPython_DHT
- **Installazione**:
  ```bash
  pip install adafruit-circuitpython-dht
  ```
  Su Raspberry Pi serve anche:
  ```bash
  sudo apt-get install libgpiod2
  ```

### Collegamento DHT11 al Raspberry Pi (GPIO)
- **Guida cablaggio**: https://learn.adafruit.com/dht-humidity-sensing-on-raspberry-pi-with-gdocs-logging
- **Pinout Raspberry Pi**: https://pinout.xyz/
  - Default: DHT11 DATA → GPIO4 (pin 7)
  - Alimentazione: 3.3V o 5V (pin 1 o 2)
  - GND: pin 6

### Esempio di lettura con adafruit-circuitpython-dht
```python
import board
import adafruit_dht

dhtDevice = adafruit_dht.DHT11(board.D4)  # GPIO4

while True:
    try:
        temp = dhtDevice.temperature
        hum = dhtDevice.humidity
        print(f"Temp: {temp} C, Umidità: {hum}%")
    except RuntimeError as e:
        print(f"Errore lettura DHT11: {e}")
```

### Alternative: Adafruit_DHT (libreria legacy)
- https://github.com/adafruit/Adafruit_Python_DHT
- Meno mantenuta, ma ancora funzionante su Pi.
- Installazione: `pip install Adafruit_DHT`

---

## Flask

- **Documentazione ufficiale**: https://flask.palletsprojects.com/en/stable/
- **Quickstart**: https://flask.palletsprojects.com/en/stable/quickstart/
- **Template rendering**: https://flask.palletsprojects.com/en/stable/quickstart/#rendering-templates
- **API con JSON**: https://flask.palletsprojects.com/en/stable/quickstart/#apis-with-json

---

## Chart.js (grafici lato client)

- **Documentazione**: https://www.chartjs.org/docs/latest/
- **Esempi**: https://www.chartjs.org/docs/latest/samples/
- **Configurazione assi multipli**: https://www.chartjs.org/docs/latest/axes/#multiple-axes
- **CDN**: https://cdn.jsdelivr.net/npm/chart.js@4

### Esempio grafico combinato temperatura/umidità
```javascript
new Chart(ctx, {
  type: 'line',
  data: {
    labels: timestamps,
    datasets: [
      { label: 'Temperatura (°C)', data: temps, borderColor: '#f97316', yAxisID: 'y' },
      { label: 'Umidità (%)', data: hums, borderColor: '#38bdf8', yAxisID: 'y1' }
    ]
  },
  options: {
    scales: {
      y: { position: 'left', title: { display: true, text: '°C' } },
      y1: { position: 'right', title: { display: true, text: '%' }, grid: { drawOnChartArea: false } }
    }
  }
});
```

---

## Raspberry Pi — Comandi utili

- **Abilitare I2C/GPIO**: `sudo raspi-config` → Interface Options
- **Verificare GPIO**: `gpio readall` o `pinctrl`
- **Eseguire script all'avvio (systemd)**: https://www.raspberrypi.com/documentation/computers/using.html#configuring-init,-systemd
- **Impostare IP statico**: https://www.raspberrypi.com/documentation/computers/configuration.html#static-ip-addresses

---

## Formati dati

- **CSV con Python**: https://docs.python.org/3/library/csv.html
- **JSON con Python**: https://docs.python.org/3/library/json.html
- **datetime / time**: https://docs.python.org/3/library/datetime.html

---

## Debug e test (senza Raspberry Pi)

Per testare l'app Flask senza il DHT11 collegato, si può creare un **simulatore**:

```python
import random
from datetime import datetime

def read_dht_simulated():
    return {
        "temperature": round(random.uniform(18, 30), 1),
        "humidity": round(random.uniform(40, 70), 1),
        "timestamp": datetime.now().isoformat()
    }
```
