import { Card, CardContent } from '~/components/ui/card'

interface AdSpaceProps {
  className?: string
}

export function AdSpace({ className = '' }: AdSpaceProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6 text-center">
        <div className="text-gray-400 text-sm">Quảng cáo</div>
      </CardContent>
    </Card>
  )
}