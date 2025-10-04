# Quản lý Ứng tuyển cho Freelancer

## 📋 Tổng quan

Trang **Quản lý Ứng tuyển** (`/manage-applications`) được thiết kế riêng cho **Freelancer** để theo dõi và quản lý tất cả các công việc mà họ đã ứng tuyển.

## 🎯 Phân biệt theo Role

### 👔 Client (Role = 0)

- Xem menu: **"Quản lý bài đăng"** (`/manage-post-project`)
- Chức năng: Quản lý các bài tuyển dụng đã đăng, xem ứng viên, chấp nhận/từ chối

### 💼 Freelancer (Role ≠ 0)

- Xem menu: **"Quản lý ứng tuyển"** (`/manage-applications`)
- Chức năng: Quản lý các công việc đã ứng tuyển, theo dõi trạng thái

## ✨ Tính năng chính

### 1. **Dashboard thống kê**

- Tổng số ứng tuyển
- Số lượng đang chờ duyệt
- Số lượng được chấp nhận
- Số lượng bị từ chối

### 2. **Lọc theo trạng thái**

- Tất cả
- Đang chờ (pending)
- Được chấp nhận (accepted)
- Bị từ chối (rejected)

### 3. **Danh sách ứng tuyển**

Mỗi card hiển thị:

- Logo công ty
- Tên công việc
- Tên công ty
- Địa điểm
- Ngân sách
- Thời gian dự án
- Ngày ứng tuyển
- Trạng thái (badge màu)
- Các kỹ năng yêu cầu
- Nút "Xem chi tiết" và "Rút ứng tuyển"

### 4. **Dialog chi tiết với 2 tabs**

#### Tab 1: Thông tin công việc

- Thông tin công ty và logo
- Ngân sách dự án
- Thời gian dự án
- Địa điểm
- Hạn nộp hồ sơ
- Mô tả công việc chi tiết
- Kỹ năng yêu cầu
- Danh mục công việc

#### Tab 2: Hồ sơ ứng tuyển

- Trạng thái ứng tuyển hiện tại
- Ngày ứng tuyển
- Mức giá đề xuất
- Thời gian ước tính hoàn thành
- Thư xin việc (cover letter)
- Các nút hành động:
  - **Pending**: "Rút ứng tuyển", "Chỉnh sửa hồ sơ"
  - **Accepted**: Thông báo chúc mừng
  - **Rejected**: Thông báo động viên

## 🎨 UI/UX Features

### Status Badges

- **Pending** (Đang chờ): Yellow badge with AlertCircle icon
- **Accepted** (Được chấp nhận): Green badge with CheckCircle icon
- **Rejected** (Bị từ chối): Red badge with XCircle icon
- **Withdrawn** (Đã rút): Gray badge with XCircle icon

### Colors

- Gradient background: `from-slate-50 via-blue-50 to-cyan-50`
- Primary gradient: `from-blue-600 to-cyan-600`
- Status-specific colors for cards and badges

### Responsive Design

- Mobile-friendly grid layouts
- Collapsible cards
- Touch-friendly buttons

## 📊 Mock Data

File hiện tại sử dụng **5 ứng tuyển mẫu**:

1. **Thiết kế Logo cho Startup AI** (Pending)
2. **Phát triển Website thương mại điện tử** (Accepted)
3. **Thiết kế UI/UX cho ứng dụng Mobile Banking** (Rejected)
4. **Viết Content Marketing cho Website** (Pending)
5. **Phát triển ứng dụng React Native** (Pending)

## 🔗 Navigation Flow

```
Header > User Menu > "Quản lý ứng tuyển" (chỉ hiện với Freelancer)
  ↓
/manage-applications
  ↓
Click "Xem chi tiết" → Dialog với 2 tabs
  ↓
Tab 1: Thông tin công việc | Tab 2: Hồ sơ ứng tuyển
```

## 🚀 API Integration (TODO)

Cần tạo các API endpoints:

```typescript
// Get all applications by user
GET /api/applications/my-applications

// Get application details
GET /api/applications/:id

// Withdraw application
DELETE /api/applications/:id

// Update application
PATCH /api/applications/:id
```

## 📁 Files Modified

1. **`app/routes/manage-applications.tsx`** - Component chính
2. **`app/routes.ts`** - Thêm route mới
3. **`app/constants/path.ts`** - Thêm path constant
4. **`app/components/Header/Header.tsx`** - Logic hiển thị menu theo role

## 🎯 Logic hiển thị menu

```tsx
// In Header.tsx
const isClient = profile?.role === UserRole.CLIENT
const isFreelancer = profile?.role !== undefined && profile?.role !== UserRole.CLIENT

{
  isClient && (
    <DropdownMenuItem>
      <Link to={PATH.managePostProject}>Quản lý bài đăng</Link>
    </DropdownMenuItem>
  )
}

{
  isFreelancer && (
    <DropdownMenuItem>
      <Link to={PATH.manageApplications}>Quản lý ứng tuyển</Link>
    </DropdownMenuItem>
  )
}
```

## 🔧 Customization

Để thay đổi số lượng ứng tuyển hiển thị hoặc thêm filters mới, chỉnh sửa:

```tsx
const filteredApplications = mockApplications.filter((app) => {
  if (filterStatus === 'all') return true
  return app.status === filterStatus
})
```

## 📝 Notes

- Component sử dụng shadcn/ui components
- Responsive design với Tailwind CSS
- Date formatting với date-fns và locale VI
- Icons từ lucide-react
- Dialog size: 85vw x 90vh với scrollbar-hide class
