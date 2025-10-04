export const PATH = {
  // Public routes
  home: '/',
  about: '/about',
  jobsFreelancer: '/jobs-freelancer',
  searchFreelancer: '/search-freelancer',

  // Auth routes
  login: '/login',
  register: '/register',
  logout: '/logout',

  // Protected routes
  profile: '/profile',
  dashboard: '/dashboard-freelancer',
  postProject: '/post-project',
  postNewProject: '/post-new-project',
  manageProject: '/manage-project',
  managePostProject: '/manage-post-project',
  manageApplications: '/manage-applications',
  manageJobs: '/manage-jobs',
  payment: '/payment',
  chat: '/chat',
  bankingQr: '/banking-qr',

  // User routes
  changePassword: '/user/password',
  postRecruitment: '/post-recruitment'
  // productDetail: ':nameId',
  // cart: '/cart'
} as const

export type PathKeys = keyof typeof PATH
