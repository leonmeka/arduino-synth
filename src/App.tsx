import { createContext, useState, Dispatch } from "react";
import { AppShell } from "./components/app-shell";
import SerialPort from "serialport";

interface SynthContextValue {
  port: SerialPort | undefined;
  setPort: Dispatch<React.SetStateAction<SerialPort | undefined>>;
}

export const SynthContext = createContext<SynthContextValue | undefined>(
  undefined
);

export default function App() {
  const [port, setPort] = useState<SerialPort>();

  return (
    <SynthContext.Provider value={{ port, setPort }}>
      <AppShell></AppShell>
    </SynthContext.Provider>
  );
}
