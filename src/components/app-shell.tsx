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
      <Card className="w-full max-w-lg">
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
    </main>
  );
}
