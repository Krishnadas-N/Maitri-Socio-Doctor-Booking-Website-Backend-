const verifyEmailTemplate = (otp: string): { html: string } => {
    const html = `
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .otp {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 20px;
        }
        .note {
            font-style: italic;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Email Verification</h2>
        </div>
        <p>Your One-Time Password (OTP) for verification is:</p>
        <div class="otp">
            <!-- This is where the OTP value will be dynamically inserted -->
            {{OTP_VALUE}}
        </div>
        <p class="note">Please use this OTP to verify your email.</p>
    </div>
{% comment %} </disc> {% endcomment %}
</body>
</html>
`;
    return { html };
};

export default verifyEmailTemplate;
