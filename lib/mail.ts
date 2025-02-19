const sendEmail = async (email: string, subject: string, html: string) => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY!,
    },
    body: JSON.stringify({
      sender: { email: "nguyennhungforwork04@gmail.com", name: "Nhung Nguyen" }, // Change to a verified email
      to: [{ email }],
      subject,
      htmlContent: html,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Failed to send email: ${JSON.stringify(data)}`);
  }
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  const html = `<p>Your 2FA code is: <strong>${token}</strong></p>`;
  await sendEmail(email, "2FA Code", html);
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.DOMAIN}/auth/new-verification?token=${token}`;
  const html = `<p>Click <a href="${confirmLink}">here</a> to confirm your email.</p>`;
  await sendEmail(email, "Confirm your email", html);
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.DOMAIN}/auth/new-password?token=${token}`;
  const html = `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`;
  await sendEmail(email, "Reset your password", html);
};
