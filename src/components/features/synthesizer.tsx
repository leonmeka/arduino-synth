import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Card, CardContent } from "../ui/card";
import { SynthContext } from "@/App";
import { Oscillator } from "./oscillator";
import { Input } from "../ui/input";
import { RadialKnob } from "../radial-knob";
import { Label } from "@radix-ui/react-label";

const ctx = new AudioContext();
const oscillatorNode = ctx.createOscillator();
oscillatorNode.connect(ctx.destination);

const gainNode = ctx.createGain();
gainNode.connect(ctx.destination);

const lowpassFilterNode = ctx.createBiquadFilter();
lowpassFilterNode.type = "lowpass";
lowpassFilterNode.connect(ctx.destination);

const highpassFilterNode = ctx.createBiquadFilter();
highpassFilterNode.type = "highpass";
highpassFilterNode.connect(ctx.destination);

const analyser = ctx.createAnalyser();
analyser.fftSize = 2048;
analyser.connect(ctx.destination);

oscillatorNode.connect(gainNode);
oscillatorNode.connect(lowpassFilterNode);
oscillatorNode.connect(highpassFilterNode);
oscillatorNode.connect(analyser);

interface SynthValues {
  type: OscillatorType;
  frequency: number;
  gain: number;
  lowpass: number;
  highpass: number;
}

const normalize = (value: number, min: number, max: number): number => {
  return value * (max - min) + min;
};

const readData = async (
  reader: ReadableStreamDefaultReader,
  action: Dispatch<SetStateAction<SynthValues>>
) => {
  let running = true;
  while (running) {
    const { value, done } = await reader.read();

    if (done) {
      reader.releaseLock();
      running = false;
      break;
    }

    try {
      const string = new TextDecoder().decode(value);
      const values = JSON.parse(string);

      if (
        !isNaN(values.frequency) ||
        !isNaN(values.gain) ||
        !isNaN(values.lowpass) ||
        !isNaN(values.highpass)
      ) {
        action(values);
      }
    } catch (e) {
      continue;
    }
  }
};

export const Synthesizer = () => {
  const { port } = useContext(SynthContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [values, setValues] = useState<SynthValues>({
    type: "sine",
    frequency: 0,
    gain: 0,
    lowpass: 0,
    highpass: 0,
  });

  useEffect(() => {
    if (!port) {
      return;
    }

    const reader = port.readable.getReader();
    readData(reader, setValues);
  }, [port]);

  useEffect(() => {
    oscillatorNode.type = values.type;
    oscillatorNode.frequency.value = normalize(values.frequency, 0, 440);
    lowpassFilterNode.frequency.value = normalize(values.lowpass, 0, 10000);
    highpassFilterNode.frequency.value = normalize(values.highpass, 0, 10000);
    gainNode.gain.value = normalize(values.gain, 0, 100);

    if (!isPlaying && values.gain > 0) {
      oscillatorNode.start();
      setIsPlaying(true);
    }
  }, [isPlaying, values]);

  if (!port) {
    return (
      <p className="text-sm">
        Please connect an Arduino to a port to use the Synthesizer.
      </p>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <Oscillator analyser={analyser}></Oscillator>
      </CardContent>

      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm">Wave Type</Label>
          <Input
            className="w-full"
            disabled
            type="text"
            value={values.type?.toUpperCase() ?? 0}
          />
        </div>

        <div className="flex gap-4">
          <RadialKnob label={"Frequency"} value={values.frequency}></RadialKnob>
          <RadialKnob label={"Gain"} value={values.gain}></RadialKnob>
          <RadialKnob label={"Distortion"} value={values.lowpass}></RadialKnob>
          <RadialKnob label={"Highpass"} value={values.highpass}></RadialKnob>
        </div>
      </CardContent>
    </Card>
  );
};
