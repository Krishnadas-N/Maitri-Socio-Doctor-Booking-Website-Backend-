# Maitri Socio Mental Health Booking - Backend

Welcome to the backend repository of the Maitri Socio Mental Health Booking project. This project is built using Node.js, Express, and TypeScript, providing robust features for managing mental health consultations and bookings.

## Features

- User Authentication and Role-Based Authorization
- Google Login Integration
- Secure Password Reset Mechanism
- Video and Chat Consultation Links
- Real-time Chat with Socket.IO
- Scheduled Tasks using Cron Jobs
- Clean Architecture for maintainability
- Email Notifications using Nodemailer
- Image Uploads using Cloudinary and Multer
- MongoDB and MongoDB Atlas for database management
- JSON Web Tokens (JWT) for secure authentication

## Technologies Used

- Node.js
- Express.js
- TypeScript
- MongoDB
- MongoDB Atlas
- Passport.js (for authentication)
- JWT (for secure user authentication)
- Cloudinary (for image uploads)
- Multer (for handling multipart/form-data)
- Nodemailer (for email notifications)
- Socket.IO (for real-time communication)
- Cron Jobs (for scheduled tasks)

## Getting Started

### Prerequisites

- Node.js
- MongoDB (local or MongoDB Atlas account)
- TypeScript
- Yarn or npm

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Krishnadas-N/Maitri-Socio-Doctor-Booking-Website-Backend-.git
    ```

2. Navigate to the project directory:
    ```bash
    cd maitri-backend
    ```

3. Install dependencies using npm or yarn:
    ```bash
    # Using npm
    npm install

    # OR using yarn
    yarn install
    ```

4. Create a `.env` file in the root folder and add your environment variables:
    ```env
    MONGODB_URL=
    UserResetPasswordLink=
    DoctorResetPasswordLink=
    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=
    TokenHelper=
    SMTP_HOST=
    SMTP_PORT=
    SMTP_USERNAME=
    SMTP_PASSWORD=
    SMTP_SENDER=
    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=
    CLOUDINARY_URL=cloudinary:
    RAZORPAY_KEY_ID=
    RAZORPAY_KEY_SECRET=
    PAYPAL_CLIENTID=
    PAYPAL_CLIENTSECRET=
    CHAT_CONSULATION_LINK=/chats
    VIDEO_CONSULTATION_LINK=/video-consult
    REFRESH_TOKEN_SECRET=
    STRIPE_SECRET_KEY=
    Admin_Id=661291d8ea1cdbfa24344940
    FIREBASE_SERVICE_ACCOUNT='{
      "type": "service_account",
      "project_id": "",
      "private_key_id": "",
      "private_key": "",
      "client_email": "",
      "client_id": "",
      "auth_uri": "",
      "token_uri": "",
      "auth_provider_x509_cert_url": "",
      "client_x509_cert_url": "",
      "universe_domain": ""
    }'
    ```

5. Run the application:
    ```bash
    # Using npm
    npm start

    # OR using yarn
    yarn start
    ```

6. Open your browser and navigate to your server's endpoint (e.g., `http://localhost:3000`).

### API Documentation

Refer to the API documentation to explore the available endpoints and their functionalities. 

- User Authentication: `/api/auth`
- User Management: `/api/users`
- Doctor Management: `/api/doctors`
- Admin Management: `/api/admin`
- Video Consultation: `/video-consult`
- Chat Consultation: `/chats`

### Cron Jobs

The application includes cron jobs for scheduled tasks. Ensure that your server is running to allow cron jobs to execute as expected.

### Contributing

Contributions are welcome! Please create a pull request for any improvements or features you would like to add.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

