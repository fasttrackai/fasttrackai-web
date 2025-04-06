# API Documentation

## Overview

This document describes the API endpoints available in the Vibe AI Platform.

## Authentication

Most API endpoints require authentication using Firebase Authentication. Include the authentication token in the request headers:

```
Authorization: Bearer YOUR_FIREBASE_ID_TOKEN
```

## Endpoints

### OpenAI Chat

```
POST /api/openai/chat
```

Processes chat messages using OpenAI's API.

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "Tell me about AI consulting" }
  ]
}
```

**Response:**
Streamed response with AI-generated content.

### Anthropic Chat

```
POST /api/anthropic/chat
```

Processes chat messages using Anthropic's Claude API.

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "Tell me about AI consulting" }
  ]
}
```

**Response:**
Streamed response with AI-generated content.

### Replicate Image Generation

```
POST /api/replicate/generate-image
```

Generates images using the Stable Diffusion model on Replicate.

**Request Body:**
```json
{
  "prompt": "A futuristic AI office with holographic displays"
}
```

**Response:**
```json
{
  "imageUrl": "https://replicate.delivery/..."
}
```

### Daily.co Room Creation

```
POST /api/daily/create-room
```

Creates a video consultation room using Daily.co API.

**Request Body:**
```json
{
  "userName": "John Doe"
}
```

**Response:**
```json
{
  "roomUrl": "https://your-domain.daily.co/room-name",
  "token": "jwt-token-for-room"
}
```

### Client Assessment

```
POST /api/client/assessment
```

Saves client assessment responses.

**Request Body:**
```json
{
  "answers": [...],
  "score": 75,
  "recommendations": [...]
}
```

**Response:**
```json
{
  "id": "assessment-id",
  "success": true
}
```

```
GET /api/client/assessment
```

Retrieves client assessment history.

**Response:**
```json
{
  "assessments": [...]
}
```

### ROI Calculator

```
POST /api/client/roi
```

Saves ROI calculation data.

**Request Body:**
```json
{
  "inputs": {...},
  "results": {...}
}
```

**Response:**
```json
{
  "id": "roi-calculation-id",
  "success": true
}
```

```
GET /api/client/roi
```

Retrieves ROI calculation history.

**Response:**
```json
{
  "calculations": [...]
}
```

### Client Dashboard

```
GET /api/client/dashboard
```

Retrieves client dashboard data including maturity scores, growth metrics, and implementation progress.

**Response:**
```json
{
  "maturityScores": [...],
  "growthMetrics": [...],
  "implementationProgress": {...}
}
```

## Error Handling

All API endpoints return standard HTTP status codes:

- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error responses include a message describing the error:

```json
{
  "error": "Error message description"
}
```

## Development Mode

In development mode, API endpoints return mock data when actual service credentials are not configured. This is determined by:

1. The `NODE_ENV` environment variable being set to "development"
2. Required API keys not being configured
3. Firebase initialization failing

To force development mode with mock data, set the following in your `.env.local`:

```
USE_MOCK_DATA=true
```
