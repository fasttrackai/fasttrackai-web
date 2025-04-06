# FastTrack AI - Deployment Guide

This guide will help you quickly deploy your FastTrack AI application to the internet.

## Quick Deployment Steps

### Option 1: Using the Deployment Script (Recommended)

1. **Configure Environment Variables**
   - Edit the `.env.production` file with your actual API keys and configuration values
   - Make sure all required environment variables are set

2. **Run the Deployment Script**
   ```bash
   node deploy.js
   ```
   
   The script will:
   - Check your environment configuration
   - Install dependencies
   - Build the application
   - Guide you through deploying to Vercel

### Option 2: Manual Deployment to Vercel

1. **Configure Environment Variables**
   - Edit the `.env.production` file with your actual API keys and configuration values

2. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

3. **Deploy the Application**
   ```bash
   vercel
   ```
   
   Follow the prompts to:
   - Log in to your Vercel account
   - Configure your project settings
   - Complete the deployment

### Option 3: Deploy through Vercel Dashboard

1. **Push your code to a Git repository** (GitHub, GitLab, or Bitbucket)

2. **Go to the Vercel Dashboard**
   - Visit https://vercel.com/new
   - Import your Git repository
   - Configure your project settings
   - Set up the required environment variables
   - Deploy

## Post-Deployment Steps

1. **Verify Functionality**
   - Test the authentication system
   - Check the API connections
   - Ensure the UI is rendering correctly

2. **Set Up Custom Domain** (Optional)
   - In your Vercel dashboard, navigate to your project
   - Go to "Settings" > "Domains"
   - Add your custom domain and follow the instructions

3. **Set Up Analytics** (Optional)
   - Connect Google Analytics or Vercel Analytics to monitor site usage

## Environment Variables

Make sure the following environment variables are set in your Vercel deployment:

- Firebase Configuration (`NEXT_PUBLIC_FIREBASE_API_KEY`, etc.)
- OpenAI API key (`OPENAI_API_KEY`)
- Anthropic API key (`ANTHROPIC_API_KEY`)
- Replicate API token (`REPLICATE_API_TOKEN`)
- Deepgram API key (`NEXT_PUBLIC_DEEPGRAM_API_KEY`)
- Site URL (`NEXT_PUBLIC_SITE_URL`)

## Troubleshooting

- **Build Errors**: Run `npm run build` locally to identify and fix any issues
- **API Connectivity**: Verify your API keys are correctly set in the environment variables
- **Authentication Issues**: Check your Firebase configuration and make sure the authentication service is enabled in your Firebase console

## Need Help?

If you encounter any issues during deployment, please contact our support team at support@fasttrackai.com. 