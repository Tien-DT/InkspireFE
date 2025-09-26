import React, { useEffect, useState } from 'react'

export default function BankingQR() {
  const [timeLeft, setTimeLeft] = useState(28 * 60 + 39) // 28:39 in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  return (
    <div className='container mx-auto px-4 py-6 space-y-6 min-h-screen my-20'>
      <div className='bg-white rounded-lg p-8 text-white min-h-[500px]'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            {/* Header with Icon */}
            <div className='flex items-center mb-6'>
              <div className='w-8 h-8 bg-blue-500 rounded mr-3 flex items-center justify-center'>
                <div className='w-4 h-4 bg-white rounded-sm'></div>
              </div>
              <h1 className='text-xl font-semibold text-gray-900 text-black'>Chuyển khoản ngân hàng</h1>
            </div>

            {/* Subtitle */}
            <p className='text-cyan-400 mb-8 text-sm'>Chú ý: nhập chính xác nội dung bên dưới</p>
            <div className='flex gap-10'>
              {/* Left Side - Banking Details */}

              <div className='space-y-6 w-2/3 border border-dashed rounded-2xl p-10'>
                <div className='flex justify-between items-center border-b border-dashed p-2'>
                  <span className='text-gray-900'>Ngân hàng</span>
                  <span className='font-semibold text-gray-900'>ACB</span>
                </div>

                <div className='flex justify-between items-center border-b border-dashed p-2'>
                  <span className='text-gray-900'>Số tài khoản</span>
                  <span className='font-semibold text-gray-900'>42982717</span>
                </div>

                <div className='flex justify-between items-center border-b border-dashed p-2'>
                  <span className='text-gray-900'>Chủ tài khoản</span>
                  <span className='font-semibold text-gray-900'>LE DUC KHANH</span>
                </div>

                <div className='flex justify-between items-center border-b border-dashed p-2'>
                  <span className='text-gray-900'>Số tiền</span>
                  <span className='font-semibold text-gray-900'>100.000 vnđ</span>
                </div>

                <div className='flex justify-between items-center border-b border-dashed p-2'>
                  <span className='text-gray-900'>Nội dung</span>
                  <span className='font-semibold text-gray-900'>aeky906</span>
                </div>
              </div>

              {/* Right Side - QR Code and Timer */}
              <div className='flex flex-col items-center w-1/3 border border-dashed rounded-2xl p-10'>
                {/* QR Code */}
                <div className='bg-white p-4 rounded-lg mb-4 shadow-lg flex-1 w-full h-full'>
                  <div className=' bg-white flex items-center justify-center'>
                    {/* QR Code Pattern - Simplified representation */}
                    <div className='grid grid-cols-8 gap-px w-full h-full'>
                      {Array.from({ length: 64 }, (_, i) => (
                        <div key={i} className={`w-full h-full ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Timer */}
                <div className='text-center'>
                  <p className='text-gray-900 text-sm mb-2'>Thời gian còn lại</p>
                  <div className='text-3xl font-bold text-gray-900'>{formatTime(timeLeft)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
