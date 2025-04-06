# Contributing Guide

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
   ```
   npm install
   ```
4. Create a `.env.local` file with necessary environment variables (see `.env.example`)
5. Start the development server:
   ```
   npm run dev
   ```

## Development Workflow

### Branching Strategy

- `main`: Production-ready code
- `develop`: Latest development changes
- Feature branches: `feature/feature-name`
- Bug fix branches: `fix/bug-name`

Always create new branches from `develop`.

### Pull Request Process

1. Ensure your code follows the project's coding standards
2. Update documentation as needed
3. Make sure all tests pass
4. Submit a pull request to the `develop` branch
5. Wait for code review and address any requested changes

### Commit Message Guidelines

Follow conventional commits for clear and structured commit messages:

- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation only changes
- `style:` - Changes that do not affect code meaning (formatting, etc.)
- `refactor:` - Code change that neither fixes a bug nor adds a feature
- `perf:` - Code change that improves performance
- `test:` - Adding missing tests or correcting existing tests
- `chore:` - Changes to the build process or auxiliary tools

Example: `feat: add video consultation component`

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid using `any` type when possible

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
1. Ensure `NODE_ENV` is set to `development`
2. Either leave API keys unset or set `USE_MOCK_DATA=true` in your `.env.local`

## Need Help?

If you need help with the contribution process or have questions, feel free to:

- Open an issue with the "help wanted" label
- Contact the project maintainers

Thank you for contributing to the Vibe AI Platform!
