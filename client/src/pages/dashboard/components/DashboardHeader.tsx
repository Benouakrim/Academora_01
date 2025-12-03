import { useUser } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import AnimatedBackground from '@/components/ui/animated-background'

export default function DashboardHeader() {
  const { user } = useUser()
  const firstName = user?.firstName || 'Student'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="relative overflow-hidden rounded-2xl bg-primary/5 dark:bg-primary/10 p-8 mb-8">
      <div className="absolute inset-0 opacity-30">
         <AnimatedBackground intensity={1} />
      </div>
      
      <div className="relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold tracking-tight mb-2"
        >
          {greeting}, {firstName}!
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground max-w-xl text-lg"
        >
          Welcome to your command center. Track your applications, compare universities, and plan your future.
        </motion.p>
      </div>
    </div>
  )
}
