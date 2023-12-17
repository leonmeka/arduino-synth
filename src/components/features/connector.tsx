import { useContext, useState } from "react";
import { Button } from "../ui/button";
import { SynthContext } from "@/App";

const config = {
  FILTERS: [
    { usbVendorId: 0x2341, usbProductId: 0x0043 },
    { usbVendorId: 0x2341, usbProductId: 0x0001 },
  ],
  BAUD_RATE: 500000,
};

export const Connector = () => {
  const [canUseSerial] = useState(() => "serial" in navigator);
  const { port, setPort } = useContext(SynthContext);

  const connect = async () => {
    try {
      const selection = await navigator.serial.requestPort({
        filters: config.FILTERS,
      });
      await selection.open({ baudRate: config.BAUD_RATE });
      setPort(selection);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-between items-center gap-5">
      <Button onClick={connect} disabled={!!port || !canUseSerial}>
        {port ? "Connected" : "Connect"}
      </Button>

      {port && (
        <p className="text-sm">
          Connected to Port <code>[{port.getInfo().usbProductId}]</code>
        </p>
      )}

      {!canUseSerial && (
        <p className="text-sm text-red-400">
          This browser does not support the <code>Web Serial</code> API.
        </p>
      )}
    </div>
  );
};
