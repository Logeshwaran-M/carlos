import admin from 'firebase-admin';
import nodemailer from 'nodemailer';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Generate the password reset link via Firebase Admin
    const firebaseLink = await admin.auth().generatePasswordResetLink(email, {
      url: `${process.env.FRONTEND_URL || 'http://localhost:5174'}/login`,
    });

    // Extract the oobCode from the firebaseLink
    const urlObj = new URL(firebaseLink);
    const oobCode = urlObj.searchParams.get('oobCode');
    
    // Construct a DIRECT link to your custom reset-password page
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5174'}/reset-password?oobCode=${oobCode}`;

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: `"Carlos Cake" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; padding: 12px; background-color: #ecfdf5; border-radius: 12px;">
              <span style="font-size: 24px; font-weight: 900; color: #db2777; letter-spacing: -0.025em;">CARLOS CAKE</span>
            </div>
          </div>
          
          <h2 style="color: #111827; font-size: 24px; font-weight: 800; text-align: center; margin-bottom: 8px;">Reset your password</h2>
          <p style="color: #4b5563; font-size: 16px; text-align: center; margin-bottom: 32px;">No worries! It happens. Click the button below to securely reset your password.</p>
          
          <div style="text-align: center; margin-bottom: 32px;">
            <a href="${resetLink}" style="background-color: #db2777; color: #ffffff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block; transition: background-color 0.2s;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; text-align: center; margin-bottom: 16px;">
            This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.
          </p>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 24px; margin-top: 24px; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} Carlos Cake. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Reset email sent successfully!' });
  } catch (error) {
    console.error('Password reset function error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
