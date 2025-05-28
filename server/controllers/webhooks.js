import { Webhook } from "svix";
import User from "../models/User.js";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";


//Apicontroller function to manage clerk user with database

export const clerkWebhook = async (req, res) => {
    try {
        const Whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
        
        await Whook.verify(JSON.stringify(req.body),{
            "svix-id" : req.headers["svix-id"],
            "svix-timestamp" : req.headers["svix-timestamp"],
            "svix-signature" : req.headers["svix-signature"]
        })

        const {data , type} = req.body

        switch (type) {
            case 'user.created':{
                const userData = {
                    _id : data.id,
                    email : data.email_addresses[0].email_address,
                    name : data.first_name + " " + data.last_name,
                    imageUrl : data.image_url,
                }
                await User.create(userData)
                res.json({})
                break;
            }
                
            case 'user.updated':{
                const userData = {
                    email : data.email_addresses[0].email_address,
                    name : data.first_name + " " + data.last_name,
                    imageUrl : data.image_url,
                }
                await User.findByIdAndUpdate(data.id, userData)
                res.json({})
                break;
            }
            case 'user.deleted':{
                await User.findByIdAndDelete(data.id)
                res.json({})
                break;
            }
        
            default:
                break;
        }
    } catch (error) {
        res.json({success : false, message : error.message})
    }
}

export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = Stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const { purchaseId, userId, courseId } = session.metadata || {};

      if (!purchaseId || !userId || !courseId) {
        console.error("Missing metadata");
        return res.status(400).send("Missing metadata");
      }

      try {
        const [purchaseData, userData, courseData] = await Promise.all([
          Purchase.findById(purchaseId),
          User.findById(userId),
          Course.findById(courseId)
        ]);

        if (!purchaseData || !userData || !courseData) {
          return res.status(404).send("Data not found");
        }

        if (!courseData.enrolledStudents.includes(userId)) {
          courseData.enrolledStudents.push(userId);
          await courseData.save();
        }

        if (!userData.enrolledCourses.includes(courseId)) {
          userData.enrolledCourses.push(courseId);
          await userData.save();
        }

        purchaseData.status = 'completed';
        await purchaseData.save();

        console.log("Payment succeeded and enrollment updated.");
      } catch (err) {
        console.error("Error processing checkout.session.completed:", err);
        return res.status(500).send("Internal Server Error");
      }

      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

      const sessions = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntent.id,
        limit: 1,
      });

      const session = sessions.data[0];
      const { purchaseId } = session.metadata || {};
      const purchaseData = await Purchase.findById(purchaseId);

      if (purchaseData) {
        purchaseData.status = 'failed';
        await purchaseData.save();
      }

      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

