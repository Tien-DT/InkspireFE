#!/bin/bash

# UI Theme Update Script for Inkspire
# This script updates all route files to use standardized design system

echo "🎨 Starting UI theme update..."

# Files to update (excluding auth pages)
FILES=(
  "app/routes/profile.tsx"
  "app/routes/manage-applications.tsx"
  "app/routes/manage-post-project.tsx"
  "app/routes/jobs-freelancer.tsx"
  "app/routes/post-project.tsx"
  "app/routes/post-recruitment.tsx"
  "app/routes/dashboard-freelancer.tsx"
  "app/routes/search-freelancer.tsx"
  "app/routes/manage-project.tsx"
  "app/routes/payment.tsx"
  "app/routes/chat.tsx"
  "app/routes/about.tsx"
)

# Backup original files
echo "📦 Creating backups..."
mkdir -p .backups/ui-update-$(date +%Y%m%d-%H%M%S)
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    cp "$file" ".backups/ui-update-$(date +%Y%m%d-%H%M%S)/"
  fi
done

echo "✅ Backups created"

# Update patterns (use sed carefully)
echo "🔄 Applying updates..."

# Note: Manual updates recommended for complex patterns
# This script provides a reference - review changes before committing

echo "
📋 Manual Update Checklist:
1. Replace page backgrounds: bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 → bg-background
2. Replace submit buttons: bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 → btn-submit
3. Replace gradient text: bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent → text-gradient
4. Replace cancel buttons: variant='outline' → className='btn-cancel'

⚠️  Keep custom gradients for:
   - Avatar fallbacks (decorative)
   - Status badges (semantic colors)
   - Chart elements
   - Special UI sections
"

echo "✨ Theme update script completed!"
echo "Please review THEME_UPDATE_GUIDE.md for detailed instructions"
