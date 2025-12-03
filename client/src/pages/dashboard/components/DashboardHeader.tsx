import { useUser } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import AnimatedBackground from '@/components/ui/animated-background'
import { useTranslation } from 'react-i18next'

export default function DashboardHeader() {
  const { user } = useUser()
  const { t } = useTranslation()
  
  const firstName = user?.firstName || t('student')
  const hour = new Date().getHours()
  
  let greetingKey: string;
  if (hour < 12) {
    greetingKey = 'greeting_morning'
  } else if (hour < 18) {
    greetingKey = 'greeting_afternoon'
  } else {
    greetingKey = 'greeting_evening'
  }
  
  const greeting = t(greetingKey)

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
          {t('dashboard_welcome_message')}
        </motion.p>
      </div>
    </div>
  )
}
