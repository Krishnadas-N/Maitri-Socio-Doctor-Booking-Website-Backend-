import stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config()
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

export const stripeClient = new stripe(stripeSecretKey, {
  apiVersion: '2024-04-10',
});
