#include <DHT.h>

#define DHTPIN 2
#define DHTTYPE DHT11
#define PROXIMITY_PIN 3

DHT dht(DHTPIN, DHTTYPE);

struct SensorPacket {
  float temperature;
  float humidity;
  bool classroomOccupied;
  unsigned long timestamp;
};

static_assert(sizeof(SensorPacket) == 16, "SensorPacket size mismatch - check struct alignment");

void setup() {
  Serial.begin(9600);
  dht.begin();
  pinMode(PROXIMITY_PIN, INPUT);
}

void loop() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  if (isnan(temperature) || isnan(humidity)) {
    delay(1000);
    return;
  }

  bool classroomOccupied = digitalRead(PROXIMITY_PIN) == HIGH;

  SensorPacket packet;
  packet.temperature = temperature;
  packet.humidity = humidity;
  packet.classroomOccupied = classroomOccupied;
  packet.timestamp = millis();

  Serial.write((byte*)&packet, sizeof(packet));

  delay(1000);
}
