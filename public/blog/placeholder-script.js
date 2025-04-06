// This is a script that creates placeholder images using the 'canvas' and 'fs' modules
// To use it, first install the required dependencies:
// npm install canvas fs

const { createCanvas } = require('canvas');
const fs = require('fs');

// Function to create a placeholder image
function createPlaceholderImage(width, height, color, text, outputPath) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Fill background
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);

  // Add text
  const fontSize = Math.floor(width / 20);
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);

  // Save to file
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(outputPath, buffer);
  
  console.log(`Created placeholder image at ${outputPath}`);
}

// Blog images (1200x800)
createPlaceholderImage(1200, 800, '#7E57C2', 'AI Trends 2024', '../blog/ai-trends-2024.jpg');
createPlaceholderImage(1200, 800, '#5C6BC0', 'SMB AI Guide', '../blog/smb-ai-guide.jpg');
createPlaceholderImage(1200, 800, '#26A69A', 'AI Security', '../blog/ai-security.jpg');
createPlaceholderImage(1200, 800, '#EF5350', 'AI ROI', '../blog/ai-roi.jpg');

// Avatar images (200x200)
createPlaceholderImage(200, 200, '#7E57C2', 'SC', '../avatars/sarah-chen.jpg');
createPlaceholderImage(200, 200, '#5C6BC0', 'MR', '../avatars/michael-rodriguez.jpg');
createPlaceholderImage(200, 200, '#26A69A', 'LT', '../avatars/lisa-thompson.jpg');
createPlaceholderImage(200, 200, '#EF5350', 'JW', '../avatars/james-wilson.jpg');

console.log('All placeholder images created successfully!'); 