import axiosClient from '~/lib/axios'

export const URL_ADMIN_SETTINGS = '/api/admin/settings'

export interface ApiSettingsResponse {
  gmailRefreshToken: string
  gmailRefreshTokenSet: boolean
  gmailClientId: string
  gmailClientIdSet: boolean
  gmailClientSecret: string
  gmailClientSecretSet: boolean
  geminiApiKey: string
  geminiApiKeySet: boolean
}

export const settingsApi = {
  getSettings: async (): Promise<{ success: boolean; message: string; data: ApiSettingsResponse }> => {
    const response = await axiosClient.get(URL_ADMIN_SETTINGS)
    return response.data
  },

  updateGmailRefreshToken: async (token: string): Promise<{ success: boolean; message: string }> => {
    const response = await axiosClient.put(`${URL_ADMIN_SETTINGS}/gmail-refresh-token`, { token })
    return response.data
  },

  updateGeminiApiKey: async (token: string): Promise<{ success: boolean; message: string }> => {
    const response = await axiosClient.put(`${URL_ADMIN_SETTINGS}/gemini-api-key`, { token })
    return response.data
  },

  testGmailConnection: async (toEmail: string): Promise<{ success: boolean; data: { message: string; email: string } }> => {
    const response = await axiosClient.post(`${URL_ADMIN_SETTINGS}/test-gmail`, { toEmail })
    return response.data
  },

  testGeminiConnection: async (prompt: string): Promise<{ success: boolean; data: { message: string; prompt: string; response: string } }> => {
    const response = await axiosClient.post(`${URL_ADMIN_SETTINGS}/test-gemini`, { prompt })
    return response.data
  },

  getGmailOAuthUrl: async (): Promise<{ success: boolean; data: { authorizationUrl: string; redirectUri: string } }> => {
    const response = await axiosClient.get('/api/auth/gmail/authorize-url')
    return response.data
  },

  exchangeGmailCode: async (code: string): Promise<{ success: boolean; data: { refreshToken: string } }> => {
    const response = await axiosClient.post('/api/auth/gmail/exchange-code', { code })
    return response.data
  }
}
