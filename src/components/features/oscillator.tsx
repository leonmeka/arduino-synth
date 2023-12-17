import { useEffect, useRef } from "react";
import { Card, CardContent } from "../ui/card";

interface OscillatorProps {
  analyser: AnalyserNode;
}

export const Oscillator = ({ analyser }: OscillatorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      analyser.getByteTimeDomainData(dataArray);

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.lineWidth = 1;
      context.strokeStyle = "#3498db";
      context.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }

        x += sliceWidth;
      }

      context.lineTo(canvas.width, canvas.height / 2);
      context.stroke();

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      analyser.disconnect();
    };
  }, [analyser]);

  return (
    <Card>
      <CardContent className="w-full h-full flex justify-center items-center p-0">
        <canvas ref={canvasRef} className="w-full h-full" />
      </CardContent>
    </Card>
  );
};
