const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/order");

exports.paymentCheckout = async (req, res) => {
  const { username, email, id } = req.body;
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZOR_PAY_KEY_ID,
      key_secret: process.env.RAZOR_PAY_SECRET_KEY,
    });

    const options = {
      amount: 50000, // amount in the smallest currency unit
      currency: "INR",
      receipt: "order_rcptid_11",
    };
    instance.orders.create(options, function (err, order) {
      if (err) throw Error(err);

      Order.create({
        order_id: order.id,
        amount: order.amount,
        payment_status: "pending",
        userId: id,
        username,
        email,
      });
      res.status(200).json(order);
    });
  } catch (err) {
    res.status(500).send("something went wrong");
  }
};

exports.paymentVerify = async (req, res) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    username,
    email,
  } = req.body;
  // const findOrder = Order.findOne()

  const generatedSignature = crypto
    .createHmac("SHA256", process.env.RAZOR_PAY_SECRET_KEY)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  const isSignatureValid = generatedSignature == razorpay_signature;
  if (isSignatureValid) {
    Order.findOne({
      where: { email: email, payment_status: "pending" },
    })
      .then((order) => {
        order.update({
          payment_status: "Success",
        });
        return order.save();
      })
      .then((updated) => {
        res.redirect(
          `http://localhost:5173/user/payment_success?refrence=${razorpay_payment_id}`
        );
      })
      .catch((err) => {
        res.status.send("order not found");
      });
  } else {
    res.status(400).json({ success: false, message: "payment did not verify" });
  }
};
