import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

interface QuickAction {
  id: number
  title: string
  count: number
  action: string
  onClick?: () => void
}

interface QuickActionsProps {
  actions: QuickAction[]
  title?: string
  description?: string
}

export function QuickActions({ 
  actions, 
  title = "Hành động nhanh",
  description = "Các mục cần sự chú ý của bạn"
}: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-gray-600">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {actions.map((action) => (
            <div 
              key={action.id} 
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Badge variant="destructive" className="w-8 h-6 flex items-center justify-center">
                  {action.count}
                </Badge>
                <span className="text-sm font-medium text-gray-900">{action.title}</span>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={action.onClick}
              >
                {action.action}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}