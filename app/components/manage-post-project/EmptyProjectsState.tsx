import { Button } from '~/components/ui/button'
import { Briefcase, Plus } from 'lucide-react'
import { Link } from 'react-router'
import { PATH } from '~/constants/path'

export function EmptyProjectsState() {
  return (
    <div className='bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center'>
      <Briefcase className='h-16 w-16 text-gray-400 mx-auto mb-4' />
      <h3 className='text-lg font-semibold text-gray-900 mb-2'>Chưa có bài đăng nào</h3>
      <p className='text-gray-600 mb-6'>Bạn chưa đăng tin tuyển dụng nào. Hãy bắt đầu đăng tin ngay!</p>
      <Button asChild className='btn-submit'>
        <Link to={PATH.postProject}>
          <Plus className='h-5 w-5 mr-2' />
          Đăng tin tuyển dụng
        </Link>
      </Button>
    </div>
  )
}
