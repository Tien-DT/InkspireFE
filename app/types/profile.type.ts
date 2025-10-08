export interface PortfolioItem {
  id: number
  title: string
  category: string
  description: string
  image: string
}

export interface ProfileData {
  name: string
  title: string
  avatar: string
  rating: number
  reviewCount: number
  location: string
  email: string
  phone: string
  bio: string
  priceRange: string
  status: string
  skills: string[]
  portfolio: PortfolioItem[]
}

export interface ProfileFormData {
  name: string
  title: string
  bio: string
  email: string
  phone: string
  location: string
  priceRange: string
  status: string
  skills: string
}
