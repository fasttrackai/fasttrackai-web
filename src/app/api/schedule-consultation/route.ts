import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    // Log the incoming request
    console.log('Received a POST request to /api/schedule-consultation');
    
    // Parse the JSON body
    let data;
    try {
      data = await request.json();
      console.log('Successfully parsed request body:', data);
    } catch (jsonError) {
      console.error('Failed to parse request JSON:', jsonError);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid request format - could not parse JSON'
        },
        { status: 400 }
      );
    }
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'company', 'industry', 'primaryChallenge', 'implementationBudget'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return NextResponse.json(
        { 
          success: false, 
          message: `Missing required fields: ${missingFields.join(', ')}`
        },
        { status: 400 }
      );
    }
    
    // Check for Resend API key
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.warn('RESEND_API_KEY environment variable is not set - skipping email notifications');
      // Return success anyway, we'll consider the form submitted successfully
      // even though we couldn't send the notification email
      return NextResponse.json({ 
        success: true, 
        message: 'Form submitted successfully (email notifications skipped)'
      });
    }
    
    // Initialize Resend with API key
    const resend = new Resend(resendApiKey);
    
    // Prepare the admin notification email
    try {
      // Send notification to admin
      const emailResult = await resend.emails.send({
        from: `FastTrack AI <noreply@fasttrackai.io>`,
        replyTo: process.env.EMAIL_FROM || 'fasttrack.ai.now@gmail.com',
        to: process.env.EMAIL_FROM || 'fasttrack.ai.now@gmail.com', // Send to admin email
        subject: 'New Consultation Request',
        text: `
New consultation request received:

Customer: ${data.name}
Company: ${data.company}
Email: ${data.email}
Phone: ${data.phone}
Industry: ${data.industry}
Challenge Area: ${data.primaryChallenge}
Budget Range: ${data.implementationBudget}

Additional Information:
${data.additionalInfo || 'None provided'}
        `,
        html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #4f46e5; padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">New Consultation Request</h1>
  </div>
  
  <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
      <h2 style="margin-top: 0; color: #4f46e5;">Customer Information</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Company:</strong> ${data.company}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Industry:</strong> ${data.industry}</p>
      <p><strong>Challenge Area:</strong> ${data.primaryChallenge}</p>
      <p><strong>Budget Range:</strong> ${data.implementationBudget}</p>
    </div>
    
    ${data.additionalInfo ? `
    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px;">
      <h2 style="margin-top: 0; color: #4f46e5;">Additional Information</h2>
      <p>${data.additionalInfo}</p>
    </div>
    ` : ''}
  </div>
</div>
        `
      });
      
      console.log('Email sent successfully:', emailResult);
    } catch (emailError) {
      console.error('Error sending admin email:', emailError);
      // Continue execution even if email fails - don't block the form submission
    }
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'Form submitted successfully'
    });
  } catch (error) {
    console.error('Unexpected error processing consultation request:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An unexpected error occurred',
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