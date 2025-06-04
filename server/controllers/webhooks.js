import { Webhook } from "svix";
import Stripe from "stripe";

import User from "../models/User.js";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// Clerk webhook handler
export const clerkWebhook = async (req, res) => {
  try {
    const Whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    await Whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.create(userData);
        res.json({});
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        res.json({});
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        res.json({});
        break;
      }

      default:
        res.json({});
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Stripe webhook handler
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        const sessionList = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });

        if (!sessionList.data || sessionList.data.length === 0) {
          return res.status(400).send("No Stripe session found for this payment intent");
        }

        const { purchaseId } = sessionList.data[0].metadata;

        const purchaseData = await Purchase.findById(purchaseId);
        if (!purchaseData) return res.status(404).send("Purchase not found");

        const userData = await User.findById(purchaseData.userId);
        if (!userData) return res.status(404).send("User not found");

        const courseData = await Course.findById(purchaseData.courseId.toString());
        if (!courseData) return res.status(404).send("Course not found");

        if (!courseData.enrolledStudents.includes(userData._id)) {
          courseData.enrolledStudents.push(userData._id);
          await courseData.save();
        }

        if (!userData.enrolledCourses.includes(courseData._id)) {
          userData.enrolledCourses.push(courseData._id);
          await userData.save();
        }

        purchaseData.status = "completed";
        await purchaseData.save();

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        const sessionList = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });

        if (!sessionList.data || sessionList.data.length === 0) {
          return res.status(400).send("No Stripe session found for failed payment intent");
        }

        const { purchaseId } = sessionList.data[0].metadata;
        const purchaseData = await Purchase.findById(purchaseId);
        if (purchaseData) {
          purchaseData.status = "failed";
          await purchaseData.save();
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.json({ received: true });
  } catch (err) {
    console.error("❌ Error processing webhook event:", err);
    return res.status(500).send(`Webhook handler failed: ${err.message}`);
  }
};
