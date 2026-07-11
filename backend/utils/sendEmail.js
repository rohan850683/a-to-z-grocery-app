const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({
  to,
  subject,
  html,
  text = "",
}) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `A to Z Grocery <${process.env.RESEND_FROM_EMAIL}>`,
      to,
      subject,
      html,
      text,
    });

    if (error) {
      console.error("❌ Resend Error:", error);
      return false;
    }

    console.log("✅ Email Sent:", data?.id);
    return true;
  } catch (err) {
    console.error("❌ Email Error:", err);
    return false;
  }
};

module.exports = sendEmail;