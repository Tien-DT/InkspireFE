import axiosClient from '~/lib/axios'

const URL_PORTFOLIOS = '/api/portfolios'
const URL_USER_PORTFOLIOS = (userId: string) => `/api/portfolios/user/${userId}`
const URL_UPLOAD_PORTFOLIO_IMAGE = '/api/files/upload-portfolio-image'
const URL_UPLOAD_PORTFOLIO_PDF = '/api/files/upload-portfolio-pdf'

export interface Portfolio {
  id: string
  userId: string
  name: string | null
  project: string | null
  skill: string | null
  description: string | null
  imageUrl: string | null
  pdfUrl: string | null
  status: number | null
  createdAt: string
  updatedAt: string | null
}

export interface CreatePortfolioRequest {
  userId: string
  name?: string
  project?: string
  skill?: string
  description?: string
  imageUrl?: string
  pdfUrl?: string
  status?: number
}

export interface UpdatePortfolioRequest {
  name?: string
  project?: string
  skill?: string
  description?: string
  imageUrl?: string
  pdfUrl?: string
  status?: number
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export const portfolioApi = {
  getUserPortfolios: async (userId: string): Promise<Portfolio[]> => {
    const response = await axiosClient.get<ApiResponse<Portfolio[]>>(URL_USER_PORTFOLIOS(userId))
    return response.data.data
  },

  getPortfolioById: async (id: string): Promise<Portfolio> => {
    const response = await axiosClient.get<ApiResponse<Portfolio>>(`${URL_PORTFOLIOS}/${id}`)
    return response.data.data
  },

  createPortfolio: async (data: CreatePortfolioRequest): Promise<Portfolio> => {
    const response = await axiosClient.post<ApiResponse<Portfolio>>(URL_PORTFOLIOS, data)
    return response.data.data
  },

  updatePortfolio: async (id: string, data: UpdatePortfolioRequest): Promise<Portfolio> => {
    const response = await axiosClient.put<ApiResponse<Portfolio>>(`${URL_PORTFOLIOS}/${id}`, data)
    return response.data.data
  },

  deletePortfolio: async (id: string): Promise<void> => {
    await axiosClient.delete(`${URL_PORTFOLIOS}/${id}`)
  },

  uploadPortfolioImage: async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await axiosClient.post<ApiResponse<{ fileUrl: string }>>(
      URL_UPLOAD_PORTFOLIO_IMAGE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return response.data.data.fileUrl
  },

  uploadPortfolioPdf: async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await axiosClient.post<ApiResponse<{ fileUrl: string }>>(
      URL_UPLOAD_PORTFOLIO_PDF,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return response.data.data.fileUrl
  },

  initializePortfolioBuckets: async (): Promise<void> => {
    try {
      await axiosClient.post('/api/storage/init-portfolio-buckets')
    } catch (error) {
      console.error('Failed to initialize buckets via backend:', error)
      // Silent fail - buckets might already exist
    }
  }
}
