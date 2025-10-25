import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Settings, Save, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { useCommissionPercentages, useUpdateCommissionPercentages } from '~/hooks/useCommissionSettings'

export function CommissionSettings() {
  const { data: commissions, isLoading: loading, refetch } = useCommissionPercentages()
  const updateMutation = useUpdateCommissionPercentages()

  const [editValues, setEditValues] = useState({
    freelancer: 20,
    client: 0
  })

  useEffect(() => {
    if (commissions) {
      setEditValues({
        freelancer: commissions.freelancerCommissionPercentage,
        client: commissions.clientCommissionPercentage
      })
    }
  }, [commissions])

  const handleSave = async () => {
    // Validation
    if (editValues.freelancer < 0 || editValues.freelancer > 100) {
      toast.error('% hoa hồng Freelancer phải từ 0-100')
      return
    }
    if (editValues.client < 0 || editValues.client > 100) {
      toast.error('% hoa hồng Client phải từ 0-100')
      return
    }

    updateMutation.mutate({
      freelancerCommissionPercentage: editValues.freelancer,
      clientCommissionPercentage: editValues.client
    })
  }

  const formatPercent = (value: number) => `${value}%`

  return (
    <Card className='bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-0'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Settings className='h-5 w-5 text-amber-600' />
            <CardTitle className='text-lg font-bold text-amber-800'>
              Cài đặt % Hoa hồng
            </CardTitle>
          </div>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => refetch()}
            disabled={loading}
            className='text-amber-600 hover:text-amber-700'
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <CardDescription className='text-amber-700'>
          Điều chỉnh phần trăm hoa hồng mà nền tảng giữ lại khi Freelancer và Client rút tiền
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid gap-4 md:grid-cols-2'>
          {/* Freelancer Commission */}
          <div className='space-y-2 bg-white/80 dark:bg-slate-900/50 p-4 rounded-lg border border-purple-200'>
            <Label htmlFor='freelancer-commission' className='text-sm font-semibold text-purple-700'>
              Hoa hồng Freelancer (%)
            </Label>
            <Input
              id='freelancer-commission'
              type='number'
              min='0'
              max='100'
              step='0.1'
              value={editValues.freelancer}
              onChange={(e) => setEditValues({ ...editValues, freelancer: parseFloat(e.target.value) || 0 })}
              className='text-lg font-bold border-purple-300 focus:border-purple-500'
            />
            <div className='text-xs text-gray-600 space-y-1'>
              <p>Nền tảng giữ: <span className='font-bold text-purple-600'>{formatPercent(editValues.freelancer)}</span></p>
              <p>Freelancer nhận: <span className='font-bold text-green-600'>{formatPercent(100 - editValues.freelancer)}</span></p>
            </div>
            <div className='mt-2 p-2 bg-purple-50 rounded text-xs text-purple-700'>
              Hiện tại: {formatPercent(commissions?.freelancerCommissionPercentage ?? 20)}
            </div>
          </div>

          {/* Client Commission */}
          <div className='space-y-2 bg-white/80 dark:bg-slate-900/50 p-4 rounded-lg border border-blue-200'>
            <Label htmlFor='client-commission' className='text-sm font-semibold text-blue-700'>
              Hoa hồng Client (%)
            </Label>
            <Input
              id='client-commission'
              type='number'
              min='0'
              max='100'
              step='0.1'
              value={editValues.client}
              onChange={(e) => setEditValues({ ...editValues, client: parseFloat(e.target.value) || 0 })}
              className='text-lg font-bold border-blue-300 focus:border-blue-500'
            />
            <div className='text-xs text-gray-600 space-y-1'>
              <p>Nền tảng giữ: <span className='font-bold text-blue-600'>{formatPercent(editValues.client)}</span></p>
              <p>Client nhận: <span className='font-bold text-green-600'>{formatPercent(100 - editValues.client)}</span></p>
            </div>
            <div className='mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700'>
              Hiện tại: {formatPercent(commissions?.clientCommissionPercentage ?? 0)}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className='flex justify-end pt-2'>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className='bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'
          >
            <Save className='h-4 w-4 mr-2' />
            {updateMutation.isPending ? 'Đang lưu...' : 'Lưu cài đặt'}
          </Button>
        </div>

        {/* Info */}
        <div className='mt-4 p-3 bg-amber-100/50 dark:bg-amber-900/20 rounded-lg'>
          <p className='text-xs text-amber-800 dark:text-amber-200'>
            ⓘ <span className='font-semibold'>Lưu ý:</span> Thay đổi % hoa hồng chỉ áp dụng cho các yêu cầu rút tiền mới, 
            không ảnh hưởng đến các yêu cầu đã tạo trước đó.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
