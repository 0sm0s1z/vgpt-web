import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { MayHaveLabel, PieTooltipProps } from "@nivo/pie";

const ResponsivePie = dynamic(
  () => import("@nivo/pie").then((m) => m.ResponsivePie),
  { ssr: false }
);

interface Datum {
  id: string;
  label: string;
  value: number;
  color: string;
}
interface TooltipProps {
  datum: Datum;
}

export const SeverityGage = () => {
  const chartContainerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [animateGauge, setAnimateGauge] = useState(0);

  // Get score from props
  const calculatePosition = (
    score: number,
    minRange: number,
    maxRange: number,
    minScore = 0,
    maxScore = 10
  ): number => {
    return (
      ((score - minScore) * (maxRange - minRange)) / (maxScore - minScore) +
      minRange
    );
  };

  // Get score from props
  const score = 8.1; // example score
  const position = calculatePosition(score, -90, 90);

  useEffect(() => {
    const currentRef = chartContainerRef.current;
    const observer: ResizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      });
    });

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      // Use the saved ref here
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);
  useEffect(() => {
    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      setAnimateGauge((prevScore) =>
        prevScore < position ? prevScore + 3 : position
      );
    }, 50);

    // Cleanup function to clear the interval when the component unmounts or the score changes
    return () => clearInterval(interval);
  }, [animateGauge, position]);

  let label = "";
  let labelColor = "";
  if (animateGauge > 45 && animateGauge < 91) {
    label = "HIGH";
    labelColor = "#DC2626"; // tailwind's red-600
  } else if (animateGauge > -45 && animateGauge < 46) {
    label = "MEDIUM";
    labelColor = "#FBBF24"; // tailwind's yellow-400
  } else if (animateGauge > -90 && animateGauge < -44) {
    label = "LOW";
    labelColor = "#10B981"; // tailwind's green-500
  } else {
    label = "INFO";
    labelColor = "#E5E7EB"; // tailwind's gray-200
  }
  const labelSize = Math.min(dimensions.width, dimensions.height) / 10;

  const severityData: Datum[] = [
    {
      id: "high",
      label: label,
      value: 1,
      color: "hsl(10, 70%, 50%)",
    },
  ];

  // Mouseover tooltip
  const Tooltip: React.FC<PieTooltipProps<MayHaveLabel>> = ({ datum }) => (
    <div className="rounded-sm bg-violet-500/80 p-2">
      <strong>This vulnerability is {datum.label} </strong>
    </div>
  );

  const colorPalette = [
    "#DDD6FE", // tailwind's violet-200
    "#7C3AED", // tailwind's violet-600
    "#4C1D95", // tailwind's violet-900
    "#6D28D9", // tailwind's violet-700
  ];

  return (
    <div className="flex flex-row">
      <div className="relative flex flex-col">
        <div className="pb-2 font-orbitron text-2xs font-bold uppercase tracking-wider text-violet-100 text-opacity-70">
          Vulnerability Severity
        </div>
        <div
          className="absolute mt-6 h-72 w-72 pl-4 md:pl-0"
          ref={chartContainerRef}
        >
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform pb-10 pl-4 text-center font-orbitron font-bold text-red-500 md:pl-0"
            style={{ fontSize: `${labelSize}px`, color: `${labelColor}` }}
          >
            {label}
          </div>
          {/* ! The startAngle defines where the gauge ends (90=full) -> adjust this value based on the severity */}
          <ResponsivePie
            key={animateGauge}
            data={severityData}
            margin={{ top: 0, right: 0, bottom: 0, left: 10 }}
            fit={false}
            startAngle={animateGauge}
            endAngle={-90}
            innerRadius={0.65}
            activeInnerRadiusOffset={1}
            activeOuterRadiusOffset={8}
            padAngle={0.7}
            cornerRadius={4}
            value={"value"}
            tooltip={Tooltip}
            colors={colorPalette}
            defs={[
              {
                id: "gradient",
                type: "linearGradient",
                colors: [
                  { offset: 0, color: "#DDD6FE" },
                  { offset: 70, color: "#7C3AED" },
                ],
                gradientTransform: "rotate(270 0.5 0.5)",
              },
            ]}
            fill={[
              {
                match: (data) => data.id === "high",
                id: "gradient",
              },
              {
                match: (data) => data.id !== "high",
                id: "pattern",
              },
            ]}
            borderWidth={1}
            borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
            enableArcLabels={false}
            enableArcLinkLabels={false}
          />
        </div>
      </div>
    </div>
  );
};
