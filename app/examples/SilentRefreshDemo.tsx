import { useAuth } from '~/contexts/AuthContext'
import { useSilentRefresh } from '~/hooks/useSilentRefresh'
import { Button } from '~/components/ui/button'
import { RefreshCw, Clock, CheckCircle } from 'lucide-react'

/**
 * Example component để demo silent refresh functionality
 */
export function SilentRefreshDemo() {
  const { authReady, isAuthenticated } = useAuth()
  const { performSilentRefresh, shouldRefresh } = useSilentRefresh()

  const handleManualRefresh = async () => {
    const success = await performSilentRefresh()
    if (success) {
      alert('Silent refresh thành công!')
    } else {
      alert('Silent refresh thất bại!')
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Silent Refresh Demo</h2>
      
      {/* Auth Status */}
      <div className="bg-gray-100 p-4 rounded">
        <h3 className="font-semibold mb-2">Trạng thái Authentication</h3>
        <div className="flex items-center gap-2">
          {authReady ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <Clock className="h-5 w-5 text-yellow-500" />
          )}
          <span>
            Auth Ready: {authReady ? 'Yes' : 'No'}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          {isAuthenticated ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <Clock className="h-5 w-5 text-red-500" />
          )}
          <span>
            Authenticated: {isAuthenticated ? 'Yes' : 'No'}
          </span>
        </div>
      </div>

      {/* Manual Refresh */}
      <div className="bg-gray-100 p-4 rounded">
        <h3 className="font-semibold mb-2">Manual Silent Refresh</h3>
        <p className="text-sm text-gray-600 mb-3">
          Test silent refresh bằng cách click button bên dưới
        </p>
        <div className="space-y-2">
          <Button 
            onClick={handleManualRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Thực hiện Silent Refresh
          </Button>
          <p className="text-xs text-gray-500">
            Should refresh: {shouldRefresh() ? 'Yes' : 'No'}
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded">
        <h3 className="font-semibold mb-2">Hướng dẫn test</h3>
        <ul className="text-sm space-y-1">
          <li>• Reload trang để test automatic silent refresh</li>
          <li>• Đợi access token hết hạn để test refresh mechanism</li>
          <li>• Kiểm tra console để xem logs của silent refresh</li>
          <li>• Test với refresh token hết hạn để xem logout behavior</li>
        </ul>
      </div>
    </div>
  )
}
