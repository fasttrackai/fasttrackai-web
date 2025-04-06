#!/bin/bash
# Vibe AI Platform Deployment Script
# This script automates the deployment process for the Vibe AI Platform

# Exit on error
set -e

# Color codes for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}   Vibe AI Platform Deployment Script    ${NC}"
echo -e "${BLUE}=========================================${NC}"

# Check for production environment file
if [ ! -f .env.production ]; then
    echo -e "${RED}Error: .env.production file not found${NC}"
    echo "Please create a .env.production file with your production environment variables."
    echo "See the DEPLOYMENT.md guide for more information."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js and try again.${NC}"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="16.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo -e "${YELLOW}Warning: Node.js version $NODE_VERSION detected.${NC}"
    echo -e "Vibe AI Platform requires Node.js v16 or higher."
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Display current Node and NPM versions
echo -e "${GREEN}Using Node.js $(node -v) and NPM $(npm -v)${NC}"
echo

# Clean up previous builds
echo -e "${BLUE}Cleaning up previous builds...${NC}"
if [ -d ".next" ]; then
    rm -rf .next
fi
if [ -d "out" ]; then
    rm -rf out
fi
echo -e "${GREEN}Cleanup complete${NC}"
echo

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm install
echo -e "${GREEN}Dependencies installed successfully${NC}"
echo

# Run linter
echo -e "${BLUE}Running linter...${NC}"
npm run lint
echo -e "${GREEN}Linting passed${NC}"
echo

# Build for production
echo -e "${BLUE}Building for production...${NC}"
npm run build
echo -e "${GREEN}Build completed successfully${NC}"
echo

# Deploy to Vercel if available
if command -v vercel &> /dev/null; then
    echo -e "${BLUE}Deploying to Vercel...${NC}"
    echo -e "${YELLOW}You may be prompted to log in if not already authenticated.${NC}"
    
    # Check if already logged in to Vercel
    VERCEL_LOGGED_IN=$(vercel whoami 2>/dev/null || echo "not logged in")
    if [[ "$VERCEL_LOGGED_IN" == "not logged in" ]]; then
        echo -e "${YELLOW}Please log in to Vercel:${NC}"
        vercel login
    fi
    
    # Ask for confirmation before production deployment
    echo -e "${YELLOW}Ready to deploy to production?${NC}"
    read -p "Type 'yes' to continue: " confirm
    if [[ "$confirm" == "yes" ]]; then
        echo -e "${BLUE}Deploying to production...${NC}"
        vercel --prod
        echo -e "${GREEN}Deployment successful!${NC}"
    else
        echo -e "${YELLOW}Deployment cancelled.${NC}"
        exit 0
    fi
else
    echo -e "${YELLOW}Vercel CLI not found. Manual deployment required.${NC}"
    echo -e "To deploy to Vercel manually:"
    echo -e "1. Install Vercel CLI: npm install -g vercel"
    echo -e "2. Run: vercel login"
    echo -e "3. Run: vercel --prod"
    echo
    echo -e "Alternatively, you can deploy using the Vercel Dashboard:"
    echo -e "1. Push your code to GitHub"
    echo -e "2. Connect your repository in the Vercel Dashboard"
    echo -e "3. Add your environment variables from .env.production"
    echo -e "4. Deploy your project"
fi

echo -e "${BLUE}=========================================${NC}"
echo -e "${GREEN}Deployment preparation complete!${NC}"
echo -e "${BLUE}=========================================${NC}"

# Final instructions
echo -e "${BLUE}Next steps:${NC}"
echo -e "1. Verify your site is working correctly at your Vercel URL"
echo -e "2. Set up your custom domain if needed"
echo -e "3. Configure analytics and monitoring"
echo -e "4. Review the DEPLOYMENT.md guide for ongoing maintenance"
echo
echo -e "${GREEN}Thank you for using Vibe AI Platform!${NC}"
exit 0 