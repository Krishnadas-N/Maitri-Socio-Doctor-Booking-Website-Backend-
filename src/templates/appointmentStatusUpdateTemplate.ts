const appointmentStatusTemplate = (patientName:string, status:string, doctorName:string, date:any, slot:string): { html: string } => {
    const html = `
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: 'Arial', sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                color: #333;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 40px auto;
                background-color: #fff;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background-color: #007bff;
                padding: 20px;
                text-align: center;
                color: #fff;
                display: flex;
                align-items: center;
                gap: 20px;
                justify-content: center;
            }
            .header img {
                width: 60px;
                border-radius: 50%;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
            }
            .content {
                padding: 30px;
            }
            .content h1 {
                font-size: 22px;
                margin: 0 0 20px;
                color: #007bff;
            }
            .content p {
                font-size: 16px;
                line-height: 1.6;
                margin: 0 0 10px;
            }
            .appointment-details {
                background-color: #f9f9f9;
                padding: 20px;
                border-radius: 8px;
                margin-top: 20px;
                border: 1px solid #dee2e6;
            }
            .appointment-details h2 {
                font-size: 20px;
                margin: 0 0 10px;
                color: #333;
            }
            .appointment-details .details {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 0;
                border-bottom: 1px solid #dee2e6;
            }
            .appointment-details .details:last-child {
                border-bottom: none;
            }
            .footer {
                background-color: #007bff;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #fff;
            }
            .footer a {
                color: #fff;
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://res.cloudinary.com/dpjkuvq1r/image/upload/v1713504711/Maitri-Project/pjk1dkhxnelixo9vtoiv.jpg" alt="Maitiri-Consultation Logo" class="imageSrc">
                <h1>Appointment Booking Update</h1>
            </div>
            <div class="content">
                <h1>Dear ${patientName},</h1>
                <p>Your appointment status has been updated to <strong>${status}</strong>.</p>
                <div class="appointment-details">
                    <h2>Appointment Details</h2>
                    <div class="details">
                        <span><strong>Doctor:</strong></span>
                        <span>${doctorName}</span>
                    </div>
                    <div class="details">
                        <span><strong>Date:</strong></span>
                        <span>${date}</span>
                    </div>
                    <div class="details">
                        <span><strong>Time Slot:</strong></span>
                        <span>${slot}</span>
                    </div>
                </div>
                <p>If you have any questions or need further assistance, please contact our support team.</p>
                <p>Thank you for using Maitiri-Consultation.</p>
            </div>
            <div class="footer">
                &copy; 2024 Maitiri-Consultation. All rights reserved. | <a href="#">Privacy Policy</a> | <a href="#">Contact Support</a>
            </div>
        </div>
    </body>
    </html>
`;
    return { html };
};

export default appointmentStatusTemplate;
