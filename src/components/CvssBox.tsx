import { useSpring, animated } from "react-spring";

interface CvssBoxProps {
  score: number;
}

export const CvssBox = ({ score }: CvssBoxProps) => {
  const props = useSpring({
    number: score,
    from: { number: 0 },
    config: {
      tension: 30,
      friction: 10,
      gentleness: 100,
    },
    delay: 50,
  });

  return (
    <div className="flex flex-row md:flex-col font-orbitron">
      <div className="mb-16 md:mb-0 flex flex-row pb-2 text-2xs font-bold uppercase tracking-wider text-violet-100 text-opacity-70">
        CVSS BASE SCORE
      </div>
      <div className="absolute m-1 mt-2 flex flex-row font-orbitron text-6xl">
        <animated.div className="p-1 font-orbitron text-6xl">
          {props.number.interpolate((n) => n.toFixed(1))}
        </animated.div>
      </div>
      <div className="ml-6 flex md:ml-0 md:mt-16 mb-4">
        <div className="flex flex-col">
          <div className="justify-center bg-red-600 pl-2 text-2xs font-bold uppercase tracking-wider text-violet-100 text-opacity-70">
            HIGH
          </div>
          <div className="flex w-full items-center justify-center bg-red-600 pb-1 pl-2">
            C
          </div>
        </div>
        <div className="flex flex-col">
          <div className="justify-center bg-red-600 pl-2 text-2xs font-bold uppercase tracking-wider text-violet-100 text-opacity-70">
            HIGH
          </div>
          <div className="flex w-full items-center justify-center bg-red-600 pb-1 pl-2">
            I
          </div>
        </div>
        <div className="flex flex-col">
          <div className="justify-center bg-red-600 pl-2 pr-2 text-2xs font-bold uppercase tracking-wider text-violet-100 text-opacity-70">
            HIGH
          </div>
          <div className="flex w-full items-center justify-center bg-red-600 pb-1 pl-2 pr-2">
            A
          </div>
        </div>
      </div>
    </div>
  );
};
