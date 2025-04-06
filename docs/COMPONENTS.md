# Component Documentation

## Overview

This document provides documentation for the reusable UI components in the Vibe AI Platform.

## Core Components

### Button

A flexible button component with various styles and sizes.

**Props:**
- `variant`: 'default' | 'outline' | 'ghost' | 'link' | 'primary' | 'secondary' | 'danger'
- `size`: 'default' | 'sm' | 'lg' | 'icon'
- `asChild`: boolean - When true, component will render as its child
- `className`: string - Additional CSS classes

**Example:**
```tsx
<Button variant="primary" size="lg">
  Get Started
</Button>
```

### Card

A container component for displaying content in a card format.

**Subcomponents:**
- `Card`: Main container
- `Card.Header`: Card header section
- `Card.Title`: Card title
- `Card.Description`: Card description
- `Card.Content`: Card main content
- `Card.Footer`: Card footer

**Example:**
```tsx
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
```

### Input

A styled input component for form fields.

**Props:**
- `type`: string - HTML input type
- `placeholder`: string
- `className`: string - Additional CSS classes
- All standard HTML input attributes

**Example:**
```tsx
<Input 
  type="email" 
  placeholder="Enter your email" 
  required 
/>
```

### Select

A custom select component with dropdown.

**Subcomponents:**
- `Select`: Container component
- `Select.Trigger`: Clickable trigger
- `Select.Content`: Dropdown content
- `Select.Item`: Select option

**Example:**
```tsx
<Select onValueChange={(value) => console.log(value)}>
  <Select.Trigger>
    <Select.Value placeholder="Select an option" />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="option1">Option 1</Select.Item>
    <Select.Item value="option2">Option 2</Select.Item>
  </Select.Content>
</Select>
```

### Tabs

A tabbed interface component.

**Subcomponents:**
- `Tabs`: Container component
- `Tabs.List`: Tab list container
- `Tabs.Trigger`: Individual tab trigger
- `Tabs.Content`: Content for each tab

**Example:**
```tsx
<Tabs defaultValue="tab1">
  <Tabs.List>
    <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab1">Content for tab 1</Tabs.Content>
  <Tabs.Content value="tab2">Content for tab 2</Tabs.Content>
</Tabs>
```

## Feature Components

### ChatBot

An interactive chatbot component that connects to AI APIs.

**Props:**
- `initialMessage`: string - First message to display
- `apiEndpoint`: string - API endpoint to use
- `onComplete`: function - Callback when conversation ends

**Example:**
```tsx
<ChatBot 
  initialMessage="How can I help you with AI implementation?" 
  apiEndpoint="/api/openai/chat"
  onComplete={(conversation) => console.log(conversation)}
/>
```

### AssessmentForm

A multi-step assessment form with progress tracking.

**Props:**
- `questions`: Question[] - Array of assessment questions
- `onSubmit`: function - Callback for form submission
- `initialAnswers`: Record<string, any> - Initial answers (optional)

**Example:**
```tsx
<AssessmentForm
  questions={assessmentQuestions}
  onSubmit={handleSubmit}
/>
```

### ROICalculator

A calculator component for determining ROI of AI implementation.

**Props:**
- `packages`: Package[] - Available implementation packages
- `onCalculate`: function - Callback with calculation results
- `initialValues`: Record<string, number> - Initial form values

**Example:**
```tsx
<ROICalculator
  packages={aiPackages}
  onCalculate={handleROICalculate}
/>
```

### MetricsChart

A component for displaying various metrics and analytics.

**Props:**
- `data`: MetricData[] - Data to display
- `type`: 'bar' | 'line' | 'radar' | 'pie' - Chart type
- `title`: string - Chart title
- `className`: string - Additional CSS classes

**Example:**
```tsx
<MetricsChart
  data={maturityScoreData}
  type="radar"
  title="AI Maturity Assessment"
/>
```

### VideoConsultation

A component for instant video consultations using Daily.co.

**Props:**
- `userName`: string - User's name
- `onSessionEnd`: function - Callback when session ends

**Example:**
```tsx
<VideoConsultation
  userName="John Doe"
  onSessionEnd={handleSessionEnd}
/>
```

## Layout Components

### PageContainer

A container component for consistent page layouts.

**Props:**
- `title`: string - Page title
- `description`: string - Meta description
- `className`: string - Additional CSS classes

**Example:**
```tsx
<PageContainer
  title="AI Readiness Assessment"
  description="Evaluate your organization's readiness for AI adoption"
>
  {/* Page content */}
</PageContainer>
```

### AnimatedSection

A section component with scroll-based animations.

**Props:**
- `direction`: 'up' | 'down' | 'left' | 'right' - Animation direction
- `delay`: number - Animation delay
- `className`: string - Additional CSS classes

**Example:**
```tsx
<AnimatedSection direction="up" delay={0.2}>
  <h2>Key Benefits</h2>
  <p>Transform your business with AI</p>
</AnimatedSection>
```

### Navbar

The application navigation bar.

**Props:**
- `transparent`: boolean - Whether to use transparent background
- `className`: string - Additional CSS classes

**Example:**
```tsx
<Navbar transparent={isHomePage} />
```

### Footer

The application footer.

**Props:**
- `className`: string - Additional CSS classes

**Example:**
```tsx
<Footer className="bg-gray-50" />
```
