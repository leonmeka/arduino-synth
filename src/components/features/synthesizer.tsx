/* eslint-disable @typescript-eslint/ban-ts-comment */
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
import { Volume, VolumeX } from "lucide-react";

const ctx = new AudioContext();

// Master Analyser for combined signal
const masterAnalyser = ctx.createAnalyser();
masterAnalyser.fftSize = 2048;
masterAnalyser.connect(ctx.destination);

// Individual Analysers for each oscillator
const analyser1 = ctx.createAnalyser();
analyser1.fftSize = 2048;
analyser1.connect(ctx.destination);

const analyser2 = ctx.createAnalyser();
analyser2.fftSize = 2048;
analyser2.connect(ctx.destination);

// Master Gain to combine signals
const masterGain = ctx.createGain();
masterGain.connect(masterAnalyser);
masterGain.connect(ctx.destination);

// Gain nodes for each oscillator, connected to their respective analysers and the master gain
const gainNode1 = ctx.createGain();
gainNode1.connect(masterGain);
gainNode1.connect(analyser1);

const gainNode2 = ctx.createGain();
gainNode2.connect(masterGain);
gainNode2.connect(analyser2);

// Oscillator nodes
const oscillatorNode1 = ctx.createOscillator();
oscillatorNode1.connect(gainNode1);

const oscillatorNode2 = ctx.createOscillator();
oscillatorNode2.connect(gainNode2);

interface SynthValues {
  type: OscillatorType;
  wave1_frequency: number;
  wave1_gain: number;
  wave2_frequency: number;
  wave2_gain: number;
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
        !isNaN(values.wave1_frequency) ||
        !isNaN(values.wave1_gain) ||
        !isNaN(values.wave2_frequency) ||
        !isNaN(values.wave2_gain)
      ) {
        action({
          type: values.type,
          wave1_frequency: values.wave1_frequency,
          wave1_gain: values.wave1_gain,
          wave2_frequency: values.wave2_frequency,
          wave2_gain: values.wave2_gain,
        });
      }
    } catch (e) {
      continue;
    }
  }
};

export const Synthesizer = () => {
  const { port } = useContext(SynthContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [values, setValues] = useState<SynthValues>({
    type: "sine",
    wave1_frequency: 0,
    wave1_gain: 0,
    wave2_frequency: 0,
    wave2_gain: 0,
  });

  useEffect(() => {
    if (!port) {
      return;
    }

    // @ts-expect-error
    const reader = port.readable.getReader();
    readData(reader, setValues);
  }, [port]);

  useEffect(() => {
    oscillatorNode1.type = values.type;
    oscillatorNode2.type = values.type;

    oscillatorNode1.frequency.value = normalize(values.wave1_frequency, 0, 440);
    gainNode1.gain.value = normalize(values.wave1_gain, 0, 100);
    oscillatorNode2.frequency.value = normalize(values.wave2_frequency, 0, 440);
    gainNode2.gain.value = normalize(values.wave2_gain, 0, 100);

    if (!isPlaying && (values.wave1_gain > 0 || values.wave2_gain > 0)) {
      oscillatorNode1.start();
      oscillatorNode2.start();
      setIsPlaying(true);
    }
  }, [isPlaying, values]);

  const handleMute = () => {
    setIsMuted(!isMuted);
    masterGain.gain.value = isMuted ? 1 : 0;
  };

  if (!port) {
    return (
      <p className="text-sm">
        Please connect an Arduino to a port to use the Synthesizer.
      </p>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Combined</Label>
            <button onClick={handleMute}>
              {isMuted ? <VolumeX size={16} /> : <Volume size={16} />}
            </button>
          </div>
          <Oscillator analyser={masterAnalyser} color="orange" />
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm">Signal A</Label>
            <Oscillator analyser={analyser1} color="gray" />
          </div>
          +
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm">Signal B</Label>
            <Oscillator analyser={analyser2} color="gray" />
          </div>
        </div>
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

        <div className="flex justify-between gap-4 m-4">
          <div className="flex gap-2">
            <RadialKnob
              label={"Frequency (A)"}
              value={values.wave1_frequency}
            ></RadialKnob>
            <RadialKnob
              label={"Gain (A)"}
              value={values.wave1_gain}
            ></RadialKnob>
          </div>
          <hr />

          <div className="flex gap-2">
            <RadialKnob
              label={"Frequency (B)"}
              value={values.wave2_frequency}
            ></RadialKnob>
            <RadialKnob
              label={"Gain (B)"}
              value={values.wave2_gain}
            ></RadialKnob>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
