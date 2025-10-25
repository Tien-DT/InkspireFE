import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { settingsApi, type CommissionPercentagesResponse } from '~/apis/settings.api'
import { toast } from 'sonner'

export const useCommissionPercentages = () => {
  return useQuery({
    queryKey: ['commission-percentages'],
    queryFn: () => settingsApi.getCommissionPercentages(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  })
}

export const useUpdateCommissionPercentages = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CommissionPercentagesResponse) => settingsApi.updateCommissionPercentages(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commission-percentages'] })
      queryClient.invalidateQueries({ queryKey: ['withdraw-stats'] })
      toast.success('Đã cập nhật tỷ lệ hoa hồng')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Không thể cập nhật tỷ lệ hoa hồng')
    }
  })
}
