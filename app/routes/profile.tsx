import { useState } from 'react'

const tabs = [
  { id: 'account', label: 'Tài khoản' },
  { id: 'notifications', label: 'Thông báo' },
  { id: 'security', label: 'Bảo mật' },
  { id: 'payment', label: 'Thanh toán' },
  { id: 'preferences', label: 'Tùy chọn' }
]

export default function Profile() {
  const [activeTab, setActiveTab] = useState('account')
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100'>
      <main className='max-w-7xl mx-auto px-4 py-12'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-cyan-500 mb-2'>Cài đặt</h1>
          <p className='text-gray-600'>Quản lý tài khoản và túy chọn cá nhân của bạn</p>
        </div>

        <div className='flex gap-0 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200'>
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-6 font-medium transition-colors ${
                activeTab === tab.id ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              } ${index !== 0 ? 'border-l border-gray-200' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className='grid lg:grid-cols-2 gap-8 mt-8'>
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <h2 className='text-xl font-bold text-gray-900 mb-6'>Thông tin cá nhân</h2>

            <form className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label htmlFor='lastName' className='block text-sm font-medium text-gray-700 mb-2'>
                    Họ
                  </label>
                  <input
                    type='text'
                    id='lastName'
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>

                <div>
                  <label htmlFor='firstName' className='block text-sm font-medium text-gray-700 mb-2'>
                    Tên
                  </label>
                  <input
                    type='text'
                    id='firstName'
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>
              </div>

              <div>
                <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                  Email
                </label>
                <input
                  type='email'
                  id='email'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>

              <div>
                <label htmlFor='phone' className='block text-sm font-medium text-gray-700 mb-2'>
                  Số điện thoại
                </label>
                <input
                  type='tel'
                  id='phone'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>

              <div>
                <label htmlFor='bio' className='block text-sm font-medium text-gray-700 mb-2'>
                  Giới thiệu
                </label>
                <textarea
                  id='bio'
                  rows={4}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
                />
              </div>

              <button
                type='submit'
                className='w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors'
              >
                Lưu thay đổi
              </button>
            </form>
          </div>
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <h2 className='text-xl font-bold text-gray-900 mb-6'>Thông tin liên hệ</h2>

            <form className='space-y-4'>
              <div>
                <label htmlFor='address' className='block text-sm font-medium text-gray-700 mb-2'>
                  Địa chỉ
                </label>
                <input
                  type='text'
                  id='address'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label htmlFor='city' className='block text-sm font-medium text-gray-700 mb-2'>
                    Thành phố
                  </label>
                  <select
                    id='city'
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
                  >
                    <option>Chọn thành phố</option>
                    <option>Hà Nội</option>
                    <option>Hồ Chí Minh</option>
                    <option>Đà Nẵng</option>
                    <option>Cần Thơ</option>
                  </select>
                </div>

                <div>
                  <label htmlFor='country' className='block text-sm font-medium text-gray-700 mb-2'>
                    Quốc gia
                  </label>
                  <select
                    id='country'
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
                  >
                    <option>Chọn quốc gia</option>
                    <option>Việt Nam</option>
                    <option>United States</option>
                    <option>Singapore</option>
                    <option>Japan</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor='website' className='block text-sm font-medium text-gray-700 mb-2'>
                  Website
                </label>
                <input
                  type='url'
                  id='website'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>

              <div>
                <label htmlFor='linkedin' className='block text-sm font-medium text-gray-700 mb-2'>
                  LinkedIn
                </label>
                <input
                  type='url'
                  id='linkedin'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
