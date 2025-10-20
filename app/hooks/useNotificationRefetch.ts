import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { signalRNotificationService, type NotificationData } from '~/lib/signalr-notification'
import { NotificationTypes } from '~/types/notification'
import { useAuth } from '~/contexts/AuthContext'

/**
 * 🔄 Smart Notification Refetch Hook
 * 
 * Khi có notification mới → Tự động refetch data liên quan để đảm bảo UI luôn hiển thị data mới nhất
 * 
 * Features:
 * - Parse notification type → Xác định queries cần refetch
 * - Chỉ refetch queries liên quan (không refetch toàn bộ app)
 * - Batch refetch để tránh multiple API calls
 * - Parse notification data để extract IDs
 * 
 * Example:
 * - MILESTONE_PAYMENT_RELEASED notification
 *   → Refetch: milestones, project, wallet
 * 
 * - CV_ACCEPTED notification
 *   → Refetch: user-applications, recruitments
 */
export function useNotificationRefetch() {
  const queryClient = useQueryClient()
  const { profile } = useAuth()

  useEffect(() => {
    if (!profile?.id) return

    const handleNotificationReceived = (notification: NotificationData) => {
      console.log('🔄 [NotificationRefetch] Notification received:', notification)
      
      const type = notification.notiType
      const userId = profile.id

      // Parse notification data for IDs
      const notificationData = notification.data || {}
      const projectId = notificationData.projectId
      const milestoneId = notificationData.milestoneId
      const recruitmentId = notificationData.recruitmentId
      const cvId = notificationData.cvId

      // ===== CV/Recruitment Related =====
      if (type === NotificationTypes.CV_SUBMITTED) {
        console.log('🔄 [NotificationRefetch] CV submitted - refetch applications')
        queryClient.invalidateQueries({ queryKey: ['user-applications', userId] })
        if (recruitmentId) {
          queryClient.invalidateQueries({ queryKey: ['recruitment-post-applications', recruitmentId] })
        }
      }

      if (type === NotificationTypes.CV_ACCEPTED || type === NotificationTypes.CV_REJECTED) {
        console.log('🔄 [NotificationRefetch] CV status changed - refetch applications')
        queryClient.invalidateQueries({ queryKey: ['user-applications', userId] })
        if (recruitmentId) {
          queryClient.invalidateQueries({ queryKey: ['recruitment-post-applications', recruitmentId] })
        }
      }

      // ===== Project Related =====
      if (type === NotificationTypes.PROJECT_CREATED || 
          type === NotificationTypes.PROJECT_UPDATED ||
          type === NotificationTypes.PROJECT_ASSIGNED) {
        console.log('🔄 [NotificationRefetch] Project changed - refetch projects')
        queryClient.invalidateQueries({ queryKey: ['projects', userId, profile.role] })
        if (projectId) {
          queryClient.invalidateQueries({ queryKey: ['project', projectId] })
        }
      }

      if (type === NotificationTypes.PROJECT_COMPLETED || 
          type === NotificationTypes.PROJECT_CANCELLED) {
        console.log('🔄 [NotificationRefetch] Project status changed - refetch all project data')
        queryClient.invalidateQueries({ queryKey: ['projects', userId, profile.role] })
        if (projectId) {
          queryClient.invalidateQueries({ queryKey: ['project', projectId] })
          queryClient.invalidateQueries({ queryKey: ['milestones', projectId] })
        }
      }

      // ===== Milestone Related =====
      if (type === NotificationTypes.MILESTONE_CREATED ||
          type === NotificationTypes.MILESTONE_UPDATED ||
          type === NotificationTypes.MILESTONE_COMPLETED) {
        console.log('🔄 [NotificationRefetch] Milestone changed - refetch milestones & project')
        if (projectId) {
          queryClient.invalidateQueries({ queryKey: ['project', projectId] })
          queryClient.invalidateQueries({ queryKey: ['milestones', projectId] })
          queryClient.invalidateQueries({ queryKey: ['projects', userId, profile.role] })
        }
      }

      if (type === NotificationTypes.MILESTONE_APPROVED || 
          type === NotificationTypes.MILESTONE_REJECTED) {
        console.log('🔄 [NotificationRefetch] Milestone status changed - refetch all related data')
        if (projectId) {
          queryClient.invalidateQueries({ queryKey: ['project', projectId] })
          queryClient.invalidateQueries({ queryKey: ['milestones', projectId] })
        }
      }

      if (type === NotificationTypes.MILESTONE_PAYMENT_RELEASED) {
        console.log('🔄 [NotificationRefetch] Payment released - refetch milestone, project & wallet')
        // Refetch project & milestones
        if (projectId) {
          queryClient.invalidateQueries({ queryKey: ['project', projectId] })
          queryClient.invalidateQueries({ queryKey: ['milestones', projectId] })
        }
        // Refetch wallet (payment received)
        queryClient.invalidateQueries({ queryKey: ['wallet', userId] })
      }

      // ===== Wallet Related =====
      if (type === NotificationTypes.WALLET_DEPOSIT_SUCCESS ||
          type === NotificationTypes.WALLET_DEPOSIT_FAILED ||
          type === NotificationTypes.WALLET_WITHDRAW_APPROVED ||
          type === NotificationTypes.WALLET_WITHDRAW_REJECTED ||
          type === NotificationTypes.WALLET_PAYMENT_RECEIVED ||
          type === NotificationTypes.WALLET_PAYMENT_SENT) {
        console.log('🔄 [NotificationRefetch] Wallet transaction - refetch wallet')
        queryClient.invalidateQueries({ queryKey: ['wallet', userId] })
      }

      // ===== System Notifications =====
      if (type === NotificationTypes.SYSTEM_ANNOUNCEMENT ||
          type === NotificationTypes.SYSTEM_MAINTENANCE) {
        console.log('🔄 [NotificationRefetch] System notification - no refetch needed')
        // System notifications typically don't require data refetch
      }

      console.log('✅ [NotificationRefetch] Refetch completed')
    }

    // Register handler
    signalRNotificationService.registerHandlers({
      onNotificationReceived: handleNotificationReceived
    })

    return () => {
      // Cleanup handled by service
    }
  }, [profile?.id, profile?.role, queryClient])
}
