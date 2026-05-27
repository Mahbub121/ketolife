const sharp = require('sharp')
const fs = require('fs')
fs.mkdirSync('public/icons', { recursive: true })

const svg = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
    <rect width="512" height="512" fill="#5B7F3F" rx="80"/>
    <text x="256" y="360" font-size="300" font-family="Arial"
      font-weight="bold" fill="white" text-anchor="middle">K</text>
  </svg>`)

async function main() {
  await sharp(svg).resize(192, 192).png().toFile('public/icons/icon-192x192.png')
  await sharp(svg).resize(512, 512).png().toFile('public/icons/icon-512x512.png')
  console.log('Icons generated successfully')
}

main()
