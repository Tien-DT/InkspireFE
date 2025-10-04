# Theme Update Guide - Inkspire UI Standardization

## 🎨 Design System Overview

### Color Scheme (từ Homepage)

- **Background**: `bg-background` (gradient từ CSS variables)
- **Foreground**: `text-foreground` (text tối)
- **Section Hero**: `bg-section` (gradient xanh dương-cyan)
- **Gradient Text**: `text-gradient` (text với gradient)

### Button Styles

#### Submit/Primary Buttons

```tsx
// ❌ OLD:
className = 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
className = 'bg-blue-600 hover:bg-blue-700'

// ✅ NEW:
className = 'btn-submit'
// Hoặc với icon:
className = 'btn-submit flex items-center gap-2'
```

#### Cancel/Secondary Buttons

```tsx
// ❌ OLD:
variant = 'outline'
className = 'border-2'

// ✅ NEW:
className = 'btn-cancel'
```

### Surface/Card Styles

```tsx
// ❌ OLD:
className='bg-white rounded-lg shadow-sm border'

// ✅ NEW:
className='surface'
// Hoặc giữ nguyên Card component (đã có bg-white từ CSS variables)
<Card> ... </Card>
```

### Page Backgrounds

```tsx
// ❌ OLD:
className = 'min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50'
className = 'min-h-screen bg-gray-50'

// ✅ NEW:
className = 'min-h-screen bg-background'
```

### Hero Sections

```tsx
// ❌ OLD:
className = 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'

// ✅ NEW:
className = 'bg-section text-white'
```

### Gradient Text (Headings)

```tsx
// ❌ OLD:
className = 'text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'

// ✅ NEW:
className = 'text-4xl font-bold text-gradient'
```

## 📋 File Update Checklist

### ✅ Core Pages (Non-Auth)

- [ ] `profile.tsx`
  - Background: `bg-background`
  - Submit buttons → `btn-submit`
  - Cancel buttons → `btn-cancel`
  - Gradient text trong headers

- [ ] `manage-applications.tsx`
  - Background: `bg-background`
  - Primary buttons → `btn-submit`
  - Filter tabs styling
  - Hero header with gradient text

- [ ] `manage-post-project.tsx`
  - Background: `bg-background`
  - Action buttons → `btn-submit`/`btn-cancel`
  - Status badges giữ nguyên (có màu riêng)

- [ ] `manage-project.tsx`
  - Background: `bg-background`
  - Buttons standardization

- [ ] `post-project.tsx`
  - Background: `bg-background`
  - Form submit → `btn-submit`
  - Form cancel → `btn-cancel`

- [ ] `post-new-project.tsx`
  - Wizard buttons
  - Form styling

- [ ] `jobs-freelancer.tsx`
  - Background: `bg-background`
  - Search/filter UI
  - Apply buttons → `btn-submit`

- [ ] `search-freelancer.tsx`
  - Similar to jobs-freelancer

- [ ] `dashboard-freelancer.tsx`
  - Stats cards
  - Action buttons

- [ ] `payment.tsx`
  - Payment buttons
  - Form styling

- [ ] `chat.tsx`
  - Message UI (giữ nguyên nếu có design riêng)

## 🔧 CSS Variables Reference

```css
/* From app.css */
:root {
  --background: linear-gradient(to bottom, #f3feff, #e3f2fd);
  --foreground: oklch(0.3 0 0);
  --section: linear-gradient(to right, #48acf6 5%, #63c1b1 50%);

  --card: oklch(1 0 0); /* white */
  --card-foreground: oklch(0.3 0 0);

  --primary: #265dab;
  --primary-foreground: oklch(1 0 0);
}
```

## 🎯 Utility Classes

```css
/* Button Styles */
.btn-submit {
  @apply bg-black text-white hover:bg-neutral-800 border border-black;
}

.btn-cancel {
  @apply bg-white text-black border border-black hover:bg-neutral-100;
}

/* Surface */
.surface {
  @apply bg-white text-foreground border border-border rounded-lg;
}

/* Hero & Gradient */
.bg-section {
  background: var(--section);
  background-repeat: no-repeat;
  background-size: cover;
}

.text-gradient {
  background: var(--section);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  padding-bottom: 1rem;
}
```

## 📝 Migration Examples

### Example 1: Profile Page Header

