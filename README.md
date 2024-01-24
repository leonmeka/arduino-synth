A micro-controller based synthesizer leveraging the Web Serial API.

# Description

This project allows for generation of two oscillating signals. Each signal can be modified through nodes as exposed by the ´Web Audio´ API. Operations can be applied via dedicated knob inputs on a micro-controller. The resulting signals are them combined and audible via your speakers.

https://github.com/leonmeka/arduino-synth/assets/15350962/7c2ce2fe-9174-46bd-ad21-60deae4517b5


# Usage

## Hardware

### Circuit

The circuit is based on the Arduino UNO. You will need the following components:

- Switch => https://www.digikey.at/en/products/detail/cit-relay-and-switch/ANT11SECQE/12503336
- PCB => https://www.digikey.at/en/products/detail/adafruit-industries-llc/4786/13617527
- Potentiometer => https://www.digikey.at/en/products/detail/bourns-inc/PDB12-H4301-103BF/3780664
- Resistors => https://www.digikey.at/en/products/detail/stackpole-electronics-inc/CF18JT220K/1741641
- Jumper Wires => https://www.digikey.at/en/products/detail/sparkfun-electronics/PRT-12795/5993860
- Any microcontroller compatible with Arduino Uno

Switch x2, PCB x1 (bundle of 3 with the link above), Potentiometer x6, Resistors x6, Microcontroller x1,
Wires - 20-30 single wires

![final_schema](https://github.com/leonmeka/arduino-synth/assets/15350962/92978ae7-985b-487e-bdec-514a82f28c16)

After assembling the circuit, connect the Arduino to your computer via USB.

## Software

Clone the repository to your local machine. You will need to install the Arduino IDE to compile and upload the code to your micro-controller. You can download the IDE here: https://www.arduino.cc/en/software

After installing the IDE, open the project in the IDE, open the sketch in "./sketch/arduino" and click "Upload" to compile and upload the code to your micro-controller. The micro-controller will now be ready to use.

### Dependencies:

Run `npm install` to install the required dependencies.

### Usage

Run `npm run dev` to start the application.

Connect your micro controller via usb and click "connect". The application will automatically detect the port and connect to it.

Happy synthesizing!
