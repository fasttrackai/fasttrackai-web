import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Log the received data
    console.log('Received consultation request:', data);
    
    // Initialize Resend with API key
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Format the date and time for better readability
    const appointmentDate = new Date(data.appointmentDate);
    const formattedDate = appointmentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Format time from 24 hour to 12 hour format
    const timeHour = parseInt(data.appointmentTime.split(':')[0]);
    const formattedTime = `${timeHour > 12 ? timeHour - 12 : timeHour}:00 ${timeHour >= 12 ? 'PM' : 'AM'}`;
    
    // Create a calendar invite (ICS file)
    const icsEvent = generateICSFile({
      startTime: `${data.appointmentDate}T${data.appointmentTime}:00`,
      endTime: `${data.appointmentDate}T${parseInt(data.appointmentTime.split(':')[0]) + 1}:00:00`,
      summary: 'FastTrack AI Consultation',
      description: `Consultation with ${data.name} from ${data.company} regarding ${data.challengeArea}`,
      location: 'Virtual Meeting (link to be provided)',
      organizer: {
        name: process.env.EMAIL_SENDER_NAME || 'FastTrack AI Team',
        email: process.env.EMAIL_FROM || 'team@fasttrackai.io'
      },
      attendee: {
        name: data.name,
        email: data.email
      }
    });
    
    // Send email to user using Resend
    await resend.emails.send({
      from: `${process.env.EMAIL_SENDER_NAME || 'FastTrack AI'} <noreply@fasttrackai.io>`,
      replyTo: process.env.EMAIL_FROM || 'fasttrack.ai.now@gmail.com',
      to: data.email,
      subject: 'Your FastTrack AI Consultation Confirmation',
      text: `
Thank you for scheduling a consultation with FastTrack AI!

Consultation Details:
Date: ${formattedDate}
Time: ${formattedTime}
Topic: ${data.challengeArea}

One of our AI strategy experts will be contacting you at the scheduled time.

What to expect next:
- You'll receive a calendar invitation shortly
- We'll send you a pre-consultation questionnaire to help us prepare
- You'll have a 30-minute strategy session with an AI implementation expert
- We'll follow up with a customized implementation proposal

If you need to reschedule or have any questions, please reply to this email.

Best regards,
The FastTrack AI Team
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #6d28d9; padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Your Consultation is Confirmed!</h1>
  </div>
  
  <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
    <p>Thank you for scheduling a consultation with FastTrack AI!</p>
    
    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h2 style="margin-top: 0; color: #6d28d9;">Consultation Details</h2>
      <p><strong>Date:</strong> ${formattedDate}</p>
      <p><strong>Time:</strong> ${formattedTime}</p>
      <p><strong>Topic:</strong> ${data.challengeArea}</p>
    </div>
    
    <p>One of our AI strategy experts will be contacting you at the scheduled time.</p>
    
    <h3 style="color: #6d28d9;">What to expect next:</h3>
    <ul>
      <li>You'll receive a calendar invitation shortly</li>
      <li>We'll send you a pre-consultation questionnaire to help us prepare</li>
      <li>You'll have a 30-minute strategy session with an AI implementation expert</li>
      <li>We'll follow up with a customized implementation proposal</li>
    </ul>
    
    <p>If you need to reschedule or have any questions, please reply to this email.</p>
    
    <p>Best regards,<br>The FastTrack AI Team</p>
  </div>
  
  <div style="padding: 20px; background-color: #f9fafb; text-align: center; font-size: 12px; color: #6b7280;">
    <p>© ${new Date().getFullYear()} FastTrack AI. All rights reserved.</p>
  </div>
</div>
      `,
      attachments: [
        {
          filename: 'consultation.ics',
          content: Buffer.from(icsEvent).toString('base64')
        }
      ]
    });
    
    // Send notification to admin
    await resend.emails.send({
      from: `FastTrack AI System <noreply@fasttrackai.io>`,
      replyTo: process.env.EMAIL_FROM || 'fasttrack.ai.now@gmail.com',
      to: process.env.EMAIL_FROM || 'fasttrack.ai.now@gmail.com', // Send to admin email
      subject: 'New Consultation Scheduled',
      text: `
New consultation has been scheduled:

Customer: ${data.name}
Company: ${data.company}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Industry: ${data.industry}
Challenge Area: ${data.challengeArea}
Budget Range: ${data.budget || 'Not specified'}

Appointment: ${formattedDate} at ${formattedTime}

Additional Information:
${data.message || 'None provided'}
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #4f46e5; padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">New Consultation Scheduled</h1>
  </div>
  
  <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
      <h2 style="margin-top: 0; color: #4f46e5;">Customer Information</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Company:</strong> ${data.company}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
      <p><strong>Industry:</strong> ${data.industry}</p>
      <p><strong>Challenge Area:</strong> ${data.challengeArea}</p>
      <p><strong>Budget Range:</strong> ${data.budget || 'Not specified'}</p>
    </div>
    
    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
      <h2 style="margin-top: 0; color: #4f46e5;">Appointment Details</h2>
      <p><strong>Date:</strong> ${formattedDate}</p>
      <p><strong>Time:</strong> ${formattedTime}</p>
    </div>
    
    ${data.message ? `
    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px;">
      <h2 style="margin-top: 0; color: #4f46e5;">Additional Information</h2>
      <p>${data.message}</p>
    </div>
    ` : ''}
  </div>
</div>
      `
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Consultation scheduled successfully'
    });
  } catch (error) {
    console.error('Error scheduling consultation:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to schedule consultation',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function to generate ICS file for calendar invite
function generateICSFile({ startTime, endTime, summary, description, location, organizer, attendee }: {
  startTime: string;
  endTime: string;
  summary: string;
  description: string;
  location: string;
  organizer: { name: string; email: string };
  attendee: { name: string; email: string };
}) {
  // Format time to UTC format for ICS
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  const now = formatDate(new Date().toISOString());
  const start = formatDate(startTime);
  const end = formatDate(endTime);
  
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//FastTrack AI//Consultation//EN
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
DTSTART:${start}
DTEND:${end}
DTSTAMP:${now}
ORGANIZER;CN=${organizer.name}:mailto:${organizer.email}
UID:${Math.random().toString(36).substring(2)}@fasttrackai.io
ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE;CN=${attendee.name};LANGUAGE=en-US:mailto:${attendee.email}
CREATED:${now}
DESCRIPTION:${description}
LAST-MODIFIED:${now}
LOCATION:${location}
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:${summary}
TRANSP:OPAQUE
END:VEVENT
END:VCALENDAR`;
} 