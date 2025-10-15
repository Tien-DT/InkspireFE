import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { UserRole } from '~/types/user.type'
import { IconBriefcase, IconUser } from '@tabler/icons-react'

interface RoleSelectionDialogProps {
  open: boolean
  onClose: () => void
  onSelectRole: (role: UserRole) => void
}

export function RoleSelectionDialog({ open, onClose, onSelectRole }: RoleSelectionDialogProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)

  const handleConfirm = () => {
    if (selectedRole) {
      onSelectRole(selectedRole)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-center'>Chọn vai trò của bạn</DialogTitle>
          <DialogDescription className='text-center'>
            Vui lòng chọn vai trò để tiếp tục đăng ký với Google
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <button
            onClick={() => setSelectedRole(UserRole.CLIENT)}
            className={`flex items-center gap-4 p-6 border-2 rounded-xl transition-all hover:border-emerald-500 hover:bg-emerald-50/50 ${
              selectedRole === UserRole.CLIENT ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
            }`}
          >
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100'>
              <IconUser className='h-6 w-6 text-emerald-600' />
            </div>
            <div className='flex-1 text-left'>
              <h3 className='font-semibold text-lg'>Khách hàng</h3>
              <p className='text-sm text-muted-foreground'>Tôi muốn tìm freelancer cho dự án của mình</p>
            </div>
          </button>
          <button
            onClick={() => setSelectedRole(UserRole.FREELANCER)}
            className={`flex items-center gap-4 p-6 border-2 rounded-xl transition-all hover:border-emerald-500 hover:bg-emerald-50/50 ${
              selectedRole === UserRole.FREELANCER ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
            }`}
          >
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100'>
              <IconBriefcase className='h-6 w-6 text-emerald-600' />
            </div>
            <div className='flex-1 text-left'>
              <h3 className='font-semibold text-lg'>Freelancer</h3>
              <p className='text-sm text-muted-foreground'>Tôi muốn làm việc và nhận dự án</p>
            </div>
          </button>
        </div>
        <div className='flex justify-end gap-3'>
          <Button variant='outline' onClick={onClose}>
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedRole}
            className='bg-emerald-500 hover:bg-emerald-600'
          >
            Xác nhận
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
