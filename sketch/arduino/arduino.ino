#include <ArduinoJson.h>

struct SynthValues {
  String type;
  float frequency;
  float gain;
  float lowpass;
  float highpass;
};

const String initialType = "sine";
const float initialFrequency = 0.1;
const float initialGain = 0.1;
const float initialLowpass = 0.1;
const float initialHighpass = 0.1;

SynthValues synthValues;

void setup() {
  Serial.begin(500000);

  synthValues.type = initialType;
  synthValues.frequency = initialFrequency;
  synthValues.gain = initialGain;
  synthValues.lowpass = initialLowpass;
  synthValues.highpass = initialHighpass;
}

void loop() {
  sendValues(synthValues);
  delay(100);
}

void sendValues(const SynthValues &values) {
  StaticJsonDocument<100> doc;
  doc["type"] = values.type;
  doc["frequency"] = values.frequency;
  doc["gain"] = values.gain;
  doc["lowpass"] = values.lowpass;
  doc["highpass"] = values.highpass;
  String jsonStr;
  serializeJson(doc, jsonStr);

  Serial.println(jsonStr);
}
