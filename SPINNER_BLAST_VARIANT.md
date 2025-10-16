# 🎆 Blast Spinner Variant - NEW!

## Tổng quan

**Blast Spinner** là variant mới nhất với hiệu ứng **nổ tia** (radial blast) cực kỳ đẹp mắt và độc đáo!

### ✨ Đặc điểm

- 🎆 **8 tia nổ radial** xung quanh tâm
- 💫 **Bounce effect** ở trung tâm
- 🎨 **Brand color** (primary) tự động
- 🌓 **Dark mode** responsive
- ⚡ **Performance**: Hardware-accelerated CSS animations

---

## 🚀 Cách sử dụng

### 1. Basic Usage

```tsx
import { Spinner } from '~/components/ui/spinner'

<Spinner variant='blast' size='lg' />
```

### 2. Page Loading

```tsx
import { LoadingState } from '~/components/ui/spinner'

<LoadingState 
  message='Đang tải...' 
  size='lg' 
  variant='blast' 
/>
```

### 3. Full Page Overlay

```tsx
import { LoadingOverlay } from '~/components/ui/spinner'

<LoadingOverlay 
  message='Đang xử lý thanh toán...' 
  size='xl' 
  variant='blast' 
/>
```

---

## 🎨 So sánh Variants

| Variant | Animation Style | Best For | Visual Effect |
|---------|----------------|----------|---------------|
| **`blast`** ⭐ NEW | Radial explosion | Premium features, payments | 🎆 Dramatic, eye-catching |
| **`gradient`** | Rotating ring + pulse | Page loading | 🌈 Smooth, modern |
| **`primary`** | Simple border spin | General loading | ⚪ Clean, minimal |

---

## 📐 Sizes

Blast spinner hoạt động tốt với tất cả sizes:

```tsx
// Small - 16px (cho buttons, inline)
<Spinner variant='blast' size='sm' />

// Medium - 32px (sections, cards)
<Spinner variant='blast' size='md' />

// Large - 48px (pages) ⭐ RECOMMENDED
<Spinner variant='blast' size='lg' />

// Extra Large - 64px (full overlays)
<Spinner variant='blast' size='xl' />
```

**Recommended:** Dùng `lg` hoặc `xl` để hiệu ứng blast rõ ràng nhất.

---

## 🎯 Use Cases

### ✅ Khi nào dùng Blast Spinner?

1. **Premium/VIP features**
   ```tsx
   // Subscription purchase
   <LoadingOverlay variant='blast' message='Đang kích hoạt gói Premium...' />
   ```

2. **Payment processing**
   ```tsx
   // Critical transactions
   <LoadingState variant='blast' message='Đang xử lý thanh toán...' size='xl' />
   ```

3. **Special actions**
   ```tsx
   // AI processing, important uploads
   <Spinner variant='blast' size='lg' label='Đang xử lý bằng AI...' />
   ```

4. **Success celebrations** (kết hợp với toast)
   ```tsx
   // After successful action
   toast.success('Thành công!', {
     icon: <Spinner variant='blast' size='sm' />
   })
   ```

### ❌ Khi nào KHÔNG nên dùng?

- ❌ Simple list loading (dùng `gradient` hoặc `primary`)
- ❌ Inline buttons (quá dramatic)
- ❌ Background tasks (không cần attention)

---

## 🎨 CSS Implementation

### Animation Details

**2 layers:**
1. **`::before`** - 8 radial dots với blast animation
2. **`::after`** - Center circle với bounce animation

**Colors:**
- Uses `var(--color-primary)` từ design tokens
- Auto-adapts to light/dark mode

**Timing:**
- Duration: 1s
- Easing: ease-in
- Infinite loop

---

## 💡 Pro Tips

### 1. Combine with Messages

```tsx
<LoadingState 
  variant='blast' 
  size='lg'
  message='Đang xử lý giao dịch... Vui lòng không tắt trang!'
/>
```

### 2. Size Matters

```tsx
// ❌ Too small - effect not visible
<Spinner variant='blast' size='sm' />

// ✅ Perfect - effect clearly visible
<Spinner variant='blast' size='lg' />
```

### 3. Use for Impact Moments

```tsx
// Payment success
{isPaying && <LoadingOverlay variant='blast' message='Đang thanh toán...' />}

// AI processing
{isProcessingAI && <LoadingState variant='blast' message='AI đang phân tích...' />}
```

---

## 🎬 Examples in Project

### Example 1: Premium Subscription Purchase

```tsx
// app/routes/subscriptions.tsx
import { LoadingOverlay } from '~/components/ui/spinner'

function SubscriptionPage() {
  const [isPurchasing, setIsPurchasing] = useState(false)
  
  return (
    <>
      {isPurchasing && (
        <LoadingOverlay 
          variant='blast' 
          size='xl'
          message='Đang kích hoạt gói Premium của bạn...' 
        />
      )}
      {/* ... */}
    </>
  )
}
```

### Example 2: AI Complaint Processing

```tsx
// app/routes/project-detail.tsx
import { LoadingState } from '~/components/ui/spinner'

{isSubmittingComplaint && (
  <LoadingState 
    variant='blast' 
    size='lg'
    message='AI đang phân tích khiếu nại...'
  />
)}
```

### Example 3: Critical Payment

```tsx
// app/routes/payment.tsx
{isProcessingPayment && (
  <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80'>
    <div className='text-center space-y-4'>
      <Spinner variant='blast' size='xl' />
      <p className='text-white text-lg font-semibold'>
        Đang xử lý thanh toán...
      </p>
      <p className='text-white/70 text-sm'>
        Vui lòng không tắt trang này
      </p>
    </div>
  </div>
)}
```

---

## 🔧 Customization

### Change Colors

Blast spinner sử dụng `var(--color-primary)`. Để thay đổi:

```css
/* app/app.css */
.blast-loader-custom::before,
.blast-loader-custom::after {
  background-image: radial-gradient(circle 10px, #your-color 100%, transparent 0);
  /* ... */
}
```

### Adjust Speed

```css
.blast-loader {
  /* Default: 1s */
  animation: blast 1.5s ease-in infinite; /* Slower */
  animation: blast 0.7s ease-in infinite; /* Faster */
}
```

---

## 📊 Performance

- ✅ **CSS-only** - No JavaScript overhead
- ✅ **Hardware-accelerated** - GPU rendering
- ✅ **60fps** - Smooth on all devices
- ✅ **Lightweight** - ~50 lines CSS

---

## 🎓 Summary

**Blast Spinner** là variant **premium** cho:
- 💳 Payment processing
- 🤖 AI operations
- ⭐ VIP/Premium features
- 🎉 Special moments

**Recommended size:** `lg` hoặc `xl`

**Kết hợp tốt với:**
- `LoadingOverlay` cho full-screen
- `LoadingState` cho sections
- Dramatic messages

**Đừng dùng cho:**
- Simple lists
- Background tasks
- Inline buttons

---

**Blast spinner - Make your loading states EPIC!** 🎆✨
