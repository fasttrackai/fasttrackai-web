/**
 * Script to generate documentation folder structure
 * Run with: node scripts/generate-docs.js
 */

const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '../docs');

// Create docs folder if it doesn't exist
if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR);
  console.log('📁 Created docs directory');
}

// Documentation file templates
const templates = {
  'API.md': `# API Documentation

## Overview

This document describes the API endpoints available in the Vibe AI Platform.

## Authentication

Most API endpoints require authentication using Firebase Authentication. Include the authentication token in the request headers:

\`\`\`
Authorization: Bearer YOUR_FIREBASE_ID_TOKEN
\`\`\`

## Endpoints

### OpenAI Chat

\`\`\`
POST /api/openai/chat
\`\`\`

Processes chat messages using OpenAI's API.

**Request Body:**
\`\`\`json
{
  "messages": [
    { "role": "user", "content": "Tell me about AI consulting" }
  ]
}
\`\`\`

**Response:**
Streamed response with AI-generated content.

### Anthropic Chat

\`\`\`
POST /api/anthropic/chat
\`\`\`

Processes chat messages using Anthropic's Claude API.

**Request Body:**
\`\`\`json
{
  "messages": [
    { "role": "user", "content": "Tell me about AI consulting" }
  ]
}
\`\`\`

**Response:**
Streamed response with AI-generated content.

### Replicate Image Generation

\`\`\`
POST /api/replicate/generate-image
\`\`\`

Generates images using the Stable Diffusion model on Replicate.

**Request Body:**
\`\`\`json
{
  "prompt": "A futuristic AI office with holographic displays"
}
\`\`\`

**Response:**
\`\`\`json
{
  "imageUrl": "https://replicate.delivery/..."
}
\`\`\`

### Daily.co Room Creation

\`\`\`
POST /api/daily/create-room
\`\`\`

Creates a video consultation room using Daily.co API.

**Request Body:**
\`\`\`json
{
  "userName": "John Doe"
}
\`\`\`

**Response:**
\`\`\`json
{
  "roomUrl": "https://your-domain.daily.co/room-name",
  "token": "jwt-token-for-room"
}
\`\`\`

### Client Assessment

\`\`\`
POST /api/client/assessment
\`\`\`

Saves client assessment responses.

**Request Body:**
\`\`\`json
{
  "answers": [...],
  "score": 75,
  "recommendations": [...]
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": "assessment-id",
  "success": true
}
\`\`\`

\`\`\`
GET /api/client/assessment
\`\`\`

Retrieves client assessment history.

**Response:**
\`\`\`json
{
  "assessments": [...]
}
\`\`\`

### ROI Calculator

\`\`\`
POST /api/client/roi
\`\`\`

Saves ROI calculation data.

**Request Body:**
\`\`\`json
{
  "inputs": {...},
  "results": {...}
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": "roi-calculation-id",
  "success": true
}
\`\`\`

\`\`\`
GET /api/client/roi
\`\`\`

Retrieves ROI calculation history.

**Response:**
\`\`\`json
{
  "calculations": [...]
}
\`\`\`

### Client Dashboard

\`\`\`
GET /api/client/dashboard
\`\`\`

Retrieves client dashboard data including maturity scores, growth metrics, and implementation progress.

**Response:**
\`\`\`json
{
  "maturityScores": [...],
  "growthMetrics": [...],
  "implementationProgress": {...}
}
\`\`\`

## Error Handling

All API endpoints return standard HTTP status codes:

- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error responses include a message describing the error:

\`\`\`json
{
  "error": "Error message description"
}
\`\`\`

## Development Mode

In development mode, API endpoints return mock data when actual service credentials are not configured. This is determined by:

1. The \`NODE_ENV\` environment variable being set to "development"
2. Required API keys not being configured
3. Firebase initialization failing

To force development mode with mock data, set the following in your \`.env.local\`:

\`\`\`
USE_MOCK_DATA=true
\`\`\`
`,

  'COMPONENTS.md': `# Component Documentation

## Overview

This document provides documentation for the reusable UI components in the Vibe AI Platform.

## Core Components

### Button

A flexible button component with various styles and sizes.

**Props:**
- \`variant\`: 'default' | 'outline' | 'ghost' | 'link' | 'primary' | 'secondary' | 'danger'
- \`size\`: 'default' | 'sm' | 'lg' | 'icon'
- \`asChild\`: boolean - When true, component will render as its child
- \`className\`: string - Additional CSS classes

**Example:**
\`\`\`tsx
<Button variant="primary" size="lg">
  Get Started
</Button>
\`\`\`

### Card

A container component for displaying content in a card format.

**Subcomponents:**
- \`Card\`: Main container
- \`Card.Header\`: Card header section
- \`Card.Title\`: Card title
- \`Card.Description\`: Card description
- \`Card.Content\`: Card main content
- \`Card.Footer\`: Card footer

**Example:**
\`\`\`tsx
<Card>
  <Card.Header>
    <Card.Title>Analytics Dashboard</Card.Title>
    <Card.Description>View your performance metrics</Card.Description>
  </Card.Header>
  <Card.Content>
    {/* Content goes here */}
  </Card.Content>
  <Card.Footer>
    <Button>View Details</Button>
  </Card.Footer>
</Card>
\`\`\`

### Input

A styled input component for form fields.

**Props:**
- \`type\`: string - HTML input type
- \`placeholder\`: string
- \`className\`: string - Additional CSS classes
- All standard HTML input attributes

**Example:**
\`\`\`tsx
<Input 
  type="email" 
  placeholder="Enter your email" 
  required 
/>
\`\`\`

### Select

A custom select component with dropdown.

**Subcomponents:**
- \`Select\`: Container component
- \`Select.Trigger\`: Clickable trigger
- \`Select.Content\`: Dropdown content
- \`Select.Item\`: Select option

**Example:**
\`\`\`tsx
<Select onValueChange={(value) => console.log(value)}>
  <Select.Trigger>
    <Select.Value placeholder="Select an option" />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="option1">Option 1</Select.Item>
    <Select.Item value="option2">Option 2</Select.Item>
  </Select.Content>
</Select>
\`\`\`

### Tabs

A tabbed interface component.

**Subcomponents:**
- \`Tabs\`: Container component
- \`Tabs.List\`: Tab list container
- \`Tabs.Trigger\`: Individual tab trigger
- \`Tabs.Content\`: Content for each tab

**Example:**
\`\`\`tsx
<Tabs defaultValue="tab1">
  <Tabs.List>
    <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab1">Content for tab 1</Tabs.Content>
  <Tabs.Content value="tab2">Content for tab 2</Tabs.Content>
</Tabs>
\`\`\`

## Feature Components

### ChatBot

An interactive chatbot component that connects to AI APIs.

**Props:**
- \`initialMessage\`: string - First message to display
- \`apiEndpoint\`: string - API endpoint to use
- \`onComplete\`: function - Callback when conversation ends

**Example:**
\`\`\`tsx
<ChatBot 
  initialMessage="How can I help you with AI implementation?" 
  apiEndpoint="/api/openai/chat"
  onComplete={(conversation) => console.log(conversation)}
/>
\`\`\`

### AssessmentForm

A multi-step assessment form with progress tracking.

**Props:**
- \`questions\`: Question[] - Array of assessment questions
- \`onSubmit\`: function - Callback for form submission
- \`initialAnswers\`: Record<string, any> - Initial answers (optional)

**Example:**
\`\`\`tsx
<AssessmentForm
  questions={assessmentQuestions}
  onSubmit={handleSubmit}
/>
\`\`\`

### ROICalculator

A calculator component for determining ROI of AI implementation.

**Props:**
- \`packages\`: Package[] - Available implementation packages
- \`onCalculate\`: function - Callback with calculation results
- \`initialValues\`: Record<string, number> - Initial form values

**Example:**
\`\`\`tsx
<ROICalculator
  packages={aiPackages}
  onCalculate={handleROICalculate}
/>
\`\`\`

### MetricsChart

A component for displaying various metrics and analytics.

**Props:**
- \`data\`: MetricData[] - Data to display
- \`type\`: 'bar' | 'line' | 'radar' | 'pie' - Chart type
- \`title\`: string - Chart title
- \`className\`: string - Additional CSS classes

**Example:**
\`\`\`tsx
<MetricsChart
  data={maturityScoreData}
  type="radar"
  title="AI Maturity Assessment"
/>
\`\`\`

### VideoConsultation

A component for instant video consultations using Daily.co.

**Props:**
- \`userName\`: string - User's name
- \`onSessionEnd\`: function - Callback when session ends

**Example:**
\`\`\`tsx
<VideoConsultation
  userName="John Doe"
  onSessionEnd={handleSessionEnd}
/>
\`\`\`

## Layout Components

### PageContainer

A container component for consistent page layouts.

**Props:**
- \`title\`: string - Page title
- \`description\`: string - Meta description
- \`className\`: string - Additional CSS classes

**Example:**
\`\`\`tsx
<PageContainer
  title="AI Readiness Assessment"
  description="Evaluate your organization's readiness for AI adoption"
>
  {/* Page content */}
</PageContainer>
\`\`\`

### AnimatedSection

A section component with scroll-based animations.

**Props:**
- \`direction\`: 'up' | 'down' | 'left' | 'right' - Animation direction
- \`delay\`: number - Animation delay
- \`className\`: string - Additional CSS classes

**Example:**
\`\`\`tsx
<AnimatedSection direction="up" delay={0.2}>
  <h2>Key Benefits</h2>
  <p>Transform your business with AI</p>
</AnimatedSection>
\`\`\`

### Navbar

The application navigation bar.

**Props:**
- \`transparent\`: boolean - Whether to use transparent background
- \`className\`: string - Additional CSS classes

**Example:**
\`\`\`tsx
<Navbar transparent={isHomePage} />
\`\`\`

### Footer

The application footer.

**Props:**
- \`className\`: string - Additional CSS classes

**Example:**
\`\`\`tsx
<Footer className="bg-gray-50" />
\`\`\`
`,

  'CONTRIBUTING.md': `# Contributing Guide

## Getting Started

Thank you for considering contributing to the Vibe AI Platform! This document provides guidelines and instructions for contributing to the project.

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Git
- Firebase account (for testing)
- API keys for integrated services (or use mock data in development)

### Development Setup

1. Fork the repository
2. Clone your forked repository locally
3. Install dependencies:
   \`\`\`
   npm install
   \`\`\`
4. Create a \`.env.local\` file with necessary environment variables (see \`.env.example\`)
5. Start the development server:
   \`\`\`
   npm run dev
   \`\`\`

## Development Workflow

### Branching Strategy

- \`main\`: Production-ready code
- \`develop\`: Latest development changes
- Feature branches: \`feature/feature-name\`
- Bug fix branches: \`fix/bug-name\`

Always create new branches from \`develop\`.

### Pull Request Process

1. Ensure your code follows the project's coding standards
2. Update documentation as needed
3. Make sure all tests pass
4. Submit a pull request to the \`develop\` branch
5. Wait for code review and address any requested changes

### Commit Message Guidelines

Follow conventional commits for clear and structured commit messages:

- \`feat:\` - A new feature
- \`fix:\` - A bug fix
- \`docs:\` - Documentation only changes
- \`style:\` - Changes that do not affect code meaning (formatting, etc.)
- \`refactor:\` - Code change that neither fixes a bug nor adds a feature
- \`perf:\` - Code change that improves performance
- \`test:\` - Adding missing tests or correcting existing tests
- \`chore:\` - Changes to the build process or auxiliary tools

Example: \`feat: add video consultation component\`

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid using \`any\` type when possible

### React

- Use functional components with hooks
- Keep components small and focused on a single responsibility
- Use proper React patterns (e.g., controlled components)

### CSS/Styling

- Use Tailwind CSS for styling
- Follow the established design system
- Use responsive design principles

### Testing

- Write tests for new features
- Ensure existing tests pass

## Documentation

Update relevant documentation when making changes:

- Component documentation
- API documentation
- README updates

## Using Mock Data

The platform supports development mode with mock data when API keys are not configured. This makes it easier to develop without needing all third-party services set up.

To use mock data:
1. Ensure \`NODE_ENV\` is set to \`development\`
2. Either leave API keys unset or set \`USE_MOCK_DATA=true\` in your \`.env.local\`

## Need Help?

If you need help with the contribution process or have questions, feel free to:

- Open an issue with the "help wanted" label
- Contact the project maintainers

Thank you for contributing to the Vibe AI Platform!
`,

  'ARCHITECTURE.md': `# Architecture Documentation

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

\`\`\`
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
\`\`\`

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
`,

  'ENVIRONMENT.md': `# Environment Configuration

## Overview

This document outlines the environment variables and configuration needed to run the Vibe AI Platform.

## Environment Variables

Create a \`.env.local\` file for development or configure these variables in your deployment platform.

### Required Variables

#### Firebase Configuration

\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
\`\`\`

#### Firebase Admin Configuration

\`\`\`
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_PRIVATE_KEY="your-firebase-private-key"
\`\`\`

Note: The FIREBASE_PRIVATE_KEY should include quotation marks and be properly escaped if it contains newlines.

### Optional Variables (Required for specific features)

#### OpenAI API

\`\`\`
OPENAI_API_KEY=your-openai-api-key
\`\`\`

#### Anthropic API

\`\`\`
ANTHROPIC_API_KEY=your-anthropic-api-key
\`\`\`

#### Replicate API

\`\`\`
REPLICATE_API_TOKEN=your-replicate-api-token
\`\`\`

#### Deepgram API

\`\`\`
DEEPGRAM_API_KEY=your-deepgram-api-key
\`\`\`

#### Daily.co API

\`\`\`
DAILY_API_KEY=your-daily-api-key
\`\`\`

### Development Configuration

\`\`\`
# Enable/force mock data in development
USE_MOCK_DATA=true

# Configure development-specific behavior
DEV_SIMULATE_LATENCY=true
DEV_LATENCY_MS=1000

# For local development server
PORT=3000
\`\`\`

## Environment Files

The project uses different environment files for different environments:

- \`.env.local\`: Local development overrides (not committed to Git)
- \`.env.development\`: Development environment defaults
- \`.env.production\`: Production environment settings
- \`.env.test\`: Test environment configuration

## Development vs Production

### Development Mode

In development mode (\`NODE_ENV=development\`), the application:

1. Uses mock data when API keys are not configured
2. Shows more detailed error messages
3. Has additional debugging features enabled
4. Can simulate network latency for testing loading states

### Production Mode

In production mode (\`NODE_ENV=production\`), the application:

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

1. Copy \`.env.example\` to \`.env.local\`
2. Fill in the values you have, or leave empty to use mock data
3. Set \`NODE_ENV=development\` (this is usually automatic with \`npm run dev\`)
4. Run the development server with \`npm run dev\`

## Vercel Deployment Configuration

When deploying to Vercel:

1. Add all environment variables in the Vercel project settings
2. Ensure \`NODE_ENV\` is set to \`production\` for production deployments
3. For multi-line variables like \`FIREBASE_PRIVATE_KEY\`, use the "insert" functionality in Vercel UI
`
};

// Create each documentation file
Object.entries(templates).forEach(([filename, content]) => {
  const filePath = path.join(DOCS_DIR, filename);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`📄 Created ${filename}`);
});

console.log('✅ Documentation generation completed');
console.log(`📂 Documentation is available in the ${DOCS_DIR} directory`);
console.log('📝 You may want to customize these files for your specific project needs'); 