import json
import csv
import time
import os
import threading
from datetime import datetime, time as dt_time
from pathlib import Path

from flask import Flask, jsonify, render_template, Response

SIMULATE = os.getenv("DHT_SIMULATE", "0") == "1"

try:
    import board
    import adafruit_dht
    if SIMULATE:
        raise ImportError("simulated mode")
    dht_device = adafruit_dht.DHT11(board.D4)
    print("DHT11 rilevato su GPIO4")
except (ImportError, NotImplementedError, RuntimeError):
    dht_device = None
    if not SIMULATE:
        print("DHT11 non disponibile — attiva la modalità simulazione con DHT_SIMULATE=1")
    else:
        print("Modalità simulazione attiva")

app = Flask(__name__)

DATA_DIR = Path(__file__).parent / "templates" / "data"
JSON_PATH = DATA_DIR / "dht_readings.json"
CSV_PATH = DATA_DIR / "dht_readings.csv"

MORNING_START = dt_time(7, 30)
MORNING_END = dt_time(17, 0)
INTERVAL_DAY= 10
# INTERVAL_DAY = 10 * 60
INTERVAL_NIGHT = 30 * 60
DURATION_HOURS = 48

latest_data = {
    "temperature": None,
    "humidity": None,
    "timestamp": None,
}

start_time = time.time()

def get_sampling_interval():
    now = datetime.now().time()
    if MORNING_START <= now < MORNING_END:
        return INTERVAL_DAY
    return INTERVAL_NIGHT

def init_csv():
    if not CSV_PATH.exists():
        CSV_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(CSV_PATH, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["timestamp", "temperatura", "umidita"])

def append_csv(timestamp, temperature, humidity):
    with open(CSV_PATH, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([timestamp, temperature, humidity])

def append_json(entry):
    if JSON_PATH.exists():
        with open(JSON_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
    else:
        data = []
    data.append(entry)
    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

def read_dht():
    if dht_device is None:
        import random
        return round(random.uniform(18, 30), 1), round(random.uniform(40, 70), 1)
    for _ in range(5):
        try:
            temp = dht_device.temperature
            hum = dht_device.humidity
            if hum is not None and temp is not None:
                return round(temp, 1), round(hum, 1)
        except RuntimeError as e:
            print(f"Errore lettura DHT11: {e}, ritento...")
        time.sleep(1)
    return None, None

def read_loop():
    init_csv()
    last_sample = 0

    while True:
        elapsed = time.time() - start_time
        if elapsed > DURATION_HOURS * 3600:
            print(f"Campionamento completato ({DURATION_HOURS}h). In attesa...")
            time.sleep(60)
            continue

        temperature, humidity = read_dht()

        now_ts = time.time()
        interval = get_sampling_interval()

        dt_str = datetime.fromtimestamp(now_ts).isoformat()
        latest_data["temperature"] = temperature
        latest_data["humidity"] = humidity
        latest_data["timestamp"] = dt_str

        if temperature is not None and humidity is not None:
            if now_ts - last_sample >= interval:
                last_sample = now_ts
                entry = {
                    "timestamp": dt_str,
                    "temperature": temperature,
                    "humidity": humidity,
                }
                append_json(entry)
                append_csv(dt_str, temperature, humidity)
                print(f"Salvato: {entry}")
        else:
            print("Lettura DHT11 fallita, nuovo tentativo al prossimo ciclo...")

        time.sleep(5)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/latest")
def api_latest():
    return jsonify(latest_data)

@app.route("/api/data")
def api_data():
    if JSON_PATH.exists():
        with open(JSON_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
        return jsonify(data)
    return jsonify([])

@app.route("/api/export")
def api_export():
    if CSV_PATH.exists():
        with open(CSV_PATH, "r", encoding="utf-8") as f:
            csv_data = f.read()
        return Response(
            csv_data,
            mimetype="text/csv",
            headers={"Content-disposition": "attachment; filename=dht_readings.csv"},
        )
    return Response("", mimetype="text/csv")

if __name__ == "__main__":
    thread = threading.Thread(target=read_loop, daemon=True)
    thread.start()
    app.run(host="0.0.0.0", port=5000, debug=False)
