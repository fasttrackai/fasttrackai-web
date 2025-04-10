export default function EmailTest() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Resend Email Test</h1>
      
      <div className="mb-8">
        <p className="mb-4">
          Click the link below to send a test email to fasttrack.ai.now@gmail.com. 
          The results will be displayed on a new page.
        </p>
        
        <a 
          href="/api/test-email" 
          target="_blank"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded"
        >
          Send Test Email
        </a>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded">
        <h2 className="font-bold mb-2">Instructions</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Click the button above to send a test email</li>
          <li>Check your Gmail inbox for the test email</li>
          <li>Verify that the email arrives from noreply@fasttrackai.io</li>
          <li>Confirm that replies will go to fasttrack.ai.now@gmail.com</li>
        </ol>
      </div>
    </div>
  );
} 