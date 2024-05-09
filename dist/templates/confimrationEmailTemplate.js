"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const confrimationEmailTemplate = (link) => {
    const html = `
    <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Profile Accepted</title>
          <style>
            /* Add your CSS styles here */
            body {
              font-family: Arial, sans-serif;
              background-color: #f5f5f5;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #333333;
            }
            p {
              color: #666666;
            }
            .button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #007bff;
              color: #ffffff;
              text-decoration: none;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Congratulations! Your Profile Has Been Accepted</h1>
            <p>Your profile has been successfully accepted. You can now log in to your account and start using our platform.</p>
            <p>If you have any questions or need further assistance, please feel free to contact us.</p>
            <a href="${link}" class="button">Login Now</a>
            <p>Best regards,<br>Your Organization Name</p>
          </div>
        </body>
        </html>
    `;
    return { html };
};
exports.default = confrimationEmailTemplate;
