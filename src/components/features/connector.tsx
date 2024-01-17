/* eslint-disable @typescript-eslint/ban-ts-comment */

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

  const handleConnect = async () => {
    if (port) {
      window.location.reload();
      return;
    }

    try {
      // @ts-expect-error
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
      {
        <Button onClick={handleConnect} disabled={!canUseSerial}>
          {port ? "Disconnect" : "Connect"}
        </Button>
      }

      {port && (
        <p className="text-sm">
          {/*   @ts-expect-error */}
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
