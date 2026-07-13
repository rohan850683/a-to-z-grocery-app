const emailTransporter = require("../config/emailTransporter");

const sendEmail = async ({
  to,
  subject,
  html,
  text = "",
}) => {
  try {
    await emailTransporter.sendMail({
      from: `"A to Z Grocery" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Email Sent Successfully");
    return true;
  } catch (err) {
    console.error("❌ Email Error:", err);
    return false;
  }
};

module.exports = sendEmail;