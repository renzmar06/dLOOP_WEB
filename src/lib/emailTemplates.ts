export const getPasswordResetEmailTemplate = (resetUrl: string, userName?: string) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - dLOOP</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">dLOOP</h1>
                <p style="color: #dcfce7; margin: 10px 0 0 0; font-size: 16px;">Sustainable Waste Management</p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 30px;">
                <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
                    Password Reset Request
                </h2>
                
                ${userName ? `<p style="color: #4b5563; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
                    Hello ${userName},
                </p>` : ''}
                
                <p style="color: #4b5563; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
                    We received a request to reset your password for your dLOOP account. If you made this request, click the button below to reset your password:
                </p>

                <!-- Reset Button -->
                <div style="text-align: center; margin: 40px 0;">
                    <a href="${resetUrl}" 
                       style="display: inline-block; background-color: #16a34a; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; transition: background-color 0.3s ease;">
                        Reset My Password
                    </a>
                </div>

                <!-- Alternative Link -->
                <p style="color: #6b7280; margin: 30px 0 20px 0; font-size: 14px; line-height: 1.6;">
                    If the button doesn't work, copy and paste this link into your browser:
                </p>
                <p style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #16a34a; word-break: break-all; font-size: 14px; color: #374151; margin: 0 0 30px 0;">
                    ${resetUrl}
                </p>

                <!-- Security Notice -->
                <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 20px; margin: 30px 0;">
                    <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">
                        🔒 Security Notice
                    </h3>
                    <ul style="color: #92400e; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                        <li>This link will expire in <strong>2 hours</strong> for security reasons</li>
                        <li>If you didn't request this reset, please ignore this email</li>
                        <li>Your password will remain unchanged if you don't click the link</li>
                    </ul>
                </div>

                <p style="color: #6b7280; margin: 30px 0 0 0; font-size: 14px; line-height: 1.6;">
                    If you're having trouble with your account or didn't request this reset, please contact our support team.
                </p>
            </div>

            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
                    This email was sent by dLOOP
                </p>
                <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                    Please do not reply to this email. This mailbox is not monitored.
                </p>
            </div>
        </div>

        <!-- Footer Text -->
        <div style="text-align: center; padding: 20px;">
            <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                © 2024 dLOOP. All rights reserved.
            </p>
        </div>
    </body>
    </html>
  `;
};