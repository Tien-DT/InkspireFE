import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

interface Activity {
  id: number
  type: string
  message: string
  time: string
  isNew?: boolean
}

interface RecentActivitiesProps {
  activities: Activity[]
  title?: string
  description?: string
}

export function RecentActivities({ 
  activities, 
  title = "Hoạt động gần đây",
  description = "Các hoạt động và sự kiện mới nhất trên nền tảng"
}: RecentActivitiesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-gray-600">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                activity.isNew ? 'bg-blue-600' : 'bg-gray-400'
              }`} />
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}