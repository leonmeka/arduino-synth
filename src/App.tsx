import { createContext, useState } from "react";
import { AppShell } from "./components/app-shell";
import SerialPort from "serialport";

export interface SynthContextValue {
  port: SerialPort | undefined;
  setPort: (port: SerialPort | undefined) => void;
}

const defaultValue: SynthContextValue = {
  port: undefined,
  setPort: () => {},
};

export const SynthContext = createContext<SynthContextValue>(defaultValue);

export default function App() {
  const [port, setPort] = useState<SerialPort>();

  return (
    <SynthContext.Provider value={{ port, setPort }}>
      <AppShell></AppShell>
    </SynthContext.Provider>
  );
}
