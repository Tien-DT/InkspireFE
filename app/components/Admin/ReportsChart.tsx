import { useState } from 'react'
import { Calendar, Download, TrendingUp, TrendingDown, BarChart3, PieChart, LineChart } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Badge } from '~/components/ui/badge'

interface ChartData {
  period: string
  value: number
  change?: number
  previousValue?: number
}

interface MetricSummary {
  title: string
  value: string
  change: number
  trend: 'up' | 'down' | 'stable'
  icon: React.ReactNode
}

interface ReportsChartProps {
  title: string
  description?: string
  data: ChartData[]
  metrics: MetricSummary[]
  chartType?: 'line' | 'bar' | 'pie'
  timeRange?: 'today' | 'week' | 'month' | 'quarter' | 'year'
  onTimeRangeChange?: (range: string) => void
  onExport?: () => void
  isLoading?: boolean
}

export function ReportsChart({ 
  title,
  description,
  data,
  metrics,
  chartType = 'line',
  timeRange = 'month',
  onTimeRangeChange,
  onExport,
  isLoading = false
}: ReportsChartProps) {
  const [selectedChart, setSelectedChart] = useState(chartType)

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case 'today': return 'Hôm nay'
      case 'week': return '7 ngày qua'
      case 'month': return '30 ngày qua'
      case 'quarter': return '3 tháng qua'
      case 'year': return '12 tháng qua'
      default: return range
    }
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />
      case 'stable': return <div className="h-4 w-4" />
    }
  }

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      case 'stable': return 'text-gray-600'
    }
  }

  const getChartIcon = (type: string) => {
    switch (type) {
      case 'line': return <LineChart className="h-4 w-4" />
      case 'bar': return <BarChart3 className="h-4 w-4" />
      case 'pie': return <PieChart className="h-4 w-4" />
      default: return <LineChart className="h-4 w-4" />
    }
  }

  // Simple chart rendering with CSS (placeholder for actual chart library)
  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )
    }

    return (
      <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 flex items-end space-x-2">
        {data.map((item, index) => {
          const maxValue = Math.max(...data.map(d => d.value))
          const height = (item.value / maxValue) * 200
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center space-y-2">
              <div 
                className="bg-blue-500 rounded-t w-full transition-all duration-300 hover:bg-blue-600"
                style={{ height: `${height}px` }}
                title={`${item.period}: ${item.value.toLocaleString('vi-VN')}`}
              />
              <span className="text-xs text-gray-600 text-center">
                {item.period}
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={onTimeRangeChange}>
              <SelectTrigger className="w-[140px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hôm nay</SelectItem>
                <SelectItem value="week">7 ngày qua</SelectItem>
                <SelectItem value="month">30 ngày qua</SelectItem>
                <SelectItem value="quarter">3 tháng qua</SelectItem>
                <SelectItem value="year">12 tháng qua</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedChart} onValueChange={(value: string) => setSelectedChart(value as 'line' | 'bar' | 'pie')}>
              <SelectTrigger className="w-[120px]">
                {getChartIcon(selectedChart)}
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Biểu đồ đường</SelectItem>
                <SelectItem value="bar">Biểu đồ cột</SelectItem>
                <SelectItem value="pie">Biểu đồ tròn</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Xuất
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Metrics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-white rounded-lg">
                  {metric.icon}
                </div>
                {getTrendIcon(metric.trend)}
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">
                  {metric.value}
                </p>
                <p className="text-sm text-gray-600">
                  {metric.title}
                </p>
                <div className="flex items-center space-x-1">
                  <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </span>
                  <span className="text-xs text-gray-500">
                    so với kỳ trước
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Biểu đồ thống kê
            </h3>
            <Badge variant="outline">
              {getTimeRangeLabel(timeRange)}
            </Badge>
          </div>
          {renderChart()}
        </div>

        {/* Data Table */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Dữ liệu chi tiết</h4>
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-900">
                    Thời gian
                  </th>
                  <th className="px-4 py-2 text-right font-medium text-gray-900">
                    Giá trị
                  </th>
                  <th className="px-4 py-2 text-right font-medium text-gray-900">
                    Thay đổi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-900">
                      {item.period}
                    </td>
                    <td className="px-4 py-2 text-right font-medium text-gray-900">
                      {item.value.toLocaleString('vi-VN')}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {item.change !== undefined ? (
                        <span className={`font-medium ${
                          item.change > 0 ? 'text-green-600' : 
                          item.change < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {item.change > 0 ? '+' : ''}{item.change}%
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart Insights */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Nhận xét từ dữ liệu
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Xu hướng tăng trưởng ổn định trong {getTimeRangeLabel(timeRange).toLowerCase()}</li>
            <li>• Đỉnh cao đạt được vào {data.reduce((max, item) => item.value > max.value ? item : max, data[0])?.period}</li>
            <li>• Tổng cộng: {data.reduce((sum, item) => sum + item.value, 0).toLocaleString('vi-VN')}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}