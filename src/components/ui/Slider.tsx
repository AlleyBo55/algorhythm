import * as React from "react"
import { cn } from "./Button"

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    valueLabel?: string
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    ({ className, label, valueLabel, ...props }, ref) => {
        return (
            <div className="w-full space-y-2 group">
                {(label || valueLabel) && (
                    <div className="flex justify-between items-center text-xs font-mono uppercase tracking-wider text-muted-foreground group-hover:text-primary/80 transition-colors">
                        {label && <span>{label}</span>}
                        {valueLabel && <span className="text-primary">{valueLabel}</span>}
                    </div>
                )}
                <div className="relative h-6 flex items-center">
                    {/* Track glow/backlight */}
                    <div className="absolute inset-x-0 h-1 bg-secondary rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary/20 w-full origin-left scale-x-[var(--progress,0)]"
                        />
                    </div>
                    <input
                        type="range"
                        className={cn(
                            "w-full absolute inset-0 opacity-0 cursor-pointer z-10",
                            className
                        )}
                        style={{ "--progress": "0.5" } as React.CSSProperties} // Dynamic progress would need JS state wrapper, using naive approach for now
                        ref={ref}
                        {...props}
                    />
                    {/* Custom visible track for better styling control if needed, but globals.css handles the main styling */}
                    <div className="w-full h-1 bg-secondary/50 rounded-full overflow-hidden pointer-events-none">
                        {/* This is a visual fallback if standard input[range] styling isn't enough */}
                    </div>
                </div>
            </div>
        )
    }
)
Slider.displayName = "Slider"

export { Slider }
