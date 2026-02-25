import { useState, useCallback, useEffect } from 'react'
import { useUsage, CREDIT_COSTS } from '../context/UsageContext'

/**
 * Hook for checking and enforcing usage limits
 * Returns limit status and trigger functions for upgrade prompts
 */
export function useUsageLimits() {
  const { usage, currentPlan, isNearCreditLimit, isAtCreditLimit, useCredits, getCreditsRemaining } = useUsage()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showLimitWarning, setShowLimitWarning] = useState(false)
  const [limitContext, setLimitContext] = useState({ metric: '', action: '' })

  // Check if action can be performed (based on credits)
  const canPerformAction = useCallback((metric) => {
    const creditCost = metric === 'queries' ? CREDIT_COSTS.chatQuery : 
                       metric === 'deepResearch' ? CREDIT_COSTS.chatQuery * 2 : 
                       CREDIT_COSTS.chatQuery
    const remaining = getCreditsRemaining()
    return remaining === -1 || remaining >= creditCost
  }, [getCreditsRemaining])

  // Attempt to perform an action with limit checking
  const performAction = useCallback((metric, action, onSuccess) => {
    // Get the cost of the action
    const creditCost = metric === 'queries' ? CREDIT_COSTS.chatQuery : 
                       metric === 'deepResearch' ? CREDIT_COSTS.chatQuery * 2 : 
                       CREDIT_COSTS.chatQuery
    
    const remaining = getCreditsRemaining()
    
    // Check if user has enough credits for this action
    if (remaining !== -1 && remaining < creditCost) {
      setLimitContext({ metric, action })
      setShowUpgradeModal(true)
      return false
    }

    if (isNearCreditLimit(90)) {
      setLimitContext({ metric, action })
      setShowLimitWarning(true)
    }

    // Use credits for the action
    const creditAction = metric === 'queries' ? 'chatQuery' : 
                         metric === 'deepResearch' ? 'chatQuery' : 
                         'chatQuery'
    useCredits(creditAction)
    if (onSuccess) onSuccess()
    return true
  }, [getCreditsRemaining, isNearCreditLimit, useCredits])

  // Close modals
  const closeUpgradeModal = useCallback(() => {
    setShowUpgradeModal(false)
    setLimitContext({ metric: '', action: '' })
  }, [])

  const closeLimitWarning = useCallback(() => {
    setShowLimitWarning(false)
  }, [])

  return {
    canPerformAction,
    performAction,
    showUpgradeModal,
    showLimitWarning,
    limitContext,
    closeUpgradeModal,
    closeLimitWarning,
  }
}

/**
 * Hook for tracking a specific metric's usage (credit-based)
 */
export function useMetricUsage(metric) {
  const { usage, currentPlan, getCreditsPercentage, getCreditsRemaining, isNearCreditLimit, isAtCreditLimit } = useUsage()

  // Map old metric names to new usage tracking
  const metricMap = {
    queries: 'chatQueries',
    deepResearch: 'chatQueries',
    exports: 'dataExports',
  }
  
  const usageKey = metricMap[metric] || metric
  const current = usage[usageKey] || 0
  
  // For credit-based system, we track credits not individual limits
  const creditsUsed = usage.creditsUsed
  const creditsLimit = currentPlan.credits
  const isUnlimited = creditsLimit === -1
  const percentage = getCreditsPercentage()
  const remaining = getCreditsRemaining()

  return {
    current,
    limit: creditsLimit,
    isUnlimited,
    percentage,
    remaining: remaining === -1 ? Infinity : remaining,
    isNearLimit: isNearCreditLimit(90),
    isAtLimit: isAtCreditLimit(),
  }
}

/**
 * Hook for real-time usage notifications (credit-based)
 */
export function useUsageNotifications() {
  const { usage, currentPlan, getCreditsPercentage } = useUsage()
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const newNotifications = []
    
    // Credit-based notifications
    if (currentPlan.credits !== -1) {
      const percentage = getCreditsPercentage()

      if (percentage >= 100) {
        newNotifications.push({
          id: 'credits-limit',
          type: 'error',
          metric: 'credits',
          message: `You've reached your credit limit`,
          action: 'upgrade',
        })
      } else if (percentage >= 90) {
        newNotifications.push({
          id: 'credits-warning',
          type: 'warning',
          metric: 'credits',
          message: `You're at ${percentage}% of your credit limit`,
          action: 'view',
        })
      }
    }

    setNotifications(newNotifications)
  }, [usage, currentPlan, getCreditsPercentage])

  const dismissNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  return { notifications, dismissNotification }
}

// Helper function
function formatMetricName(metric) {
  const names = {
    queries: 'AI queries',
    deepResearch: 'Deep Research',
    exports: 'exports',
    savedReports: 'saved reports',
  }
  return names[metric] || metric
}
