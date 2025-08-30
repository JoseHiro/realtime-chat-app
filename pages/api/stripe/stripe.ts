import { NextApiRequest, NextApiResponse } from "next";
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method === "POST"){
    try {
      

    } catch (error) {

    }
  }
}
