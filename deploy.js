#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

// Utility to execute commands with error handling
function runCommand(command, silent = false) {
  try {
    return execSync(command, { stdio: silent ? 'pipe' : 'inherit' });
  } catch (error) {
    console.error(`${colors.red}Error executing command: ${command}${colors.reset}`);
    console.error(error.message);
    return null;
  }
}

// Check if a command exists
function commandExists(command) {
  try {
    execSync(`${process.platform === 'win32' ? 'where' : 'which'} ${command}`, { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Check if Vercel CLI is installed
function checkVercelCLI() {
  return commandExists('vercel');
}

// Check if .env.production exists
function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env.production');
  return fs.existsSync(envPath);
}

// Deploy steps
async function deploy() {
  console.log(`\n${colors.bold}${colors.magenta}🚀 FastTrack AI - Deployment Script${colors.reset}\n`);
  console.log(`${colors.cyan}This script will guide you through deploying your Next.js application to Vercel.${colors.reset}\n`);
  
  // Step 1: Check environment file
  console.log(`${colors.bold}Step 1:${colors.reset} Checking environment configuration...`);
  
  if (!checkEnvFile()) {
    console.error(`${colors.red}❌ .env.production file not found.${colors.reset}`);
    console.log(`Please create a .env.production file with your production environment variables.`);
    console.log(`You can use .env.local as a template and update the values.`);
    rl.close();
    return;
  }
  
  console.log(`${colors.green}✓ Environment file found.${colors.reset}`);
  console.log(`${colors.yellow}ℹ️ Remember to update the actual values in .env.production before deploying.${colors.reset}\n`);
  
  // Step 2: Check dependencies and build
  console.log(`${colors.bold}Step 2:${colors.reset} Installing dependencies and building the application...`);
  
  console.log(`Installing dependencies...`);
  runCommand('npm install');
  
  console.log(`Building the application...`);
  const buildResult = runCommand('npm run build', true);
  
  if (!buildResult) {
    console.error(`${colors.red}❌ Build failed. Please fix any errors and try again.${colors.reset}`);
    console.log(`You can run 'npm run build' to see detailed error messages.`);
    rl.close();
    return;
  }
  
  console.log(`${colors.green}✓ Build completed successfully.${colors.reset}\n`);
  
  // Step 3: Deploy to Vercel
  console.log(`${colors.bold}Step 3:${colors.reset} Deploying to Vercel...`);
  
  if (!checkVercelCLI()) {
    console.log(`${colors.yellow}ℹ️ Vercel CLI not found. You have two options:${colors.reset}`);
    console.log(`
    1. Install Vercel CLI with: npm install -g vercel
       Then run: vercel
       
    2. Deploy directly through the Vercel dashboard:
       a. Go to https://vercel.com/new
       b. Import your Git repository
       c. Configure your project settings
       d. Deploy
    `);
    
    rl.question(`${colors.cyan}Would you like to install Vercel CLI now? (y/n)${colors.reset} `, (answer) => {
      if (answer.toLowerCase() === 'y') {
        console.log(`Installing Vercel CLI...`);
        runCommand('npm install -g vercel');
        console.log(`${colors.green}✓ Vercel CLI installed.${colors.reset}`);
        console.log(`Now you can run 'vercel' to deploy your application.`);
      } else {
        console.log(`Please follow the manual deployment steps described above.`);
      }
      rl.close();
    });
    return;
  }
  
  console.log(`${colors.green}✓ Vercel CLI found.${colors.reset}`);
  console.log(`Running Vercel deployment...`);
  
  rl.question(`${colors.cyan}Do you want to proceed with deployment? (y/n)${colors.reset} `, (answer) => {
    if (answer.toLowerCase() === 'y') {
      runCommand('vercel');
    } else {
      console.log(`Deployment canceled. You can run 'vercel' manually when ready.`);
    }
    rl.close();
  });
}

// Run the deployment
deploy(); 