import * as React from "react";
import { cn } from "./Button";

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, showValue, formatValue, value, onChange, ...props }, ref) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : (value as number) || 0;
    const min = parseFloat(props.min as string) || 0;
    const max = parseFloat(props.max as string) || 100;
    const progress = ((numValue - min) / (max - min)) * 100;

    const displayValue = formatValue 
      ? formatValue(numValue) 
      : numValue.toFixed(props.step?.toString().includes('.') ? 2 : 0);

    return (
      <div className="w-full space-y-2">
        {(label || showValue) && (
          <div className="flex justify-between items-center">
            {label && (
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                {label}
              </span>
            )}
            {showValue && (
              <span className="text-xs font-mono text-zinc-300 tabular-nums">
                {displayValue}
              </span>
            )}
          </div>
        )}
        <div className="relative h-5 flex items-center group">
          {/* Track background */}
          <div className="absolute inset-x-0 h-1 bg-zinc-800 rounded-full overflow-hidden">
            {/* Progress fill */}
            <div 
              className="h-full bg-white/80 rounded-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Native input */}
          <input
            type="range"
            ref={ref}
            value={value}
            onChange={onChange}
            className={cn(
              "absolute inset-0 w-full opacity-0 cursor-pointer z-10",
              className
            )}
            {...props}
          />
          
          {/* Custom thumb indicator */}
          <div 
            className="absolute h-3 w-3 bg-white rounded-full shadow-md pointer-events-none transition-transform duration-75 group-hover:scale-110 group-active:scale-100"
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>
      </div>
    );
  }
);

Slider.displayName = "Slider";

export { Slider };
