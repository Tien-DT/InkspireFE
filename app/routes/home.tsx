import StatsSection from '~/components/Home/StatsSection'
import HeroSection from '~/components/Home/HeroSection'
import ServicesSection from '~/components/Home/ServicesSection'
import PricingSection from '~/components/Home/PricingSection'
import HowItWorksSection from '~/components/Home/HowItWorksSection'
import TestimonialsSection from '~/components/Home/TestimonialsSection'
import FAQSection from '~/components/Home/FAQSection'

export default function Home() {
  return (
    <div>
      <HeroSection
        title={
          <>
            Kết nối tài năng
            <br />
            không giới hạn
          </>
        }
        subtitle='Nền tảng freelance hàng đầu Việt Nam kết nối doanh nghiệp với những tài năng xuất sắc nhất trong mọi lĩnh vực'
        primaryLabel='Tìm việc Freelancer'
        secondaryLabel='Đăng dự án ngay'
        isHero
        tagline='Khám phá Hồ sơ Năng lực'
      />

      <StatsSection />
      <ServicesSection />
      <PricingSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
      <HeroSection
        title='Sẵn sàng bắt đầu hành trình của bạn?'
        subtitle='Tham gia cộng đồng freelancer lớn nhất Việt Nam và khám phá những cơ hội không giới hạn'
        primaryLabel='Tìm việc Freelancer'
        secondaryLabel='Thuê tài năng'
      />
    </div>
  )
}
