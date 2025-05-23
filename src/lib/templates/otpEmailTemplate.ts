/**
 * Returns a styled HTML email string for sending an OTP code.
 *
 * @param {Object} params
 * @param {string} params.userName - Recipient's name
 * @param {string} params.otpCode - OTP code to include
 * @param {string} params.appName - Application name
 * @returns {string} HTML content of the email
 */
type EmailOptions = {
  userName: string;
  otpCode: string;
  appName: string;
};
export function renderOtpEmail({ userName, otpCode, appName }: EmailOptions) {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Your OTP Code</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0; padding:0; background-color:#f4f4f4;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; margin:auto; font-family:Arial, sans-serif;">
      <tr>
        <td bgcolor="#ffffff" style="padding:40px 30px 20px 30px; border-radius: 8px 8px 0 0;">
          <h2 style="margin:0; color:#333333; text-align:center;">🔐 Verify Your Account</h2>
        </td>
      </tr>
      <tr>
        <td bgcolor="#ffffff" style="padding:20px 30px 40px 30px; color:#555555; font-size:16px;">
          <p style="margin:0 0 16px 0;">Hi <strong>${userName}</strong>,</p>
          <p style="margin:0 0 16px 0;">Use the following OTP to complete your verification process:</p>
          <p style="margin:0 0 24px 0; font-size:28px; font-weight:bold; color:#2e7d32; text-align:center; letter-spacing:2px;">
            ${otpCode}
          </p>
          <p style="margin:0 0 16px 0;">This OTP will expire in <strong>10 minutes</strong>. If you didn’t request this, you can safely ignore this email.</p>
          <p style="margin:24px 0 0 0;">Thanks,<br /><strong>The ${appName} Team</strong></p>
        </td>
      </tr>
      <tr>
        <td bgcolor="#f1f1f1" style="padding:20px 30px; text-align:center; font-size:12px; color:#999999; border-radius: 0 0 8px 8px;">
          If you have questions, contact support at <a href="mailto:support@example.com" style="color:#2e7d32;">support@example.com</a>
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();
}
