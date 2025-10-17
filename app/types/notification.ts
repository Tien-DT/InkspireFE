export interface Notification {
  id: string
  userId: string
  content: string | null
  notiType: number | null
  deviceType: string | null
  createdAt: string | null
  updatedAt: string | null
  deletedAt: string | null
  isReceived: boolean | null
  isReaded: boolean | null
  status: number | null
}

export const NotificationTypes = {
  // CV/Recruitment Related (1-10)
  CV_SUBMITTED: 1,
  CV_ACCEPTED: 2,
  CV_REJECTED: 3,
  
  // Project Related (11-20)
  PROJECT_CREATED: 11,
  PROJECT_UPDATED: 12,
  PROJECT_COMPLETED: 13,
  PROJECT_CANCELLED: 14,
  PROJECT_ASSIGNED: 15,
  
  // Project Milestone Related (21-30)
  MILESTONE_CREATED: 21,
  MILESTONE_UPDATED: 22,
  MILESTONE_COMPLETED: 23,
  MILESTONE_APPROVED: 24,
  MILESTONE_REJECTED: 25,
  MILESTONE_PAYMENT_RELEASED: 26,
  
  // Wallet/Payment Related (31-40)
  WALLET_DEPOSIT_SUCCESS: 31,
  WALLET_DEPOSIT_FAILED: 32,
  WALLET_WITHDRAW_REQUESTED: 33,
  WALLET_WITHDRAW_APPROVED: 34,
  WALLET_WITHDRAW_REJECTED: 35,
  WALLET_PAYMENT_RECEIVED: 36,
  WALLET_PAYMENT_SENT: 37,
  
  // System Related (91-99)
  SYSTEM_ANNOUNCEMENT: 91,
  SYSTEM_MAINTENANCE: 92,
} as const

export function getNotificationIcon(type: number): string {
  if (type >= 1 && type <= 10) return '📄' // CV
  if (type >= 11 && type <= 20) return '📁' // Project
  if (type >= 21 && type <= 30) return '🎯' // Milestone
  if (type >= 31 && type <= 40) return '💰' // Wallet
  if (type >= 91 && type <= 99) return '🔔' // System
  return '📢'
}

export function getNotificationColor(type: number): string {
  if (type === NotificationTypes.CV_ACCEPTED || 
      type === NotificationTypes.MILESTONE_APPROVED ||
      type === NotificationTypes.WALLET_DEPOSIT_SUCCESS ||
      type === NotificationTypes.WALLET_WITHDRAW_APPROVED) {
    return 'text-green-600'
  }
  if (type === NotificationTypes.CV_REJECTED || 
      type === NotificationTypes.MILESTONE_REJECTED ||
      type === NotificationTypes.WALLET_DEPOSIT_FAILED ||
      type === NotificationTypes.WALLET_WITHDRAW_REJECTED) {
    return 'text-red-600'
  }
  if (type >= 31 && type <= 40) {
    return 'text-emerald-600' // Wallet
  }
  return 'text-blue-600'
}
