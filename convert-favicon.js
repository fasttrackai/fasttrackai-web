const fs = require('fs');
const path = require('path');
const svg2png = require('svg2png');
const svgToIco = require('svg-to-ico');

async function convertSvgToPng() {
  try {
    // Read the SVG file
    const svgBuffer = fs.readFileSync('./public/favicon.svg');
    
    // Convert SVG to PNG
    const pngBuffer = await svg2png(svgBuffer, { width: 32, height: 32 });
    
    // Save PNG
    fs.writeFileSync('./public/favicon.png', pngBuffer);
    
    console.log('SVG to PNG conversion complete');
    
    // Convert SVG to ICO
    await svgToIco('./public/favicon.svg', './public/favicon.ico', {
      sizes: [16, 24, 32, 48, 64],
      resize: true
    });
    
    console.log('SVG to ICO conversion complete');
  } catch (error) {
    console.error('Error converting favicon:', error);
  }
}

convertSvgToPng(); 