```tsx
// Before:
<div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50'>
  <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'>
    Profile
  </h1>
  <Button className='bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'>
    Save
  </Button>
</div>

// After:
<div className='min-h-screen bg-background'>
  <h1 className='text-4xl font-bold text-gradient'>
    Profile
  </h1>
  <Button className='btn-submit'>
    Save
  </Button>
</div>
```

### Example 2: Form with Submit/Cancel

```tsx
// Before:
<div className='flex gap-3'>
  <Button variant='outline' onClick={onCancel}>
    Cancel
  </Button>
  <Button className='bg-blue-600 hover:bg-blue-700 text-white' type='submit'>
    Submit
  </Button>
</div>

// After:
<div className='flex gap-3'>
  <Button className='btn-cancel' onClick={onCancel}>
    Cancel
  </Button>
  <Button className='btn-submit' type='submit'>
    Submit
  </Button>
</div>
```

### Example 3: Dialog/Modal

```tsx
// Before:
<DialogContent className='max-w-3xl bg-white'>
  <DialogHeader className='bg-gradient-to-r from-blue-500 to-cyan-500 text-white'>
    <DialogTitle>Title</DialogTitle>
  </DialogHeader>
</DialogContent>

// After:
<DialogContent className='max-w-3xl surface'> {/* hoặc giữ nguyên, Card đã white */}
  <DialogHeader className='bg-section text-white'>
    <DialogTitle>Title</DialogTitle>
  </DialogHeader>
</DialogContent>
```

## ⚠️ Exceptions (Không thay đổi)

### Keep Custom Colors:

- **Status Badges**: pending (yellow), accepted (green), rejected (red)
- **Chart Colors**: từ `--chart-1` đến `--chart-5`
- **Skill Badges**: colorful badges (blue, purple, orange, pink, green, etc.)
- **Alert/Notification**: destructive, warning variants

### Keep Custom UI:

- Chat messages (có design riêng)
- Video call interface
- Payment QR codes
- Specific branded sections

## 🚀 Implementation Priority

1. **High Priority** (User-facing):
   - profile.tsx
   - manage-applications.tsx
   - manage-post-project.tsx
   - jobs-freelancer.tsx
   - post-project.tsx

2. **Medium Priority**:
   - dashboard-freelancer.tsx
   - search-freelancer.tsx
   - manage-project.tsx
   - post-new-project.tsx

3. **Low Priority** (Special UI):
   - chat.tsx
   - payment.tsx
   - banking-qr.tsx

## ✅ Quality Checklist

- [ ] Background sử dụng `bg-background`
- [ ] Headers sử dụng `text-gradient` nếu là tiêu đề chính
- [ ] Submit buttons sử dụng `btn-submit`
- [ ] Cancel buttons sử dụng `btn-cancel`
- [ ] Cards/Dialogs có `surface` hoặc sử dụng component mặc định
- [ ] Không có hardcoded gradient colors (trừ exceptions)
- [ ] Responsive design vẫn hoạt động tốt
- [ ] Dark mode compatibility (nếu có)

## 📊 Before/After Comparison

| Element       | Before                                 | After           | Benefit                |
| ------------- | -------------------------------------- | --------------- | ---------------------- |
| Background    | `bg-gradient-to-br from-slate-50...`   | `bg-background` | Consistent, shorter    |
| Submit Button | `bg-gradient-to-r from-blue-600...`    | `btn-submit`    | Reusable, maintainable |
| Cancel Button | `variant='outline'`                    | `btn-cancel`    | Standardized           |
| Page Title    | `bg-gradient-to-r ... bg-clip-text...` | `text-gradient` | Clean, semantic        |
| Hero Section  | `bg-gradient-to-r from-blue-600...`    | `bg-section`    | Theme-aware            |

## 🎨 Design Tokens Summary

```typescript
// Sử dụng trong code
className = 'bg-background' // Page background với gradient
className = 'text-foreground' // Text color chính
className = 'bg-section' // Hero sections
className = 'text-gradient' // Gradient text
className = 'btn-submit' // Primary action
className = 'btn-cancel' // Secondary action
className = 'surface' // White surfaces
```

## 🔍 Search & Replace Patterns (Use with caution)

```bash
# Background
Find: className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50'
Replace: className='min-h-screen bg-background'

# Submit Buttons
Find: className='bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700
Replace: className='btn-submit

# Gradient Text
Find: className='(.*?)bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent
Replace: className='$1text-gradient
```

---

**Note**: Always test after changes và check responsive design!
