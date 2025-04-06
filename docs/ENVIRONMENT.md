# Environment Configuration

## Overview

This document outlines the environment variables and configuration needed to run the Vibe AI Platform.

## Environment Variables

Create a `.env.local` file for development or configure these variables in your deployment platform.

### Required Variables

#### Firebase Configuration

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
```

#### Firebase Admin Configuration

```
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_PRIVATE_KEY="your-firebase-private-key"
```

Note: The FIREBASE_PRIVATE_KEY should include quotation marks and be properly escaped if it contains newlines.

### Optional Variables (Required for specific features)

#### OpenAI API

```
OPENAI_API_KEY=your-openai-api-key
```

#### Anthropic API

```
ANTHROPIC_API_KEY=your-anthropic-api-key
```

#### Replicate API

```
REPLICATE_API_TOKEN=your-replicate-api-token
```

#### Deepgram API

```
DEEPGRAM_API_KEY=your-deepgram-api-key
```

#### Daily.co API

```
DAILY_API_KEY=your-daily-api-key
```

### Development Configuration

```
# Enable/force mock data in development
USE_MOCK_DATA=true

# Configure development-specific behavior
DEV_SIMULATE_LATENCY=true
DEV_LATENCY_MS=1000

# For local development server
PORT=3000
```

## Environment Files

The project uses different environment files for different environments:

- `.env.local`: Local development overrides (not committed to Git)
- `.env.development`: Development environment defaults
- `.env.production`: Production environment settings
- `.env.test`: Test environment configuration

## Development vs Production

### Development Mode

In development mode (`NODE_ENV=development`), the application:

1. Uses mock data when API keys are not configured
2. Shows more detailed error messages
3. Has additional debugging features enabled
4. Can simulate network latency for testing loading states

### Production Mode

In production mode (`NODE_ENV=production`), the application:

1. Requires all necessary API keys to be configured
2. Optimizes for performance
3. Displays user-friendly error messages without technical details
4. Implements stricter security measures

## Firebase Configuration

### Creating a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication, Firestore Database, and Storage
4. Configure Authentication methods (email/password, Google, etc.)
5. Set up Firestore security rules
6. Create a web app in the project to get your configuration values

### Getting Admin SDK Credentials

1. In Firebase Console, go to Project Settings
2. Navigate to "Service accounts" tab
3. Click "Generate new private key"
4. Use the values from the downloaded JSON file for your environment variables

## API Keys for External Services

### OpenAI API

1. Create an account at [OpenAI](https://platform.openai.com/)
2. Navigate to API keys section
3. Create a new API key

### Anthropic API

1. Request access to [Anthropic Claude API](https://www.anthropic.com/product)
2. Follow their instructions to get an API key

### Replicate API

1. Create an account at [Replicate](https://replicate.com/)
2. Navigate to your account settings
3. Create a new API token

### Deepgram API

1. Create an account at [Deepgram](https://deepgram.com/)
2. Navigate to API keys in your dashboard
3. Create a new API key

### Daily.co API

1. Create an account at [Daily.co](https://www.daily.co/)
2. Navigate to your developer settings
3. Create a new API key

## Local Development Setup

For local development:

1. Copy `.env.example` to `.env.local`
2. Fill in the values you have, or leave empty to use mock data
3. Set `NODE_ENV=development` (this is usually automatic with `npm run dev`)
4. Run the development server with `npm run dev`

## Vercel Deployment Configuration

When deploying to Vercel:

1. Add all environment variables in the Vercel project settings
2. Ensure `NODE_ENV` is set to `production` for production deployments
3. For multi-line variables like `FIREBASE_PRIVATE_KEY`, use the "insert" functionality in Vercel UI
