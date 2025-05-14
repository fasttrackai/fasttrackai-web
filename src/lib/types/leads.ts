export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AssessmentAnswer {
  [questionId: string]: string;
}

export interface LeadData {
  id?: string;
  timestamp: string;
  interactionDuration: number;
  messageCount: number;
  conversationHistory: string;
  assessmentAnswers: AssessmentAnswer;
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'archived';
  createdAt?: string;
  updatedAt?: string;
  source?: string;
  userAgent?: string;
  pagePath?: string;
  referrer?: string;
  contactMethod?: 'assessment' | 'chat' | 'form';
} 