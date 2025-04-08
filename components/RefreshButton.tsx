'use client'

import { useUserStore } from '@/store/userStore'
import { RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function RefreshButton() {
  const { canManualRefresh, manualRefresh } = useUserStore()
  const [timeLeft, setTimeLeft] = useState<number>(0)

  useEffect(() => {
    const timer = setInterval(() => {
      if (!canManualRefresh()) {
        const lastRefresh = useUserStore.getState().lastManualRefresh
        if (lastRefresh) {
          const waitTime = 5 * 60 * 1000 // 5 minutes
          const elapsed = Date.now() - lastRefresh
          const remaining = Math.max(0, waitTime - elapsed)
          setTimeLeft(Math.ceil(remaining / 1000))
        }
      } else {
        setTimeLeft(0)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [canManualRefresh])

  const handleRefresh = async () => {
    if (canManualRefresh()) {
      await manualRefresh()
    }
  }

  const tooltipContent = timeLeft > 0 
    ? `Disponible dans ${timeLeft} secondes` 
    : 'Rafraîchir les données'

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleRefresh}
            disabled={!canManualRefresh()}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className="w-4 h-4" />
            Rafraîchir
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}