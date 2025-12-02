import { Resend } from 'resend';

// Initialize Resend with key (or a dummy value if missing during dev to prevent crash)
const resend = new Resend(process.env.RESEND_API_KEY || 're_123');

export class EmailService {
  static async sendWelcomeEmail(email: string, name: string) {
    if (!process.env.RESEND_API_KEY) {
      console.log('⚠️ RESEND_API_KEY missing. Skipped sending welcome email to:', email);
      return;
    }

    try {
      await resend.emails.send({
        from: 'AcademOra <onboarding@resend.dev>', // Use resend.dev for testing, or your domain in prod
        to: email,
        subject: 'Welcome to AcademOra! 🎓',
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h1>Welcome, ${name}!</h1>
            <p>We are thrilled to have you on board. AcademOra is designed to help you find your dream university with data-driven insights.</p>
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>Complete your <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard/profile">Profile</a> to get better matches.</li>
              <li>Explore our <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/search">University Database</a>.</li>
            </ul>
            <p>Cheers,<br/>The AcademOra Team</p>
          </div>
        `
      });
      console.log(`📧 Welcome email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }
  }

  static async sendNotification(email: string, title: string, body: string) {
    if (!process.env.RESEND_API_KEY) return;

    try {
      await resend.emails.send({
        from: 'AcademOra <notifications@resend.dev>',
        to: email,
        subject: title,
        html: `<p>${body}</p>`
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }
}
