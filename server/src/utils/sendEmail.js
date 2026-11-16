import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text, html }) => {
  const smtpUser = process.env.EMAIL_USER || process.env.SMTP_USER;
  const smtpPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

  if (smtpUser && smtpPass) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for 587
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const mailOptions = {
      from: `"QuickStore Support" <${smtpUser}>`,
      to,
      subject,
      text,
      html,
    };

    return await transporter.sendMail(mailOptions);
  } else {
    // Development / Local fallback: Log formatted email to console
    console.log("\n=======================================================");
    console.log(" [DEV EMAIL SIMULATOR] No SMTP credentials configured");
    console.log(` To: ${to}`);
    console.log(` Subject: ${subject}`);
    console.log(" Body (Text):");
    console.log(text);
    console.log("=======================================================\n");
    return { devMode: true, message: "Email logged to console in dev mode" };
  }
};
