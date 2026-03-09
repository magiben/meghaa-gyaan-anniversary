// Simple setup script to create the data folder
const fs = require('fs')
const path = require('path')

const dataDir = path.join(__dirname, 'public', 'data')

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
  console.log('✓ Created public/data folder')
} else {
  console.log('✓ public/data folder already exists')
}

console.log('\nYou can now run your development server:')
console.log('  npm run dev')
