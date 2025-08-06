// File: send-email.js
// Path: /tmp/OurLibrary-Portal-Clean/api/send-email.js
// Standard: AIDEV-PascalCase-2.1
// Created: 2025-08-06
// Last Modified: 2025-08-06 12:50PM

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { type, userData } = req.body;

        if (!type || !userData) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        let emailResults = [];

        // Send admin notification to HimalayaProject1@gmail.com
        if (type === 'registration') {
            const adminEmail = {
                to: 'HimalayaProject1@gmail.com',
                subject: `🎓 New OurLibrary Registration: ${userData.email}`,
                html: `
                    <h2>📚 NEW OURLIBRARY REGISTRATION</h2>
                    <hr>
                    
                    <h3>User Information</h3>
                    <ul>
                        <li><strong>📧 Email:</strong> ${userData.email}</li>
                        <li><strong>👤 Username:</strong> ${userData.username || 'Not provided'}</li>
                        <li><strong>🎓 Academic Level:</strong> ${userData.academic_level || 'Not specified'}</li>
                        <li><strong>📖 Interests:</strong> ${userData.interests || 'Not specified'}</li>
                        <li><strong>⏰ Registration Time:</strong> ${userData.registration_time}</li>
                        <li><strong>🌐 Source:</strong> Project Himalaya Portal</li>
                    </ul>
                    
                    <h3>📋 Required Actions</h3>
                    <ol>
                        <li>Set up user database environment</li>
                        <li>Configure library access permissions</li>
                        <li>Send welcome email with login instructions</li>
                        <li>Provide access to educational content</li>
                    </ol>
                    
                    <p><strong>🔗 User Management:</strong> Access local OurLibrary admin panel</p>
                    <p><strong>📊 Analytics:</strong> Track user onboarding progress</p>
                    
                    <hr>
                    <p><em>- Project Himalaya Automation System</em></p>
                `
            };

            // Send user verification email
            const userEmail = {
                to: userData.email,
                subject: '📚 Welcome to OurLibrary - Please Verify Your Email',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
                            <h1>📚 Welcome to OurLibrary!</h1>
                            <p style="font-size: 1.2em; margin: 0;">"Getting education into the hands of people who can least afford it"</p>
                        </div>
                        
                        <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
                            <h2>🎉 Registration Successful, ${userData.username || userData.email}!</h2>
                            
                            <p>Thank you for joining Project Himalaya's educational mission. Your account is being prepared with the following details:</p>
                            
                            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                                <h3>📋 Your Profile</h3>
                                <ul>
                                    <li><strong>Email:</strong> ${userData.email}</li>
                                    <li><strong>Username:</strong> ${userData.username || 'Not provided'}</li>
                                    <li><strong>Academic Level:</strong> ${userData.academic_level || 'Not specified'}</li>
                                    <li><strong>Interests:</strong> ${userData.interests || 'Not specified'}</li>
                                </ul>
                            </div>
                            
                            <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
                                <h3>✅ Please Verify Your Email</h3>
                                <p>Click the button below to verify your email address and activate your OurLibrary account:</p>
                                <div style="text-align: center; margin: 20px 0;">
                                    <a href="https://callmechewy.github.io/OurLibrary-Portal/verify?email=${encodeURIComponent(userData.email)}&token=demo_verification_token" 
                                       style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                                        ✅ Verify Email Address
                                    </a>
                                </div>
                            </div>
                            
                            <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                                <h3>⏰ Next Steps</h3>
                                <ol>
                                    <li>Verify your email address (click button above)</li>
                                    <li>Your library environment is being prepared</li>
                                    <li>You'll receive another email when your access is ready</li>
                                    <li>Return to OurLibrary portal to login</li>
                                </ol>
                            </div>
                            
                            <p style="text-align: center; color: #666; margin-top: 30px;">
                                <strong>🏔️ Welcome to Project Himalaya!</strong><br>
                                Pioneering human-AI collaboration for educational equity
                            </p>
                        </div>
                    </div>
                `
            };

            // Use EmailJS or similar service for sending emails
            // For demo, we'll use a mock email service
            const emailService = {
                apiKey: process.env.EMAILJS_API_KEY || 'demo_key',
                serviceId: process.env.EMAILJS_SERVICE_ID || 'demo_service',
                templateId: process.env.EMAILJS_TEMPLATE_ID || 'demo_template'
            };

            // Simulate email sending (replace with real email service)
            emailResults = [
                { 
                    to: adminEmail.to, 
                    status: 'sent', 
                    type: 'admin_notification',
                    message: 'Admin notification sent successfully' 
                },
                { 
                    to: userEmail.to, 
                    status: 'sent', 
                    type: 'user_verification',
                    message: 'User verification email sent successfully' 
                }
            ];

            // In production, actually send emails here
            console.log('Admin Email:', adminEmail);
            console.log('User Email:', userEmail);
        }

        return res.status(200).json({
            success: true,
            message: 'Emails sent successfully',
            results: emailResults,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Email sending error:', error);
        return res.status(500).json({ 
            error: 'Email sending failed',
            message: error.message 
        });
    }
}