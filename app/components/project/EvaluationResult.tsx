import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Progress } from '~/components/ui/progress'
import { Badge } from '~/components/ui/badge'

interface EvaluationResultProps {
  result: any
}

export function EvaluationResult({ result }: EvaluationResultProps) {
  if (!result) return null

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-green-500'
    if (score >= 5) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kết quả đánh giá của AI</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center justify-center space-y-2">
            <h3 className="text-lg font-semibold">Điểm trung bình</h3>
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="text-blue-500"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${result.averageScore * 10}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold">{result.averageScore.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>Evaluation Score</span>
                <span>{result.evaluationScore}</span>
              </div>
              <Progress value={result.evaluationScore * 10} className={getScoreColor(result.evaluationScore)} />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Content Quality</span>
                <span>{result.contentQualityScore}</span>
              </div>
              <Progress value={result.contentQualityScore * 10} className={getScoreColor(result.contentQualityScore)} />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Technical Accuracy</span>
                <span>{result.technicalAccuracyScore}</span>
              </div>
              <Progress value={result.technicalAccuracyScore * 10} className={getScoreColor(result.technicalAccuracyScore)} />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Style Compliance</span>
                <span>{result.styleComplianceScore}</span>
              </div>
              <Progress value={result.styleComplianceScore * 10} className={getScoreColor(result.styleComplianceScore)} />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Completeness</span>
                <span>{result.completenessScore}</span>
              </div>
              <Progress value={result.completenessScore * 10} className={getScoreColor(result.completenessScore)} />
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-semibold">Phân tích</h4>
          <p className="text-sm text-gray-700">{result.evaluationAnalysis}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold">Điểm mạnh</h4>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {result.strengths.map((item: string, index: number) => <li key={index}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Điểm yếu</h4>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {result.weaknesses.map((item: string, index: number) => <li key={index}>{item}</li>)}
            </ul>
          </div>
        </div>
        <div>
          <h4 className="font-semibold">Đề xuất</h4>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {result.suggestions.map((item: string, index: number) => <li key={index}>{item}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Thành phần bị thiếu</h4>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {result.missingElements.map((item: string, index: number) => <li key={index}>{item}</li>)}
          </ul>
        </div>
        <div className="flex justify-between items-center">
          <Badge variant={result.meetsRequirements ? 'default' : 'destructive'}>
            {result.meetsRequirements ? 'Đạt yêu cầu' : 'Chưa đạt yêu cầu'}
          </Badge>
          <span className="text-xs text-gray-500">Model: {result.aiModel}</span>
        </div>
      </CardContent>
    </Card>
  )
}
