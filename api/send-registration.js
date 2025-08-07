// Netlify Function for OurLibrary Registration Email Sending
const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    const { user_email, username, academic_level, interests, password } = JSON.parse(event.body);
    
    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // HimalayaProject1@gmail.com
        pass: process.env.GMAIL_APP_PASSWORD // svah cggw kvcp pdck
      }
    });

    const verificationToken = `verify_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const verificationUrl = `https://callmechewy.github.io/OurLibrary-Portal/verify.html?email=${encodeURIComponent(user_email)}&token=${verificationToken}`;
    
    // Send verification email to user
    const userEmailResult = await transporter.sendMail({
      from: '"OurLibrary Team" <HimalayaProject1@gmail.com>',
      to: user_email,
      subject: '🎓 Welcome to OurLibrary - Verify Your Account',
      html: `
        <h2>🎓 Welcome to OurLibrary!</h2>
        <p>Dear ${username || 'Student'},</p>
        <p>Thank you for joining Project Himalaya's educational library platform.</p>
        <p><strong>Click here to verify your account:</strong></p>
        <p><a href="${verificationUrl}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; display: inline-block;">✅ Verify My Account</a></p>
        <p>Or copy this link: ${verificationUrl}</p>
        <p>Welcome to our mission: "Getting education into the hands of people who can least afford it"</p>
        <p>Best regards,<br>The OurLibrary Team</p>
      `
    });

    // Send admin notification
    const adminEmailResult = await transporter.sendMail({
      from: '"OurLibrary System" <HimalayaProject1@gmail.com>',
      to: 'HimalayaProject1@gmail.com',
      subject: `🎓 New OurLibrary Registration: ${user_email}`,
      html: `
        <h2>📚 NEW OURLIBRARY REGISTRATION</h2>
        <p><strong>Registration Details:</strong></p>
        <ul>
          <li>📧 Email: ${user_email}</li>
          <li>👤 Username: ${username || 'Not provided'}</li>
          <li>🎓 Academic Level: ${academic_level || 'Not specified'}</li>
          <li>📖 Interests: ${interests || 'Not specified'}</li>
          <li>⏰ Registration Time: ${new Date().toISOString()}</li>
          <li>🌐 Source: Project Himalaya Portal - Live Test</li>
        </ul>
        <p><strong>📋 REQUIRED ACTIONS:</strong></p>
        <ol>
          <li>Verification email sent to: ${user_email}</li>
          <li>Set up user database environment</li>
          <li>Configure library access permissions</li>
        </ol>
        <p><strong>Verification URL:</strong> ${verificationUrl}</p>
      `
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        message: 'Registration emails sent successfully',
        user_email_sent: userEmailResult.accepted.length > 0,
        admin_email_sent: adminEmailResult.accepted.length > 0,
        verification_url: verificationUrl
      })
    };

  } catch (error) {
    console.error('Email sending error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};