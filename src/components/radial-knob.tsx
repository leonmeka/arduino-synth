interface RadialKnobProps {
  label: string;
  value: number;
}

export const RadialKnob = ({ label, value }: RadialKnobProps) => {
  const percentage = Math.min(100, Math.max(0, value * 100));

  const knobStyle = {
    background: `conic-gradient(
      from -90deg,
      #3498db ${percentage}%,
      transparent ${percentage}% 100%
    )`,
    transform: "rotate(90deg)",
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm text-center">{label}</p>
      <div className="w-16 h-16 rounded-full bg-gray-300 relative">
        <div
          className="w-full h-full rounded-full absolute top-0 left-0"
          style={knobStyle}
        ></div>
        <p className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-sm text-white">
          {percentage.toFixed(0)}%
        </p>
      </div>
    </div>
  );
};
