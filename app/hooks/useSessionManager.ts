import { useEffect, useCallback, useRef, useState } from 'react'
import { useAuth } from '~/contexts/AuthContext'

interface SessionManagerOptions {
  timeout?: number            // tổng thời gian không hoạt động → auto logout (ms)
  warningTime?: number        // thời điểm cảnh báo trước khi hết hạn (ms)
  onTimeout?: () => void      // callback khi hết hạn (mặc định gọi logout)
  onWarning?: (timeLeft: number) => void // callback cảnh báo, truyền ms còn lại
}

export const useSessionManager = (options: SessionManagerOptions = {}) => {
  const {
    timeout = 30 * 60 * 1000,           // 30 phút
    warningTime = 5 * 60 * 1000,        // cảnh báo trước 5 phút
    onTimeout,
    onWarning
  } = options

  const { isAuthenticated, logout } = useAuth()

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const warningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastActivityRef = useRef<number>(Date.now())
  const [isRunning, setIsRunning] = useState(false)

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current)
    timeoutRef.current = null
    warningTimeoutRef.current = null
  }, [])

  const getTimeLeft = useCallback(() => {
    return Math.max(0, timeout - (Date.now() - lastActivityRef.current))
  }, [timeout])

  const scheduleTimers = useCallback(() => {
    clearTimers()
    if (!isAuthenticated) return

    // cập nhật mốc hoạt động cuối
    lastActivityRef.current = Date.now()

    // nếu warningTime >= timeout thì bỏ cảnh báo để tránh setTimeout âm
    const warnAt = Math.max(0, timeout - Math.max(0, warningTime))

    if (warnAt > 0 && onWarning) {
      warningTimeoutRef.current = setTimeout(() => {
        const timeLeft = getTimeLeft()
        if (timeLeft > 0) onWarning(timeLeft)
      }, warnAt)
    }

    timeoutRef.current = setTimeout(() => {
      if (onTimeout) onTimeout()
      else logout()
    }, timeout)

    setIsRunning(true)
  }, [clearTimers, getTimeLeft, isAuthenticated, logout, onTimeout, onWarning, timeout, warningTime])

  const resetTimeout = useCallback(() => {
    if (!isAuthenticated) return
    scheduleTimers()
  }, [isAuthenticated, scheduleTimers])

  const stop = useCallback(() => {
    clearTimers()
    setIsRunning(false)
  }, [clearTimers])

  const start = useCallback(() => {
    if (!isAuthenticated) return
    scheduleTimers()
  }, [isAuthenticated, scheduleTimers])

  const handleActivity = useCallback(() => {
    if (isAuthenticated) resetTimeout()
  }, [isAuthenticated, resetTimeout])

  useEffect(() => {
    if (!isAuthenticated) {
      stop()
      return
    }

    // Sự kiện người dùng → xem như hoạt động
    const events: Array<keyof DocumentEventMap> = [
      'mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'
    ]

    events.forEach(evt => {
      const passive = evt === 'scroll' || evt === 'touchstart'
      document.addEventListener(evt, handleActivity, { capture: true, passive })
    })

    // Sự kiện internal để reset (khi app refresh token xong, API call xong, v.v.)
    const internalReset = () => resetTimeout()
    window.addEventListener('session:refreshed', internalReset)
    window.addEventListener('api:success', internalReset)

    // Khởi động
    start()

    return () => {
      events.forEach(evt => {
        document.removeEventListener(evt, handleActivity, true)
      })
      window.removeEventListener('session:refreshed', internalReset)
      window.removeEventListener('api:success', internalReset)
      stop()
    }
  }, [isAuthenticated, handleActivity, resetTimeout, start, stop])

  return { resetTimeout, start, stop, getTimeLeft, isRunning }
}
