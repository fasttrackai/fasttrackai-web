# Architecture Documentation

## Overview

Vibe AI Platform is built with a modern web architecture using Next.js 14 App Router, React, and Firebase. This document outlines the high-level architecture and design decisions.

## System Architecture

### Frontend

- **Framework**: Next.js 14 with App Router and React 18
- **Styling**: Tailwind CSS
- **State Management**: React Context and hooks
- **Animation**: Framer Motion
- **Form Handling**: React Hook Form with Zod validation

### Backend

- **API Routes**: Next.js API routes (App Router)
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Admin SDK**: Firebase Admin SDK for secure server-side operations

### External Services

- **AI Processing**: OpenAI API, Anthropic API
- **Image Generation**: Replicate API (Stable Diffusion)
- **Video Conferencing**: Daily.co API
- **Audio Transcription**: Deepgram API

## Directory Structure

```
src/
├── app/                  # App Router pages and layouts
│   ├── api/              # API routes
│   │   ├── anthropic/    # Anthropic API routes
│   │   ├── client/       # Client data API routes
│   │   ├── daily/        # Daily.co API routes
│   │   ├── deepgram/     # Deepgram API routes
│   │   ├── openai/       # OpenAI API routes
│   │   └── replicate/    # Replicate API routes
│   ├── assessment/       # Assessment tool page
│   ├── auth/             # Authentication pages
│   ├── blog/             # Blog pages
│   ├── client-dashboard/ # Client dashboard pages
│   ├── components/       # Shared React components
│   ├── instant-consultation/ # Video consultation page
│   ├── roi-calculator/   # ROI calculator page
│   ├── solutions/        # Solution pages
│   ├── strategy-report/  # Strategy report page
│   ├── training-portal/  # Training portal pages
│   ├── global.css        # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── lib/                  # Shared utilities and configurations
│   ├── config/           # Application configurations
│   ├── contexts/         # React context providers
│   ├── firebase/         # Firebase configurations and utilities
│   ├── hooks/            # Custom React hooks
│   └── utils/            # Utility functions
├── middleware.ts         # Next.js middleware for authentication
└── types/                # TypeScript type definitions
```

## Key Components

### Authentication Flow

1. User signs up/signs in via Firebase Authentication
2. Auth state managed through AuthContext provider
3. Protected routes handled by Next.js middleware
4. Server-side operations validate Firebase ID tokens

### API Communication

- Client-side: Firebase SDK for direct database operations
- Server-side: Firebase Admin SDK for secure operations
- External APIs: Fetch API with proper error handling

### Data Flow

1. User interaction triggers data request
2. Request processed through Next.js API route or direct Firebase SDK call
3. Data retrieved/processed and returned to client
4. State updated using React hooks/context

### Rendering Strategy

- Static pages: Generated at build time for performance
- Dynamic pages: Server-side rendering for SEO and initial load performance
- Client-side rendering: For authenticated and personalized content

## Development vs Production

### Development Mode

- Mock data provided when API keys not configured
- Fallback implementations for external services
- Development-specific logging and debugging

### Production Mode

- Full integration with all external services
- Optimized bundle with minimized JavaScript
- Error handling with proper user feedback
- Logging configured for production monitoring

## Deployment Architecture

### Vercel Deployment

- Next.js optimized for Vercel hosting
- Environment variables configured in Vercel dashboard
- Automatic preview deployments for pull requests
- Edge functions for API routes (where applicable)

### Firebase Configuration

- Firebase project with appropriate service enabling
- Firestore database with proper security rules
- Storage bucket with access controls
- Authentication methods configured

## Security Considerations

- API keys stored as environment variables, never exposed client-side
- Firebase security rules restrict data access
- Content Security Policy configured
- Authentication state properly managed
- Server-side validation of all user inputs

## Performance Optimizations

- Next.js image optimization
- Code splitting and lazy loading
- Static generation where possible
- Optimized JavaScript bundles
- Efficient data fetching with SWR

## Future Architecture Considerations

- Internationalization support
- Enhanced analytics integration
- A/B testing infrastructure
- Expanded microservices architecture
- Edge computing for global performance
