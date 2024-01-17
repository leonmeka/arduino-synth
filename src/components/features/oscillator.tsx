import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface OscillatorProps {
  analyser: AnalyserNode;
  color?: "gray" | "orange";
}

export const Oscillator = ({ analyser, color }: OscillatorProps) => {
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
      context.lineWidth = 1.5;
      context.strokeStyle = color === "orange" ? "#F97316" : "#718096";
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
  }, [analyser, color]);

  return (
    <Card>
      <CardContent className="w-full h-full flex justify-center items-center p-0">
        <canvas ref={canvasRef} className="w-full h-full" />
      </CardContent>
    </Card>
  );
};
