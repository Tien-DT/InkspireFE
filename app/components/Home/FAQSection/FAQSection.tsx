import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'

export function FAQSection() {
  const faqs = [
    {
      question: 'INKSPIRE hoạt động như thế nào?',
      answer:
        'Bạn chỉ cần đăng ký tài khoản miễn phí, tạo hồ sơ chuyên nghiệp và bắt đầu tìm kiếm các dự án phù hợp với kỹ năng của mình.'
    },
    {
      question: 'Làm thế nào để đảm bảo bảo mật thông tin?',
      answer:
        'Chúng tôi có hệ thống đánh giá và phản hồi từ khách hàng trước đó. Bạn có thể xem portfolio, kinh nghiệm và đánh giá của freelancer trước khi quyết định.'
    },
    {
      question: 'Các phương thức thanh toán được hỗ trợ?',
      answer:
        'Có, bạn có thể hủy dự án theo các điều khoản đã thỏa thuận. Chúng tôi khuyến khích việc thảo luận và giải quyết vấn đề trước khi hủy.'
    },
    {
      question: 'Nếu có tranh chấp thì xử lý như thế nào?',
      answer:
        'Chúng tôi tính phí 3-5% trên mỗi giao dịch tùy thuộc vào gói dịch vụ bạn chọn. Gói miễn phí có phí 5%, gói cao cấp có phí 3%.'
    },
    {
      question: 'Có thể hủy dự án sau khi đã bắt đầu không?',
      answer:
        'Bạn có thể rút tiền qua ngân hàng, ví điện tử hoặc các phương thức thanh toán phổ biến tại Việt Nam. Thời gian xử lý từ 1-3 ngày làm việc.'
    }
  ]

  return (
    <section className='py-16 bg-muted/10'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-12'>
          <h2 className='text-5xl text-gradient font-bold mb-4'>Câu hỏi thường gặp</h2>
          <p className='text-muted-foreground'>
            Tìm hiểu thêm về <strong>INKSPIRE</strong> qua những câu hỏi phổ biến
          </p>
        </div>
        <div className='max-w-3xl mx-auto'>
          <Accordion type='single' collapsible className='w-full space-y-4'>
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className='border border-border rounded-lg px-6 bg-card shadow-sm hover:shadow-md transition-all duration-300 data-[state=open]:bg-muted/50 data-[state=open]:border-primary/50'
              >
                <AccordionTrigger className='text-left hover:no-underline py-4 font-semibold text-foreground hover:text-primary transition-colors'>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className='text-muted-foreground pb-4 leading-relaxed'>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
