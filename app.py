import json
import csv
import struct
import time
import os
from datetime import datetime, time as dt_time
from pathlib import Path
import threading

import serial
from flask import Flask, jsonify, render_template, Response

app = Flask(__name__)

DATA_DIR = Path(__file__).parent
JSON_PATH = DATA_DIR / "data.json"
CSV_PATH = DATA_DIR / "data.csv"

SERIAL_PORT = os.getenv("SERIAL_PORT", "/dev/ttyACM0")
BAUD_RATE = int(os.getenv("BAUD_RATE", "9600"))

SENSOR_FORMAT = struct.Struct("<ffI")
SENSOR_SIZE = SENSOR_FORMAT.size

latest_data = {
    "temperature": None,
    "humidity": None,
    "timestamp": None,
}

MORNING_START = dt_time(7, 30)
MORNING_END = dt_time(17, 0)
INTERVAL_DAY = 10 * 60
INTERVAL_NIGHT = 30 * 60

def get_sampling_interval():
    now = datetime.now().time()
    if MORNING_START <= now < MORNING_END:
        return INTERVAL_DAY
    return INTERVAL_NIGHT

def init_csv():
    if not CSV_PATH.exists():
        with open(CSV_PATH, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["timestamp", "temperature", "humidity"])

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

def open_serial():
    ports = [SERIAL_PORT]
    if not os.getenv("SERIAL_PORT"):
        ports = ["/dev/ttyACM0", "/dev/ttyUSB0", "COM3"]
    for port in ports:
        try:
            ser = serial.Serial(port, BAUD_RATE, timeout=1)
            print(f"Connected to {port}")
            return ser
        except serial.SerialException:
            print(f"Cannot open {port}, trying next...")
    return None

def read_loop():
    init_csv()
    last_sample = 0
    buffer = bytearray()
    retry_delay = 1

    while True:
        ser = open_serial()
        if ser is None:
            print(f"Retrying in {retry_delay}s...")
            time.sleep(retry_delay)
            retry_delay = min(retry_delay * 2, 30)
            continue

        retry_delay = 1

        while True:
            try:
                chunk = ser.read(SENSOR_SIZE)
                if not chunk:
                    continue
                buffer.extend(chunk)

                while len(buffer) >= SENSOR_SIZE:
                    packet = buffer[:SENSOR_SIZE]
                    buffer = buffer[SENSOR_SIZE:]

                    temperature, humidity, ts = SENSOR_FORMAT.unpack(packet)

                    now_ts = time.time()
                    interval = get_sampling_interval()

                    latest_data["temperature"] = round(temperature, 1)
                    latest_data["humidity"] = round(humidity, 1)
                    latest_data["timestamp"] = datetime.fromtimestamp(now_ts).isoformat()

                    if now_ts - last_sample >= interval:
                        last_sample = now_ts
                        dt_str = datetime.fromtimestamp(now_ts).isoformat()
                        entry = {
                            "timestamp": dt_str,
                            "temperature": round(temperature, 1),
                            "humidity": round(humidity, 1),
                            "arduino_tick": ts,
                        }
                        append_json(entry)
                        append_csv(dt_str, round(temperature, 1), round(humidity, 1))
                        print(f"Saved: {entry}")

            except serial.SerialException:
                print("Serial disconnected, reconnecting...")
                break
            except Exception as e:
                print(f"Error: {e}")

        try:
            ser.close()
        except Exception:
            pass

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
            headers={"Content-disposition": "attachment; filename=data.csv"},
        )
    return Response("", mimetype="text/csv")

if __name__ == "__main__":
    thread = threading.Thread(target=read_loop, daemon=True)
    thread.start()
    app.run(host="0.0.0.0", port=5000, debug=False)
