import type { JobApplication } from '~/components/manage-applications'

export const mockApplications: JobApplication[] = [
  {
    id: '1',
    jobId: 'job-001',
    jobTitle: 'Thiết kế Logo cho Startup công nghệ AI',
    companyName: 'TechVision AI',
    companyLogo: '',
    location: 'Hà Nội, Việt Nam',
    budget: {
      min: 5000000,
      max: 10000000,
      currency: 'VND'
    },
    appliedDate: '2024-10-01',
    status: 'pending',
    jobDescription:
      'Chúng tôi đang tìm kiếm một designer tài năng để thiết kế logo và bộ nhận diện thương hiệu cho startup AI. Logo cần thể hiện sự hiện đại, công nghệ và đáng tin cậy.',
    requiredSkills: ['Logo Design', 'Brand Identity', 'Adobe Illustrator', 'Figma'],
    projectDuration: '2-3 tuần',
    teamSize: 1,
    postedDate: '2024-09-25',
    deadline: '2024-10-15',
    categories: ['Design', 'Branding'],
    coverLetter:
      'Tôi có hơn 5 năm kinh nghiệm trong thiết kế logo và brand identity, đặc biệt là cho các công ty công nghệ. Tôi đã thiết kế logo cho nhiều startup trong lĩnh vực AI và blockchain.',
    proposedRate: 8000000,
    estimatedTime: '2 tuần'
  },
  {
    id: '2',
    jobId: 'job-002',
    jobTitle: 'Phát triển Website thương mại điện tử',
    companyName: 'ShopMart Vietnam',
    companyLogo: '',
    location: 'TP. Hồ Chí Minh',
    budget: {
      min: 20000000,
      max: 35000000,
      currency: 'VND'
    },
    appliedDate: '2024-09-28',
    status: 'accepted',
    jobDescription:
      'Cần phát triển website thương mại điện tử hoàn chỉnh với tính năng giỏ hàng, thanh toán online, quản lý đơn hàng. Yêu cầu responsive design và tối ưu SEO.',
    requiredSkills: ['React', 'Node.js', 'MongoDB', 'Payment Integration'],
    projectDuration: '2-3 tháng',
    teamSize: 2,
    postedDate: '2024-09-20',
    deadline: '2024-10-20',
    categories: ['Web Development', 'E-commerce'],
    coverLetter:
      'Tôi đã phát triển nhiều website thương mại điện tử cho các doanh nghiệp vừa và nhỏ. Có kinh nghiệm tích hợp các cổng thanh toán như VNPay, MoMo.',
    proposedRate: 30000000,
    estimatedTime: '2.5 tháng'
  },
  {
    id: '3',
    jobId: 'job-003',
    jobTitle: 'Thiết kế UI/UX cho ứng dụng Mobile Banking',
    companyName: 'FinTech Solutions',
    companyLogo: '',
    location: 'Đà Nẵng',
    budget: {
      min: 15000000,
      max: 25000000,
      currency: 'VND'
    },
    appliedDate: '2024-09-25',
    status: 'rejected',
    jobDescription:
      'Thiết kế giao diện và trải nghiệm người dùng cho ứng dụng mobile banking. Cần đảm bảo tính bảo mật, dễ sử dụng và hiện đại.',
    requiredSkills: ['UI/UX Design', 'Figma', 'Mobile Design', 'Prototyping'],
    projectDuration: '1-2 tháng',
    teamSize: 1,
    postedDate: '2024-09-18',
    deadline: '2024-10-10',
    categories: ['UI/UX', 'Mobile'],
    coverLetter:
      'Với kinh nghiệm thiết kế UI/UX cho các ứng dụng fintech, tôi hiểu rõ các yêu cầu về bảo mật và trải nghiệm người dùng trong lĩnh vực tài chính.',
    proposedRate: 20000000,
    estimatedTime: '1.5 tháng'
  },
  {
    id: '4',
    jobId: 'job-004',
    jobTitle: 'Viết Content Marketing cho Website',
    companyName: 'Digital Marketing Pro',
    companyLogo: '',
    location: 'Remote',
    budget: {
      min: 3000000,
      max: 6000000,
      currency: 'VND'
    },
    appliedDate: '2024-10-02',
    status: 'pending',
    jobDescription:
      'Cần viết content cho website doanh nghiệp, blog posts, bài viết SEO. Yêu cầu có kiến thức về digital marketing và SEO.',
    requiredSkills: ['Content Writing', 'SEO', 'Digital Marketing', 'Copywriting'],
    projectDuration: '1 tháng',
    teamSize: 1,
    postedDate: '2024-09-29',
    deadline: '2024-10-12',
    categories: ['Content', 'Marketing'],
    coverLetter:
      'Tôi có 3 năm kinh nghiệm viết content marketing và SEO. Đã giúp nhiều website tăng traffic organic từ 50-200%.',
    proposedRate: 5000000,
    estimatedTime: '1 tháng'
  },
  {
    id: '5',
    jobId: 'job-005',
    jobTitle: 'Phát triển ứng dụng React Native',
    companyName: 'Mobile Apps Studio',
    companyLogo: '',
    location: 'Hà Nội',
    budget: {
      min: 25000000,
      max: 40000000,
      currency: 'VND'
    },
    appliedDate: '2024-09-30',
    status: 'pending',
    jobDescription:
      'Phát triển ứng dụng mobile đa nền tảng bằng React Native. App quản lý công việc cá nhân với tính năng đồng bộ cloud.',
    requiredSkills: ['React Native', 'Firebase', 'Redux', 'Mobile Development'],
    projectDuration: '3-4 tháng',
    teamSize: 2,
    postedDate: '2024-09-26',
    deadline: '2024-10-18',
    categories: ['Mobile Development', 'React Native'],
    coverLetter:
      'Tôi có kinh nghiệm phát triển nhiều ứng dụng React Native với hơn 100k+ downloads trên cả iOS và Android.',
    proposedRate: 35000000,
    estimatedTime: '3 tháng'
  }
]
