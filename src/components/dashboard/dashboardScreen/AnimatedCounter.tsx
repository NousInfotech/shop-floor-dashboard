import { useEffect, useState, ReactNode } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  title: string;
  icon: ReactNode;
  color: string;
  subtext?: string;
  onClick?: () => void;
}

export const AnimatedCounter = ({
  value,
  duration = 1000,
  title,
  icon,
  color,
  subtext,
  onClick
}: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      setCount(Math.floor(start));
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <div 
      className={`bg-gradient-to-br ${color} p-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-102 flex flex-col cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-sm font-medium text-white/80">{title}</h3>
        <div className="p-2 bg-white/20 rounded-lg">
          {icon}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-end">
          <span className="text-3xl font-bold text-white">{count}</span>
          {subtext && <span className="text-sm ml-1 mb-1 text-white/70">{subtext}</span>}
        </div>
        <p className="text-xs text-white/70 mt-1">
          {title === "Completion Rate" ? "↑ 1% from last week" : null}
        </p>
      </div>
    </div>
  );
};
