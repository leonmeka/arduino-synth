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

  pinMode (A0, INPUT); // frequency
  pinMode (A1, INPUT); // gain
  pinMode (A2, INPUT); // lowpass
  pinMode (A3, INPUT); // highpass
  
  pinMode (8, INPUT); // switch8 
  pinMode (9, INPUT); // switch9

  synthValues.type = initialType;
  synthValues.frequency = initialFrequency;
  synthValues.gain = initialGain;
  synthValues.lowpass = initialLowpass;
  synthValues.highpass = initialHighpass;
}

void loop() {
  synthValues.frequency = analogRead(A0) / 1023.0;
  synthValues.gain = analogRead(A1) / 1023.0;
  synthValues.lowpass = analogRead(A2) / 1023.0;
  synthValues.highpass = analogRead(A3) / 1023.0;

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
  delay(500);
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
