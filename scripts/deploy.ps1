# Vibe AI Platform Deployment Script for Windows
# This script automates the deployment process for the Vibe AI Platform on Windows systems

# Stop on errors
$ErrorActionPreference = "Stop"

Write-Host "=========================================" -ForegroundColor Blue
Write-Host "   Vibe AI Platform Deployment Script    " -ForegroundColor Blue
Write-Host "=========================================" -ForegroundColor Blue

# Check for production environment file
if (-not (Test-Path ".env.production")) {
    Write-Host "Error: .env.production file not found" -ForegroundColor Red
    Write-Host "Please create a .env.production file with your production environment variables."
    Write-Host "See the DEPLOYMENT.md guide for more information."
    exit 1
}

# Check if Node.js is installed
try {
    $nodeVersion = node -v
} catch {
    Write-Host "Node.js is not installed. Please install Node.js and try again." -ForegroundColor Red
    exit 1
}

# Check Node.js version
$nodeVersionNum = $nodeVersion.Substring(1)
if ([version]$nodeVersionNum -lt [version]"16.0.0") {
    Write-Host "Warning: Node.js version $nodeVersionNum detected." -ForegroundColor Yellow
    Write-Host "Vibe AI Platform requires Node.js v16 or higher." -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit 1
    }
}

# Display current Node and NPM versions
Write-Host "Using Node.js $nodeVersion and NPM $(npm -v)" -ForegroundColor Green
Write-Host ""

# Clean up previous builds
Write-Host "Cleaning up previous builds..." -ForegroundColor Blue
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
}
if (Test-Path "out") {
    Remove-Item -Recurse -Force "out"
}
Write-Host "Cleanup complete" -ForegroundColor Green
Write-Host ""

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Blue
npm install
Write-Host "Dependencies installed successfully" -ForegroundColor Green
Write-Host ""

# Run linter
Write-Host "Running linter..." -ForegroundColor Blue
npm run lint
Write-Host "Linting passed" -ForegroundColor Green
Write-Host ""

# Build for production
Write-Host "Building for production..." -ForegroundColor Blue
npm run build
Write-Host "Build completed successfully" -ForegroundColor Green
Write-Host ""

# Deploy to Vercel if available
try {
    $vercelPath = Get-Command vercel -ErrorAction SilentlyContinue
    if ($vercelPath) {
        Write-Host "Deploying to Vercel..." -ForegroundColor Blue
        Write-Host "You may be prompted to log in if not already authenticated." -ForegroundColor Yellow
        
        # Check if already logged in to Vercel
        try {
            $vercelLoggedIn = vercel whoami 2>$null
        } catch {
            $vercelLoggedIn = $null
        }
        
        if (-not $vercelLoggedIn) {
            Write-Host "Please log in to Vercel:" -ForegroundColor Yellow
            vercel login
        }
        
        # Ask for confirmation before production deployment
        Write-Host "Ready to deploy to production?" -ForegroundColor Yellow
        $confirm = Read-Host "Type 'yes' to continue"
        if ($confirm -eq "yes") {
            Write-Host "Deploying to production..." -ForegroundColor Blue
            vercel --prod
            Write-Host "Deployment successful!" -ForegroundColor Green
        } else {
            Write-Host "Deployment cancelled." -ForegroundColor Yellow
            exit 0
        }
    } else {
        Write-Host "Vercel CLI not found. Manual deployment required." -ForegroundColor Yellow
        Write-Host "To deploy to Vercel manually:"
        Write-Host "1. Install Vercel CLI: npm install -g vercel"
        Write-Host "2. Run: vercel login"
        Write-Host "3. Run: vercel --prod"
        Write-Host ""
        Write-Host "Alternatively, you can deploy using the Vercel Dashboard:"
        Write-Host "1. Push your code to GitHub"
        Write-Host "2. Connect your repository in the Vercel Dashboard"
        Write-Host "3. Add your environment variables from .env.production"
        Write-Host "4. Deploy your project"
    }
} catch {
    Write-Host "Error checking for Vercel CLI: $_" -ForegroundColor Red
    Write-Host "Manual deployment will be required."
}

Write-Host "=========================================" -ForegroundColor Blue
Write-Host "Deployment preparation complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Blue

# Final instructions
Write-Host "Next steps:" -ForegroundColor Blue
Write-Host "1. Verify your site is working correctly at your Vercel URL"
Write-Host "2. Set up your custom domain if needed"
Write-Host "3. Configure analytics and monitoring"
Write-Host "4. Review the DEPLOYMENT.md guide for ongoing maintenance"
Write-Host ""
Write-Host "Thank you for using Vibe AI Platform!" -ForegroundColor Green 