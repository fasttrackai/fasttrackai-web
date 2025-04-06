/**
 * Script to help developers update console.log statements to use the logger utility
 * Run with: node scripts/update-console-logs.js
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Configuration
const SOURCE_DIR = path.resolve(__dirname, '../src');
const FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];
const IGNORE_DIRS = ['node_modules', '.next', 'out', 'public'];
const DRY_RUN = true; // Set to false to actually update files

// Patterns to replace
const PATTERNS = [
  { 
    regex: /console\.log\((.*?)\);/g, 
    replacement: 'logger.log($1);' 
  },
  { 
    regex: /console\.error\((.*?)\);/g, 
    replacement: 'logger.error($1);' 
  },
  { 
    regex: /console\.warn\((.*?)\);/g, 
    replacement: 'logger.warn($1);' 
  },
  { 
    regex: /console\.debug\((.*?)\);/g, 
    replacement: 'logger.debug($1);' 
  }
];

// Import statement to add
const LOGGER_IMPORT = "import logger from '@/lib/utils/logger';";

// Stats
const stats = {
  filesScanned: 0,
  filesUpdated: 0,
  totalReplacements: 0,
  logReplacements: 0,
  errorReplacements: 0,
  warnReplacements: 0,
  debugReplacements: 0
};

// Helper functions
async function processDirectory(dirPath) {
  try {
    const entries = await readdir(dirPath);
    
    for (const entry of entries) {
      if (IGNORE_DIRS.includes(entry)) continue;
      
      const fullPath = path.join(dirPath, entry);
      const entryStat = await stat(fullPath);
      
      if (entryStat.isDirectory()) {
        await processDirectory(fullPath);
      } else if (entryStat.isFile() && FILE_EXTENSIONS.includes(path.extname(fullPath))) {
        await processFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dirPath}:`, error);
  }
}

async function processFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    let newContent = content;
    let fileUpdated = false;
    let replacements = 0;
    
    // Check for console statements
    for (const pattern of PATTERNS) {
      const matches = content.match(pattern.regex);
      if (matches) {
        const count = matches.length;
        replacements += count;
        
        // Update stats based on pattern
        if (pattern.regex.toString().includes('log')) {
          stats.logReplacements += count;
        } else if (pattern.regex.toString().includes('error')) {
          stats.errorReplacements += count;
        } else if (pattern.regex.toString().includes('warn')) {
          stats.warnReplacements += count;
        } else if (pattern.regex.toString().includes('debug')) {
          stats.debugReplacements += count;
        }
        
        // Replace console statements
        newContent = newContent.replace(pattern.regex, pattern.replacement);
        fileUpdated = true;
      }
    }
    
    // Add logger import if needed
    if (fileUpdated && !newContent.includes('@/lib/utils/logger')) {
      // Find a good place to add the import
      // Look for import statements
      const importSection = newContent.match(/import.*?from.*?;(\r?\n|$)+/gs);
      
      if (importSection) {
        // Add after last import
        const lastImport = importSection[importSection.length - 1];
        const importIndex = newContent.lastIndexOf(lastImport) + lastImport.length;
        newContent = newContent.slice(0, importIndex) + 
                    LOGGER_IMPORT + '\n' + 
                    newContent.slice(importIndex);
      } else {
        // Add at beginning of file
        newContent = LOGGER_IMPORT + '\n\n' + newContent;
      }
    }
    
    // Update the file
    if (fileUpdated) {
      stats.filesUpdated++;
      stats.totalReplacements += replacements;
      
      console.log(`[${DRY_RUN ? 'DRY RUN' : 'UPDATING'}] ${filePath}: ${replacements} replacements`);
      
      if (!DRY_RUN) {
        await writeFile(filePath, newContent, 'utf8');
      }
    }
    
    stats.filesScanned++;
    
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

// Main function
async function main() {
  console.log(`Starting console.log replacement (${DRY_RUN ? 'DRY RUN' : 'REAL RUN'})`);
  console.log(`Source directory: ${SOURCE_DIR}`);
  
  const startTime = Date.now();
  await processDirectory(SOURCE_DIR);
  const endTime = Date.now();
  
  console.log('\nSummary:');
  console.log(`Files scanned: ${stats.filesScanned}`);
  console.log(`Files requiring updates: ${stats.filesUpdated}`);
  console.log(`Total replacements: ${stats.totalReplacements}`);
  console.log(`  - console.log: ${stats.logReplacements}`);
  console.log(`  - console.error: ${stats.errorReplacements}`);
  console.log(`  - console.warn: ${stats.warnReplacements}`);
  console.log(`  - console.debug: ${stats.debugReplacements}`);
  console.log(`Time taken: ${(endTime - startTime) / 1000}s`);
  
  if (DRY_RUN) {
    console.log('\nThis was a dry run. No files were modified.');
    console.log('To actually update files, change DRY_RUN to false in the script.');
  } else {
    console.log('\nFiles have been updated. Please review the changes before committing.');
  }
}

// Run the script
main().catch(error => {
  console.error('Error running script:', error);
  process.exit(1);
}); 