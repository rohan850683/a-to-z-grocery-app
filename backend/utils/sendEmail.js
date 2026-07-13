const axios = require("axios");

const sendEmail = async ({
  to,
  subject,
  html,
  text = "",
}) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: process.env.BREVO_SENDER_NAME || "A to Z Grocery",
          email: process.env.BREVO_SENDER_EMAIL,
        },
        to: [
          {
            email: to,
          },
        ],
        subject,
        htmlContent: html,
        textContent: text,
      },
      {
        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
        timeout: 20000,
      }
    );

    console.log(
      "✅ Brevo Email Sent Successfully:",
      response.data?.messageId || response.data
    );

    return true;
  } catch (err) {
    console.error(
      "❌ Brevo Email Error:",
      err.response?.data || err.message
    );

    return false;
  }
};

module.exports = sendEmail;