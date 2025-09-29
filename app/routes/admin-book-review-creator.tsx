import { useState } from 'react'
import { BookOpen, Plus, Search, Filter, Star, Eye, Edit, Trash2, Save, RotateCcw, Upload, Calendar, User, Target, BarChart3 } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Badge } from '~/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Textarea } from '~/components/ui/textarea'
import { Switch } from '~/components/ui/switch'
import { Separator } from '~/components/ui/separator'

export default function AdminBookReviewCreator() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedReview, setSelectedReview] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  // Mock data
  const stats = {
    totalReviews: 456,
    publishedReviews: 324,
    draftReviews: 89,
    avgRating: 4.2
  }

  const bookReviews = [
    {
      id: 'BR001',
      title: 'Đắc Nhân Tâm - Nghệ thuật giao tiếp và ảnh hưởng',
      bookTitle: 'Đắc Nhân Tâm',
      author: 'Dale Carnegie',
      category: 'Phát triển bản thân',
      reviewer: 'Admin Reviewer',
      rating: 4.5,
      status: 'published',
      publishDate: '2024-03-15',
      views: 2456,
      likes: 189,
      summary: 'Cuốn sách kinh điển về nghệ thuật giao tiếp và tạo ảnh hưởng tích cực...',
      tags: ['self-improvement', 'communication', 'leadership']
    },
    {
      id: 'BR002',
      title: 'Atomic Habits - Thói quen nguyên tử',
      bookTitle: 'Atomic Habits',
      author: 'James Clear',
      category: 'Phát triển bản thân',
      reviewer: 'Admin Reviewer',
      rating: 4.8,
      status: 'draft',
      publishDate: '',
      views: 0,
      likes: 0,
      summary: 'Hướng dẫn xây dựng thói quen tốt và loại bỏ thói quen xấu một cách khoa học...',
      tags: ['habits', 'productivity', 'self-improvement']
    },
    {
      id: 'BR003',
      title: 'Clean Code - Mã nguồn sạch',
      bookTitle: 'Clean Code',
      author: 'Robert C. Martin',
      category: 'Lập trình',
      reviewer: 'Tech Reviewer',
      rating: 4.7,
      status: 'published',
      publishDate: '2024-03-12',
      views: 1789,
      likes: 156,
      summary: 'Hướng dẫn viết code sạch, dễ đọc và bảo trì cho developers...',
      tags: ['programming', 'software-engineering', 'best-practices']
    },
    {
      id: 'BR004',
      title: 'The Lean Startup - Khởi nghiệp tinh gọn',
      bookTitle: 'The Lean Startup',
      author: 'Eric Ries',
      category: 'Kinh doanh',
      reviewer: 'Business Reviewer',
      rating: 4.3,
      status: 'review',
      publishDate: '',
      views: 0,
      likes: 0,
      summary: 'Phương pháp khởi nghiệp hiệu quả với chi phí tối thiểu...',
      tags: ['startup', 'business', 'innovation']
    }
  ]

  const [newReview, setNewReview] = useState({
    bookTitle: '',
    author: '',
    category: '',
    rating: 5,
    summary: '',
    content: '',
    tags: '',
    targetAudience: '',
    pros: '',
    cons: '',
    recommendation: '',
    isPublished: false
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'review': return 'bg-blue-100 text-blue-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Đã xuất bản'
      case 'draft': return 'Bản nháp'
      case 'review': return 'Đang duyệt'
      case 'archived': return 'Đã lưu trữ'
      default: return 'Không xác định'
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  const filteredReviews = bookReviews.filter(review => {
    const matchesSearch = 
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || review.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleCreateReview = () => {
    setIsCreating(true)
    setSelectedReview(null)
  }

  const handleSaveReview = () => {
    // Save logic here
    console.log('Saving review:', newReview)
    setIsCreating(false)
    setNewReview({
      bookTitle: '',
      author: '',
      category: '',
      rating: 5,
      summary: '',
      content: '',
      tags: '',
      targetAudience: '',
      pros: '',
      cons: '',
      recommendation: '',
      isPublished: false
    })
  }

  const handleCancelEdit = () => {
    setIsCreating(false)
    setSelectedReview(null)
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    )
  }

  if (isCreating) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tạo đánh giá sách mới</h1>
            <p className="text-gray-600 mt-1">Viết đánh giá chi tiết về cuốn sách</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleCancelEdit}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Hủy
            </Button>
            <Button onClick={handleSaveReview}>
              <Save className="w-4 h-4 mr-2" />
              Lưu đánh giá
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bookTitle">Tên sách *</Label>
                    <Input
                      id="bookTitle"
                      value={newReview.bookTitle}
                      onChange={(e) => setNewReview({...newReview, bookTitle: e.target.value})}
                      placeholder="Nhập tên sách"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Tác giả *</Label>
                    <Input
                      id="author"
                      value={newReview.author}
                      onChange={(e) => setNewReview({...newReview, author: e.target.value})}
                      placeholder="Nhập tên tác giả"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Danh mục</Label>
                    <Select value={newReview.category} onValueChange={(value) => setNewReview({...newReview, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="self-improvement">Phát triển bản thân</SelectItem>
                        <SelectItem value="business">Kinh doanh</SelectItem>
                        <SelectItem value="technology">Công nghệ</SelectItem>
                        <SelectItem value="programming">Lập trình</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="leadership">Lãnh đạo</SelectItem>
                        <SelectItem value="finance">Tài chính</SelectItem>
                        <SelectItem value="psychology">Tâm lý học</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rating">Đánh giá (1-5 sao)</Label>
                    <Select value={newReview.rating.toString()} onValueChange={(value) => setNewReview({...newReview, rating: parseInt(value)})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 sao</SelectItem>
                        <SelectItem value="2">2 sao</SelectItem>
                        <SelectItem value="3">3 sao</SelectItem>
                        <SelectItem value="4">4 sao</SelectItem>
                        <SelectItem value="5">5 sao</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Tóm tắt ngắn</Label>
                  <Textarea
                    id="summary"
                    value={newReview.summary}
                    onChange={(e) => setNewReview({...newReview, summary: e.target.value})}
                    placeholder="Viết tóm tắt ngắn gọn về cuốn sách..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Nội dung đánh giá chi tiết *</Label>
                  <Textarea
                    id="content"
                    value={newReview.content}
                    onChange={(e) => setNewReview({...newReview, content: e.target.value})}
                    placeholder="Viết đánh giá chi tiết về cuốn sách, bao gồm nội dung, phong cách viết, ưu nhược điểm..."
                    rows={8}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Phân tích chi tiết</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pros">Ưu điểm</Label>
                  <Textarea
                    id="pros"
                    value={newReview.pros}
                    onChange={(e) => setNewReview({...newReview, pros: e.target.value})}
                    placeholder="Liệt kê các ưu điểm của cuốn sách..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cons">Nhược điểm</Label>
                  <Textarea
                    id="cons"
                    value={newReview.cons}
                    onChange={(e) => setNewReview({...newReview, cons: e.target.value})}
                    placeholder="Liệt kê các nhược điểm của cuốn sách..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recommendation">Khuyến nghị</Label>
                  <Textarea
                    id="recommendation"
                    value={newReview.recommendation}
                    onChange={(e) => setNewReview({...newReview, recommendation: e.target.value})}
                    placeholder="Khuyến nghị cho ai nên đọc sách này và tại sao..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt xuất bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="publish">Xuất bản ngay</Label>
                  <Switch
                    id="publish"
                    checked={newReview.isPublished}
                    onCheckedChange={(checked) => setNewReview({...newReview, isPublished: checked})}
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (phân cách bằng dấu phẩy)</Label>
                  <Input
                    id="tags"
                    value={newReview.tags}
                    onChange={(e) => setNewReview({...newReview, tags: e.target.value})}
                    placeholder="self-improvement, leadership, productivity"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Đối tượng độc giả</Label>
                  <Textarea
                    id="targetAudience"
                    value={newReview.targetAudience}
                    onChange={(e) => setNewReview({...newReview, targetAudience: e.target.value})}
                    placeholder="Mô tả đối tượng độc giả phù hợp..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hướng dẫn viết đánh giá</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="space-y-1">
                  <p className="font-medium">📖 Nội dung chính:</p>
                  <p>Tóm tắt những ý tưởng chính của sách</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">✍️ Phong cách viết:</p>
                  <p>Đánh giá cách viết của tác giả, độ dễ hiểu</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">💡 Giá trị thực tiễn:</p>
                  <p>Sách có thể áp dụng vào thực tế như thế nào</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">🎯 Đối tượng phù hợp:</p>
                  <p>Ai nên đọc sách này và tại sao</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý đánh giá sách</h1>
          <p className="text-gray-600 mt-1">Tạo và quản lý các đánh giá sách cho nền tảng</p>
        </div>
        <Button onClick={handleCreateReview}>
          <Plus className="w-4 h-4 mr-2" />
          Tạo đánh giá mới
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng đánh giá</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalReviews)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-gray-600">+12 đánh giá mới tuần này</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đã xuất bản</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.publishedReviews)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-green-600">71% tổng số đánh giá</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bản nháp</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.draftReviews)}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Edit className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-gray-600">Cần hoàn thiện</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đánh giá TB</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgRating}/5</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              {renderStars(stats.avgRating)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="published">Đã xuất bản</TabsTrigger>
          <TabsTrigger value="draft">Bản nháp</TabsTrigger>
          <TabsTrigger value="review">Đang duyệt</TabsTrigger>
          <TabsTrigger value="analytics">Thống kê</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Tìm kiếm theo tên sách, tác giả, danh mục..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="published">Đã xuất bản</SelectItem>
                    <SelectItem value="draft">Bản nháp</SelectItem>
                    <SelectItem value="review">Đang duyệt</SelectItem>
                    <SelectItem value="archived">Đã lưu trữ</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                    <SelectItem value="Phát triển bản thân">Phát triển bản thân</SelectItem>
                    <SelectItem value="Kinh doanh">Kinh doanh</SelectItem>
                    <SelectItem value="Lập trình">Lập trình</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Lọc nâng cao
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reviews Table */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách đánh giá sách</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sách</TableHead>
                      <TableHead>Tác giả</TableHead>
                      <TableHead>Danh mục</TableHead>
                      <TableHead>Đánh giá</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Người viết</TableHead>
                      <TableHead>Lượt xem</TableHead>
                      <TableHead>Ngày xuất bản</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReviews.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium text-sm">{review.bookTitle}</p>
                            <p className="text-xs text-gray-600 line-clamp-1">{review.summary}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{review.author}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {review.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {renderStars(review.rating)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getStatusColor(review.status)}>
                            {getStatusText(review.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{review.reviewer}</TableCell>
                        <TableCell className="text-sm">
                          <div className="flex items-center space-x-2">
                            <Eye className="w-3 h-3 text-gray-400" />
                            <span>{formatNumber(review.views)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">
                          {review.publishDate || 'Chưa xuất bản'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">
                  Hiển thị {filteredReviews.length} trong tổng số {bookReviews.length} đánh giá
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Trước
                  </Button>
                  <Button variant="outline" size="sm" className="bg-blue-600 text-white">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <Button variant="outline" size="sm">
                    Sau
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="published">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-600">Danh sách đánh giá đã xuất bản sẽ hiển thị ở đây</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="draft">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-600">Danh sách bản nháp sẽ hiển thị ở đây</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-600">Danh sách đánh giá đang duyệt sẽ hiển thị ở đây</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Thống kê đánh giá sách
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Danh mục phổ biến</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Phát triển bản thân</span>
                      <span className="text-sm font-medium">142 đánh giá</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Kinh doanh</span>
                      <span className="text-sm font-medium">98 đánh giá</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Lập trình</span>
                      <span className="text-sm font-medium">76 đánh giá</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Marketing</span>
                      <span className="text-sm font-medium">54 đánh giá</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium">Phân bố điểm đánh giá</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm w-8">5⭐</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }} />
                      </div>
                      <span className="text-sm w-12 text-right">65%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm w-8">4⭐</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }} />
                      </div>
                      <span className="text-sm w-12 text-right">25%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm w-8">3⭐</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '8%' }} />
                      </div>
                      <span className="text-sm w-12 text-right">8%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm w-8">2⭐</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full" style={{ width: '2%' }} />
                      </div>
                      <span className="text-sm w-12 text-right">2%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm w-8">1⭐</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full" style={{ width: '0%' }} />
                      </div>
                      <span className="text-sm w-12 text-right">0%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}