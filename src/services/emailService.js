import emailjs from "@emailjs/browser";

import.meta.env.VITE_EMAIL_TEMPLATE_ID;

const serviceID = import.meta.env.VITE_EMAIL_SERVICE_ID;
const templateID = import.meta.env.VITE_EMAIL_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAIL_PUBLIC_KEY;

export async function sendDailySummary({ toEmail, message }) {
  try {
    await emailjs.send(
      serviceID,
      templateID,
      { to_email: toEmail, message },
      publicKey
    );
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}
export async function sendTestEmail(toEmail, message) {
  try {
    await emailjs.send(
      serviceID,
      templateID,
      { to_email: toEmail, message },
      publicKey
    );
    console.log("Test email sent successfully");
  } catch (error) {
    console.error("Failed to send test email:", error);
  }
}
