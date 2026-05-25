#include <DHT.h>

#define DHTPIN 2
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

struct SensorPacket {
  float temperature;
  float humidity;
  unsigned long timestamp;
};

static_assert(sizeof(SensorPacket) == 12, "SensorPacket size mismatch - check struct alignment");

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  if (isnan(temperature) || isnan(humidity)) {
    delay(1000);
    return;
  }

  SensorPacket packet;
  packet.temperature = temperature;
  packet.humidity = humidity;
  packet.timestamp = millis();

  Serial.write((byte*)&packet, sizeof(packet));

  delay(1000);
}
