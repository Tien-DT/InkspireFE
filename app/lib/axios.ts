// api/axiosClient.ts
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import {
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setRefreshTokenToLS, // nếu BE trả refresh mới khi rotate
  clearAllAuth
} from '~/utils/auth'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 150000 // 2.5 minutes timeout (backend has 2 min timeout + buffer)
})

const bootToken = getAccessTokenFromLS()
if (bootToken) {
  axiosClient.defaults.headers.common.Authorization = `Bearer ${bootToken}`
}

// ===== Refresh control (lock + queue) =====
let isRefreshing = false
let waiters: Array<(token: string) => void> = []

const notifyAll = (token: string) => {
  waiters.forEach((w) => w(token))
  waiters = []
}

// ===== Attach access token on every request =====
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const at = getAccessTokenFromLS()
    if (at) config.headers.Authorization = `Bearer ${at}`
    return config
  },
  (err) => Promise.reject(err)
)

// ===== Auto refresh on 401 (LS only) =====
axiosClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined
    if (!error.response || !original) return Promise.reject(error)

    const is401 = error.response.status === 401
    const isRefreshCall =
      typeof original.url === 'string' &&
      /\/auth\/refresh/i.test(original.url.replace(axiosClient.defaults.baseURL ?? '', ''))

    if (is401 && !original._retry && !isRefreshCall) {
      original._retry = true

      // Nếu đang refresh, chờ token mới rồi retry
      if (isRefreshing) {
        return new Promise((resolve) => {
          waiters.push((newToken) => {
            if (original.headers) original.headers.Authorization = `Bearer ${newToken}`
            resolve(axiosClient(original))
          })
        })
      }

      // Bắt đầu refresh
      isRefreshing = true
      try {
        const rt = getRefreshTokenFromLS()
        if (!rt) throw new Error('No refresh token in LS')

        // Gọi refresh (KHÔNG withCredentials, body gửi refresh_token)
        const resp = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/refresh`, {
          refresh_token: rt
        })

        // Chuẩn hoá key: access_token / accessToken
        const data = resp.data as {
          access_token?: string
          accessToken?: string
          refresh_token?: string
          refreshToken?: string
        }
        const newAccess = data.access_token ?? data.accessToken
        const newRefresh = data.refresh_token ?? data.refreshToken

        if (!newAccess) throw new Error('No access token in refresh response')

        // Lưu LS & set default cho axios
        setAccessTokenToLS(newAccess)
        if (newRefresh) setRefreshTokenToLS(newRefresh) // nếu backend rotate refresh
        axiosClient.defaults.headers.common.Authorization = `Bearer ${newAccess}`

        // Đánh thức các request đang đợi
        notifyAll(newAccess)

        // Retry request gốc
        if (original.headers) original.headers.Authorization = `Bearer ${newAccess}`
        return axiosClient(original)
      } catch (e) {
        // Refresh fail -> clear & điều hướng login
        clearAllAuth()
        const from = window.location.pathname + window.location.search
        window.location.replace(`/login?from=${encodeURIComponent(from)}`)
        return Promise.reject(e)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default axiosClient
