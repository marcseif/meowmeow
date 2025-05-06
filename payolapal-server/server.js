require("dotenv").config(); // Load variables from .env

const express = require("express");
const app = express();
const Stripe = require("stripe");
const cors = require("cors");

console.log("Stripe Secret Key: ", process.env.STRIPE_SECRET_KEY); // Log to verify the key

const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Use key from .env

app.use(cors());
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  const { amount } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "aud",
            unit_amount: Math.round(amount * 100),
            product_data: {
              name: "PayolaPal Boost",
              description: "Custom boosting order",
            },
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:5500/success.html",
      cancel_url: "http://localhost:5500/cancel.html",
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(4242, () =>
  console.log("Stripe server running on http://localhost:4242")
);
