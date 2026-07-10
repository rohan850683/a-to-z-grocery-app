const emailTransporter = require("../config/emailTransporter");

const sendEmail = async ({
  to,
  subject,
  html,
  text = "",
}) => {
  try {
    const info = await emailTransporter.sendMail({
      from: `"A to Z Grocery" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Email Sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Email Error:", error.message);
    return false;
  }
};

module.exports = sendEmail;