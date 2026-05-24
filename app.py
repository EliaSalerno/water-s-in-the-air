import json
import csv
import struct
import time
from datetime import datetime, time as dt_time
from pathlib import Path
import threading

import serial
from flask import Flask, jsonify, render_template

app = Flask(__name__)

DATA_DIR = Path(__file__).parent
JSON_PATH = DATA_DIR / "data.json"
CSV_PATH = DATA_DIR / "data.csv"

SERIAL_PORT = "COM3"
BAUD_RATE = 9600

SENSOR_FORMAT = struct.Struct("<ff?3xI")
SENSOR_SIZE = SENSOR_FORMAT.size

latest_data = {
    "temperature": None,
    "humidity": None,
    "classroomOccupied": None,
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
            writer.writerow(["timestamp", "temperature", "humidity", "classroom_occupied"])

def append_csv(timestamp, temperature, humidity, occupied):
    with open(CSV_PATH, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([timestamp, temperature, humidity, occupied])

def append_json(entry):
    if JSON_PATH.exists():
        with open(JSON_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
    else:
        data = []
    data.append(entry)
    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

def read_loop():
    init_csv()
    last_sample = 0
    buffer = bytearray()

    try:
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
    except serial.SerialException as e:
        print(f"Cannot open serial port: {e}")
        return

    while True:
        try:
            chunk = ser.read(SENSOR_SIZE)
            if not chunk:
                continue
            buffer.extend(chunk)

            while len(buffer) >= SENSOR_SIZE:
                packet = buffer[:SENSOR_SIZE]
                buffer = buffer[SENSOR_SIZE:]

                temperature, humidity, occupied, ts = SENSOR_FORMAT.unpack(packet)

                now_ts = time.time()
                interval = get_sampling_interval()

                latest_data["temperature"] = round(temperature, 1)
                latest_data["humidity"] = round(humidity, 1)
                latest_data["classroomOccupied"] = bool(occupied)
                latest_data["timestamp"] = datetime.fromtimestamp(now_ts).isoformat()

                if now_ts - last_sample >= interval:
                    last_sample = now_ts
                    dt_str = datetime.fromtimestamp(now_ts).isoformat()
                    entry = {
                        "timestamp": dt_str,
                        "temperature": round(temperature, 1),
                        "humidity": round(humidity, 1),
                        "classroomOccupied": bool(occupied),
                        "arduino_tick": ts,
                    }
                    append_json(entry)
                    append_csv(dt_str, round(temperature, 1), round(humidity, 1), bool(occupied))
                    print(f"Saved: {entry}")

        except serial.SerialException:
            break
        except Exception as e:
            print(f"Error: {e}")

    ser.close()

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

if __name__ == "__main__":
    thread = threading.Thread(target=read_loop, daemon=True)
    thread.start()
    app.run(host="0.0.0.0", port=5000, debug=False)
