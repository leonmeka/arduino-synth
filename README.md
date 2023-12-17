A micro-controller based synthesizer leveraging the Web Serial API.

# Description
This web application allows for generation of an audio oscillating audio signal, which can be modified through nodes as exposed by the Web Audio API. Operations can be applied via dedicated knob inputs via a micro controller (e.g. Arduino or similiar)

<img width="1912" alt="Bildschirmfoto 2023-12-17 um 12 26 48" src="https://github.com/leonmeka/synth/assets/15350962/1c0a09df-065c-4648-86d1-9e9b52de2f7a">

## Dependencies:
Run `npm install` to install the required dependencies.

## Preparing the micro controller:
- Arduino: Upload the script in ./sketch/arduino onto the micro controller

## Circuit
[TBD]

## Usage
Run `npm run dev` to start the application. Connect your micro controller via usb and click "connect".
