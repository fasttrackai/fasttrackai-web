# Vibe AI Platform

A modern, full-featured AI consulting platform built with Next.js, React, TypeScript, and Tailwind CSS.

## Overview

Vibe AI Platform is a comprehensive solution for businesses looking to implement AI technologies. The platform offers:

- AI Readiness Assessment
- ROI Calculator for AI implementations
- AI-powered chatbot for inquiries
- Instant video consultations
- Client dashboard with analytics
- Strategy reports and recommendations
- Business solutions showcases

## Technologies

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **AI Integration**: OpenAI, Anthropic Claude, Replicate
- **Backend Services**: Firebase (Auth, Firestore, Storage)
- **Real-time Features**: Daily.co (video), Deepgram (audio transcription)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Firebase account
- API keys for integrated services

### Installation

1. Clone the repository
   ```
   git clone https://your-repository-url.git
   cd vibe-ai-platform
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   ```
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your service credentials.

4. Run the development server
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development Features

- **Development Mode**: Mock data support when API keys aren't configured
- **Component Library**: Comprehensive set of reusable UI components
- **Type Safety**: Fully typed with TypeScript
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Features

### AI Readiness Assessment

A questionnaire that evaluates a company's readiness for AI adoption, providing a score and tailored recommendations.

### ROI Calculator

Helps businesses estimate the return on investment for different AI implementation packages based on their specific data.

### Instant Consultation

Allows potential clients to connect immediately with an AI consultant through video, chat, or phone.

### Client Dashboard

Provides clients with analytics on their AI implementation progress, maturity scores, and growth metrics.

### Strategy Reports

Generates customized PDF reports with AI implementation strategies and recommendations.

### Solution Showcases

Detailed descriptions of various AI solutions offered, including business analytics, customer service AI, and process automation.

## Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Instructions for deploying to production
- [Pre-Deployment Checklist](./scripts/pre-deploy-checklist.md) - Items to verify before deployment
- [API Documentation](./docs/API.md) - API endpoints and usage
- [Component Documentation](./docs/COMPONENTS.md) - UI component documentation

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `scripts/deploy.sh` - Deploy to production (Unix/Mac)
- `scripts/deploy.ps1` - Deploy to production (Windows)
- `scripts/update-console-logs.js` - Update console logs to use logger utility

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Proprietary. All rights reserved.

## Contact

Your Company - [contact@yourcompany.com](mailto:contact@yourcompany.com)

Project Link: [https://github.com/your-organization/vibe-ai-platform](https://github.com/your-organization/vibe-ai-platform)