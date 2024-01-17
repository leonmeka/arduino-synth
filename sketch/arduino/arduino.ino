#include <ArduinoJson.h>

struct SynthValues {
  String type;
  float wave1_frequency;
  float wave1_gain;
  float wave2_frequency;
  float wave2_gain;
};

const String initialType = "sine";
const float initialWave1_frequency = 0.1;
const float initialWave1_gain = 0.1;
const float initialWave2_frequency = 0.1;
const float initialWave2_gain = 0.1;

const float MAX_ANALOG_VALUE = 1023.0;

SynthValues synthValues;

void setup() {
  Serial.begin(500000);

  pinMode (A0, INPUT); // wave1_frequency
  pinMode (A1, INPUT); // wave1_gain
  pinMode (A2, INPUT); // wave2_frequency
  pinMode (A3, INPUT); // wave2_gain
  
  pinMode (8, INPUT); // switch8 
  pinMode (9, INPUT); // switch9

  synthValues.type = initialType;
  synthValues.wave1_frequency = initialWave1_frequency;
  synthValues.wave1_gain = initialWave1_gain;
  synthValues.wave2_frequency = initialWave2_frequency;
  synthValues.wave2_gain = initialWave2_gain;
}

void loop() {
  synthValues.wave1_frequency = analogRead(A0) / MAX_ANALOG_VALUE;
  synthValues.wave1_gain = analogRead(A1) / MAX_ANALOG_VALUE;
  synthValues.wave2_frequency = analogRead(A2) / MAX_ANALOG_VALUE;
  synthValues.wave2_gain = analogRead(A3) / MAX_ANALOG_VALUE;

  int switch8 = digitalRead(8);
  int switch9 = digitalRead(9);

  if(switch8 == 1){
    synthValues.type = "sawtooth";
  }
  if(switch9 == 1){
    synthValues.type = "sine";
  }
  if(switch8 == 0 && switch9 == 0){
    synthValues.type = "square";
  }
  
  sendValues(synthValues);
}

void sendValues(const SynthValues &values) {
  StaticJsonDocument<100> doc;
  doc["type"] = values.type;
  doc["wave1_frequency"] = values.wave1_frequency;
  doc["wave1_gain"] = values.wave1_gain;
  doc["wave2_frequency"] = values.wave2_frequency;
  doc["wave2_gain"] = values.wave2_gain;
  String jsonStr;
  serializeJson(doc, jsonStr);

  Serial.println(jsonStr);
}
