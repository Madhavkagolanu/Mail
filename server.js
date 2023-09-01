const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const dotenv = require("dotenv"); // Import dotenv

dotenv.config({ path: "./.env" }); // Configure dotenv

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.json({ msg: "HAII" });
});

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587, // Use port 587 for TLS
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.email,
    pass: process.env.pwd,
  },
});

app.post("/send-email", (req, res) => {
  const { items } = req.body; // Get items from the request body
  console.log(items);
  const mailOptions = {
    from: process.env.email,
    to: process.env.email,
    subject: "Order Details",
    html: `
        <p>Thank you for your order! Here are your order details:</p>
        <ul>
          ${items
            .map((item) => `<li>${item.quantity} x ${item.Item}</li>`)
            .join("")}
        </ul>
      `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent: " + info.response);
      res.send("Email sent successfully");
    }
  });
});

const PORT = 3001; // Choose a suitable port number
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// console.log(process.env.pwd);
