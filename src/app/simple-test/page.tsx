export default function SimpleTest() {
  return (
    <html>
      <head>
        <title>Simple Email Test</title>
      </head>
      <body style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h1>Simple Email Test</h1>
        <p>Click the link below to send a test email:</p>
        <a 
          href="/api/test-email"
          style={{
            display: "inline-block",
            backgroundColor: "#6d28d9",
            color: "white",
            padding: "10px 20px",
            textDecoration: "none",
            borderRadius: "4px",
            margin: "20px 0"
          }}
        >
          Send Test Email
        </a>
      </body>
    </html>
  );
} 