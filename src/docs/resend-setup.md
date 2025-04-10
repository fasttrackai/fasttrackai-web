# Resend Email Integration Guide

FastTrack AI uses [Resend](https://resend.com) for all transactional emails, including consultation confirmations and notifications.

## Why Resend?

- Modern API built for developers
- Excellent deliverability rates
- React email templates support
- Simple integration with Next.js
- Real-time delivery tracking
- Reasonable pricing with generous free tier (3,000 emails/month)

## Setup Instructions

### 1. Create a Resend Account

1. Go to [https://resend.com](https://resend.com) and sign up for an account
2. Verify your email address to activate your account

### 2. Verify Your Domain

For best deliverability, you should verify your domain:

1. In the Resend dashboard, go to "Domains"
2. Click "Add Domain"
3. Enter your domain (e.g., fasttrackai.io)
4. Follow the DNS configuration instructions to add TXT records
5. Wait for verification to complete (this may take up to 24 hours)

### 3. Create an API Key

1. In the Resend dashboard, go to "API Keys"
2. Click "Create API Key"
3. Name your key (e.g., "FastTrack AI Website")
4. Copy the generated API key

### 4. Configure Your Environment

Add the following to your `.env.local` file:

```
RESEND_API_KEY=re_123456789...
EMAIL_FROM=team@yourdomain.com
EMAIL_SENDER_NAME=Your Brand Name
```

Make sure the EMAIL_FROM uses an email address from your verified domain.

### 5. Testing the Integration

You can test the email integration by:

1. Filling out the consultation form on the website
2. Using the Resend dashboard to view sent emails
3. Checking the API logs in the Resend dashboard

## Usage in Code

The consultation API endpoint is already configured to use Resend:

```typescript
import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Send an email
await resend.emails.send({
  from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_FROM}>`,
  to: 'recipient@example.com',
  subject: 'Your Subject Line',
  html: '<h1>HTML Email Content</h1>',
  text: 'Plain text version',
  attachments: [
    {
      filename: 'attachment.pdf',
      content: Buffer.from('...').toString('base64')
    }
  ]
});
```

## Troubleshooting

- **Emails not sending**: Check that your API key is correct and that you're using a verified domain
- **Emails going to spam**: Make sure your domain is properly verified with DKIM/SPF records
- **Error messages**: Look at the Resend dashboard logs for detailed error information

## Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [React Email](https://react.email) - For creating beautiful email templates
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) - For sending emails from your Next.js application 