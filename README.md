
### Backend Repository (Node.js, Express, TypeScript)

```markdown
# Maitri Socio Mental Health Booking - Backend

Welcome to the backend repository of the Maitri Socio Mental Health Booking project. This project is built using Node.js, Express, and TypeScript to provide a robust backend API for mental health consultation bookings.

## Features

- User Authentication and Authorization
- Booking Management
- Payment Integration with Razorpay
- Real-time Notifications with Socket.IO
- Admin Dashboard API
- Video Conferencing Integration with ZegoCloud

## Technologies Used

- Node.js
- Express.js
- TypeScript
- MongoDB
- Socket.IO
- Razorpay
- Nodemailer
- Passport Js wit JWT for Authentication

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/maitri-backend.git
    ```

2. Navigate to the project directory:
    ```sh
    cd maitri-backend
    ```

3. Install dependencies:
    ```sh
    npm install
    ```

4. Create a `.env` file in the root directory and add the following configuration:
    ```env
MONGODB_URL =
UserResetPasswordLink = http://localhost:4200/reset-password?token=
DoctorResetPasswordLink =  http://localhost:4200/doctor/reset-password?token=
GOOGLE_CLIENT_ID = 
GOOGLE_CLIENT_SECRET =
TokenHelper = 
SMTP_HOST = 
SMTP_PORT = 
SMTP_USERNAME =
SMTP_PASSWORD = 
SMTP_SENDER=
CLOUDINARY_CLOUD_NAME = 
CLOUDINARY_API_KEY = 
# This is a secret key that's used to verify the authenticity of requests made by users in order to prevent CSRF attacks.
CLOUDINARY_API_SECRET =
CLOUDINARY_URL=
RAZORPAY_KEY_ID = 
RAZORPAY_KEY_SECRET= 
CHAT_CONSULATION_LINK = /chats
VIDEO_CONSULTATION_LINK = /video-consult
REFRESH_TOKEN_SECRET = 
STRIPE_SECRET_KEY = 
FIREBASE_SERVICE_ACCOUNT='{
  "type": "",
  "project_id": "",
  "private_key_id": "",
  "private_key": "-----BEGIN PRIVATE KEY-----\n=\n-----END PRIVATE KEY-----\n",
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
    ```sh
    npm run dev
    ```

6. The backend API will be available at `http://localhost:3000`.

### Frontend Repository

The frontend of this project is built using Angular. You can find the frontend repository [here](https://github.com/yourusername/maitri-frontend).

