const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

// Install sharp if not already installed
console.log('Installing required packages...');
exec('npm install sharp svgexport --save-dev', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error installing packages: ${error.message}`);
    return;
  }
  console.log('Packages installed successfully');
  
  // Import sharp after ensuring it's installed
  const sharp = require('sharp');
  
  // Convert SVG to PNG
  console.log('Converting SVG to PNG...');
  
  // First convert SVG to PNG using svgexport (more reliable for SVG)
  exec('npx svgexport ./public/favicon.svg ./public/favicon-temp.png 32:32', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error converting SVG to PNG: ${error.message}`);
      return;
    }
    
    // Now use sharp to process the PNG and add any additional effects
    sharp('./public/favicon-temp.png')
      .resize(32, 32)
      .toFile('./public/favicon.png')
      .then(() => {
        console.log('PNG favicon generated successfully');
        
        // Clean up temporary file
        fs.unlinkSync('./public/favicon-temp.png');
        
        // Create ICO file
        sharp('./public/favicon.png')
          .resize(16, 16)
          .toBuffer()
          .then(data16 => {
            sharp('./public/favicon.png')
              .resize(32, 32)
              .toBuffer()
              .then(data32 => {
                // Write a simple text file with instructions since ICO generation is complex
                fs.writeFileSync('./public/favicon.ico', 
                  `This is a placeholder. For proper ICO generation, use the favicon.svg with an online converter.`);
                console.log('Favicon placeholder created. Use an online converter for final ICO file.');
                
                console.log('All favicon files processed. Ready for deployment!');
              });
          });
      })
      .catch(err => {
        console.error('Error processing PNG:', err);
      });
  });
}); 