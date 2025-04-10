// IMPORTANT: Cal.com Integration Fix Instructions

/*
To fix the Cal.com integration in the schedule-consultation page, please make these edits:

1. In the file src/app/schedule-consultation/page.tsx, find the cal.inline() function call (around line 60-70)

2. Change the calLink parameter from "fasttrack-ai/consultation" to "fasttrack/30min" or your actual Cal.com link:

  cal.inline({
    elementOrSelector: calendarRef.current,
    calLink: "fasttrack/30min",  // Update this to your actual Cal.com username/event-name
    config: {
      name: formData.name,
      email: formData.email,
      notes: `Company: ${formData.company}\nIndustry: ${formData.industry}\nChallenge: ${formData.challengeArea}\nBudget: ${formData.budget || 'Not specified'}\nAdditional Info: ${formData.message || 'None'}`
    }
  });

3. Cal.com Setup Required:
   - Create a Cal.com account at https://cal.com if you haven't already
   - Set up a new event type (30-minute consultation)
   - The "calLink" parameter should be "[your-username]/[your-event-name]"
   - In your Cal.com settings, add the FastTrackAI website URL to allowed domains

Note: The middleware error you're seeing may be unrelated to the Cal.com integration.
If you're still having issues, try accessing the Cal API directly with a simpler test page.
*/ 