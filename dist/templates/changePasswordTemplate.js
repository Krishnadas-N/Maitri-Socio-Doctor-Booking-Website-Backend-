"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resetPasswordLink = (resetLink) => {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
        }
        
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 10px;
          box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
        }
        
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .logo {
          width: 150px;
          height: auto;
        }
        
        .content {
          padding: 0 20px;
          text-align: center;
        }
        
        .reset-link {
          display: inline-block;
          background-color: #4CAF50;
          color: #ffffff;
          text-decoration: none;
          padding: 12px 20px;
          border-radius: 5px;
          margin-top: 20px;
          font-weight: bold;
        }
        
        .reset-link:hover {
          background-color: #45a049;
        }
        
        .footer {
          text-align: center;
          margin-top: 30px;
          color: #888888;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
    
        <div class="container">
            <div class="header">
              <img src="https://res.cloudinary.com/dpjkuvq1r/image/upload/v1713504711/Maitri-Project/pjk1dkhxnelixo9vtoiv.jpg" alt="Logo" class="logo">
              <h1>Password Reset</h1>
            </div>
            <div class="content">
              <p>You've requested to reset your password.</p>
              <p>Click the button below to change your password:</p>
              <a href="${resetLink}" class="reset-link">Reset Password</a>
            </div>
            <div class="footer">
              <p>If you didn't request a password reset, you can ignore this email.</p>
            </div>
          </div>
    
    </body>
    </html>    
    `;
    return { html };
};
exports.default = resetPasswordLink;
