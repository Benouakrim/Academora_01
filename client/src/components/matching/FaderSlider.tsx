import React, { useMemo } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'
import { SlidersHorizontal } from 'lucide-react'

interface FaderSliderProps {
  value: number // Current value (0-10)
  min?: number
  max?: number
  step?: number
  onChange: (value: number) => void
  label: string
}

const FADER_HEIGHT = 160 // px

export default function FaderSlider({ value, min = 0, max = 10, step = 1, onChange, label }: FaderSliderProps) {
  // Motion value tracks the Y position of the knob, relative to the fader track
  const y = useMotionValue(0);
  
  // Calculate vertical distance based on current value
  const initialY = useMemo(() => {
    const range = max - min;
    const normalized = (value - min) / range; // 0 to 1
    // Translate from normalized value (0=bottom, 1=top) to pixel position (0=top, -FADER_HEIGHT=bottom)
    return -normalized * FADER_HEIGHT;
  }, [value, min, max]);

  // Calculate normalized value for fill indicator
  const normalizedValue = useMemo(() => {
    return ((value - min) / (max - min)) * 100;
  }, [value, min, max]);

  // Sync external value to motion value
  React.useEffect(() => {
    y.set(initialY)
  }, [initialY, y])

  // Transform the Y position back into the scaled value
  const displayValue = useTransform(y, [-FADER_HEIGHT, 0], [max, min]);
  
  // Function to snap value to the nearest step and update parent
  const handleDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: { point: { x: number, y: number } }) => {
    // Only drag vertically, Y position is clamped
    const newY = info.point.y
    
    // Convert Y back to value (0-10)
    const normalized = (newY - (-FADER_HEIGHT)) / FADER_HEIGHT // 0 at bottom, 1 at top
    let newValue = normalized * (max - min) + min;
    
    // Snap to nearest step
    newValue = Math.round(newValue / step) * step;
    newValue = Math.min(max, Math.max(min, newValue));

    onChange(newValue);
  }

  // Value display: format the actual value to 0-10
  const renderedValue = displayValue.get();
  
  return (
    <div className="flex flex-col items-center p-3">
      <div className="text-center mb-3">
        <p className="text-xl font-bold text-secondary">{renderedValue.toFixed(0)}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>

      <motion.div 
        className="relative bg-muted/50 rounded-lg shadow-inner"
        style={{ width: 24, height: FADER_HEIGHT }}
      >
        {/* Fader Knob */}
        <motion.div
          drag="y"
          dragConstraints={{ top: -FADER_HEIGHT + 12, bottom: -12 }} // Adjusted constraints for knob size
          dragElastic={0}
          onDrag={handleDrag}
          style={{ y, width: 40, height: 24, left: '50%', translateX: '-50%' }}
          className={cn(
            "absolute -translate-y-1/2 bg-secondary rounded-md shadow-lg cursor-grab border-2 border-secondary/50",
          )}
          initial={{ y: initialY }}
        >
          <SlidersHorizontal className="w-full h-full p-1 text-secondary-foreground" />
        </motion.div>

        {/* Value Fill (Visual only) */}
        <div
          className="absolute bottom-0 left-0 w-full bg-secondary/30 rounded-lg origin-bottom"
          style={{ height: `${normalizedValue}%` }}
        />
      </motion.div>
      <p className="mt-4 text-xs text-muted-foreground">Adjust weight</p>
    </div>
  )
}
