# FastTrackAI Platform

![Vercel](https://vercelbadge.vercel.app/api/fasttrackai/fasttrackai-web)

Modern AI-powered business automation platform.

## Auto-Deployment Test
Last updated: [Current Timestamp] - Testing Vercel auto-deployment

## Features

- **AI Consulting**: Expert guidance on AI implementation strategies
- **Custom Solutions**: Tailored AI solutions for your business needs
- **Training Programs**: Comprehensive training for your team
- **ROI Calculator**: Estimate the potential return on your AI investment
- **Client Dashboard**: Track your AI implementation progress
- **Case Studies**: Learn from successful AI implementations

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Firebase
- **AI Integration**: OpenAI, Anthropic, Replicate, Deepgram
- **Email**: Resend
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- Firebase account
- Resend account for emails
- OpenAI API key (optional)
- Anthropic API key (optional)
- Replicate API key (optional)
- Deepgram API key (optional)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/fasttrackai.git
   cd fasttrackai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

4. Update the environment variables in `.env.local` with your API keys and configuration.

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Resend Email Setup

1. Create a Resend account at [https://resend.com](https://resend.com)
2. Verify your domain in the Resend dashboard
3. Create an API key
4. Add the API key to your `.env.local` file as `RESEND_API_KEY`
5. Update the `EMAIL_FROM` variable with your verified domain email

### Firebase Setup

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication, Firestore, and Storage
3. Create a web app in your Firebase project
4. Copy the Firebase configuration to your `.env.local` file
5. Generate a new private key for Firebase Admin SDK:
   - Go to Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Copy the contents to `FIREBASE_ADMIN_PRIVATE_KEY` in your `.env.local` file

### Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure the environment variables in Vercel
4. Deploy!

## Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── api/              # API routes
│   ├── components/       # React components
│   ├── lib/              # Utilities, hooks, contexts
│   └── ...              # Page routes
├── public/               # Static assets
└── ...
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/)
- [OpenAI](https://openai.com/)
- [Anthropic](https://www.anthropic.com/)
- [Replicate](https://replicate.com/)
- [Deepgram](https://deepgram.com/)
- [Vercel](https://vercel.com/)