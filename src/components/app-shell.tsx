import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Connector } from "./features/connector";
import { Synthesizer } from "./features/synthesizer";

export function AppShell() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex items-start gap-4">
        <div className="flex flex-col w-full max-w-lg ">
          <Card>
            <CardHeader>
              <CardTitle>ArduinoSynth</CardTitle>
              <CardDescription>
                An Arduino based synthesizer leveraging the{" "}
                <code>Web Serial API</code>.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Synthesizer />
            </CardContent>

            <CardFooter>
              <Connector />
            </CardFooter>
          </Card>
        </div>

        <div className="flex flex-col w-full max-w-md ">
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                A synthesizer is an electronic (musical) instrument that
                generates audio signals. In this case by combining two distinct
                audio waves (see{" "}
                <a
                  className="text-blue-500 hover:underline"
                  href="https://en.wikipedia.org/wiki/Additive_synthesis"
                >
                  additive synthesis
                </a>
                ). Tweaking the frequency and gain of these waves allows you to
                create a wide variety of sounds.
              </p>

              <p className="text-sm mb-4">
                To get started, simply follow these steps:
              </p>

              <ul className="list-disc pl-5 text-sm mb-4">
                <li>Connect the device via USB.</li>
                <li>
                  Use the knobs to adjust frequency and gain for each wave.
                </li>
                <li>Select wave types for different sounds.</li>
                <li>Watch the waveforms visualize in the oscilloscope.</li>
                <li>
                  Experiment with different settings to create unique sounds!
                </li>
              </ul>

              <hr />

              <p className="text-xs mt-4">
                <strong> Free and Open Technologies 2023W</strong>
              </p>
              <p className="text-xs">Bianca Apostolescu, Leon Meka</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
