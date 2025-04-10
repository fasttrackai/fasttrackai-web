import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function GET(request: Request) {
  try {
    // Initialize Resend with API key
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Check if API key is configured
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Resend API key is not configured'
        },
        { status: 500 }
      );
    }
    
    // Check if from email is configured
    if (!process.env.EMAIL_FROM) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'EMAIL_FROM is not configured'
        },
        { status: 500 }
      );
    }
    
    // Send a test email
    const { data, error } = await resend.emails.send({
      from: `${process.env.EMAIL_SENDER_NAME || 'FastTrack AI'} <noreply@fasttrackai.io>`,
      replyTo: process.env.EMAIL_FROM || 'fasttrack.ai.now@gmail.com',
      to: process.env.EMAIL_FROM || 'fasttrack.ai.now@gmail.com', // Send to ourselves for testing
      subject: 'Resend Test Email',
      text: 'This is a test email from FastTrack AI website.',
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #6d28d9; padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Resend Test Email</h1>
  </div>
  
  <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
    <p>This is a test email from the FastTrack AI website.</p>
    <p>If you're seeing this, Resend is configured correctly!</p>
    
    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h2 style="margin-top: 0; color: #6d28d9;">Configuration Details</h2>
      <p><strong>Environment:</strong> ${process.env.NODE_ENV}</p>
      <p><strong>Sender:</strong> ${process.env.EMAIL_SENDER_NAME} &lt;${process.env.EMAIL_FROM}&gt;</p>
      <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
    </div>
  </div>
  
  <div style="padding: 20px; background-color: #f9fafb; text-align: center; font-size: 12px; color: #6b7280;">
    <p>© ${new Date().getFullYear()} FastTrack AI. All rights reserved.</p>
  </div>
</div>
      `
    });
    
    if (error) {
      console.error('Error sending test email:', error);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to send test email',
          error: error.message
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test email sent successfully',
      data
    });
  } catch (error) {
    console.error('Error in test-resend route:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to send test email',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 