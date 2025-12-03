import React, { useMemo } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

interface DialKnobProps {
  value: number // Current value (0-100)
  min?: number
  max?: number
  onChange: (value: number) => void
  label: string
  unit?: string
}

const KNOB_SIZE = 80 // px

export default function DialKnob({ value, min = 0, max = 100, onChange, label, unit = '' }: DialKnobProps) {
  const normalizedValue = useMemo(() => ((value - min) / (max - min)) * 100, [value, min, max])
  const angle = useMotionValue(normalizedValue * 3.6) // 0-100 to 0-360 degrees
  
  // Update local state when value prop changes externally
  React.useEffect(() => {
    angle.set(normalizedValue * 3.6)
  }, [normalizedValue, angle])

  const dragControl = {
    onDrag: (_event: MouseEvent | TouchEvent | PointerEvent, info: { point: { x: number, y: number } }) => {
      // Calculate angle from the center to the cursor point
      const deltaX = info.point.x
      const deltaY = info.point.y
      
      let newAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)
      
      // Normalize angle to 0-360, starting from the top (-90 degrees offset)
      newAngle = (newAngle + 450) % 360 
      
      // Convert angle back to 0-100 scale
      const newValue = Math.round(newAngle / 3.6)
      
      // Clamp and convert to final value
      const finalValue = Math.min(max, Math.max(min, Math.round(newValue / 100 * (max - min) + min)))
      
      onChange(finalValue)
    },
    // OnDragEnd is not strictly necessary as onDrag updates continuously
  }
  
  // Visual indicator rotation
  const rotation = useTransform(angle, [0, 360], [0, 360])

  return (
    <div className="flex flex-col items-center p-4">
      <div className="text-center mb-3">
        <p className="text-2xl font-bold text-primary">{value}{unit}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <motion.div
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} // Constrain drag to simulate circular rotation
        {...dragControl}
        className={cn(
          "relative rounded-full border-2 border-primary/20 bg-background shadow-xl cursor-grab",
        )}
        style={{ width: KNOB_SIZE, height: KNOB_SIZE }}
      >
        {/* Angle indicator, rotates based on value */}
        <motion.div 
            className="absolute top-0 left-1/2 -ml-0.5 h-1/2 w-1 bg-primary origin-bottom rounded-full" 
            style={{ rotate: rotation }}
        >
             <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3 w-3 bg-primary rounded-full shadow-md" />
        </motion.div>
      </motion.div>
      <p className="mt-2 text-xs text-muted-foreground">Drag to adjust weight</p>
    </div>
  )
}
