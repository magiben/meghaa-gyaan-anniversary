// Verification script to check if everything is set up correctly
const fs = require('fs')
const path = require('path')

console.log('🔍 Verifying Anniversary Website Setup...\n')

let allGood = true

// Check 1: public/data folder exists
const dataDir = path.join(__dirname, 'public', 'data')
if (fs.existsSync(dataDir)) {
  console.log('✓ public/data folder exists')
} else {
  console.log('✗ public/data folder missing - Run: npm run setup')
  allGood = false
}

// Check 2: API route exists
const apiRoute = path.join(__dirname, 'app', 'api', 'save', 'route.ts')
if (fs.existsSync(apiRoute)) {
  console.log('✓ API route exists')
} else {
  console.log('✗ API route missing')
  allGood = false
}

// Check 3: Store file exists
const storeFile = path.join(__dirname, 'lib', 'store.ts')
if (fs.existsSync(storeFile)) {
  console.log('✓ Store file exists')
} else {
  console.log('✗ Store file missing')
  allGood = false
}

// Check 4: Edit panel exists
const editPanel = path.join(__dirname, 'components', 'anniversary', 'edit-panel.tsx')
if (fs.existsSync(editPanel)) {
  console.log('✓ Edit panel exists')
} else {
  console.log('✗ Edit panel missing')
  allGood = false
}

console.log('\n' + '='.repeat(50))

if (allGood) {
  console.log('✓ All checks passed! You\'re ready to go.')
  console.log('\nNext steps:')
  console.log('  1. Run: npm run dev')
  console.log('  2. Open: http://localhost:3000')
  console.log('  3. Click "Edit Our Story ✨"')
  console.log('  4. Upload content and click "Save Changes"')
} else {
  console.log('✗ Some checks failed. Please fix the issues above.')
  console.log('\nTry running: npm run setup')
}

console.log('='.repeat(50) + '\n')
