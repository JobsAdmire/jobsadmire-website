// pages/api/send-form-email.js or app/api/send-form-email/route.js (depending on your Next.js version)

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { 
      name, 
      country, 
      personalPhone, 
      whatsappPhone, 
      email, 
      serviceType,
      personalCountryCode,
      whatsappCountryCode,
      isWhatsAppSame 
    } = req.body;

    // Validate required fields
    if (!name || !country || !personalPhone || !email || !serviceType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Prepare service type display name
    const serviceDisplayNames = {
      study: 'Study Abroad',
      work: 'Work Overseas',
      migrate: 'Migration',
      visit: 'Visit & Explore (Visa Invitation)'
    };

    const serviceDisplayName = serviceDisplayNames[serviceType] || serviceType;

    // Prepare WhatsApp number display
    const whatsappDisplay = isWhatsAppSame 
      ? `${personalCountryCode} ${personalPhone} (Same as personal)` 
      : `${whatsappCountryCode} ${whatsappPhone}`;

    // Email template for admin
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
        <div style="background-color: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0369a1; margin: 0; font-size: 28px;">New Service Inquiry</h1>
            <div style="width: 60px; height: 4px; background: linear-gradient(to right, #0ea5e9, #3b82f6); margin: 15px auto; border-radius: 2px;"></div>
          </div>
          
          <div style="background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="color: #0c4a6e; margin: 0 0 10px 0; font-size: 22px;">Service Request: ${serviceDisplayName}</h2>
            <p style="color: #075985; margin: 0; font-size: 16px;">A new inquiry has been submitted through your website.</p>
          </div>

          <div style="background-color: #f8fafc; padding: 25px; border-radius: 8px; border-left: 4px solid #0ea5e9;">
            <h3 style="color: #374151; margin: 0 0 20px 0; font-size: 18px;">Contact Information</h3>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #4b5563;">Full Name:</strong>
              <div style="color: #1f2937; font-size: 16px; margin-top: 5px;">${name}</div>
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #4b5563;">Destination Country:</strong>
              <div style="color: #1f2937; font-size: 16px; margin-top: 5px;">${country}</div>
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #4b5563;">Email Address:</strong>
              <div style="color: #1f2937; font-size: 16px; margin-top: 5px;">
                <a href="mailto:${email}" style="color: #0ea5e9; text-decoration: none;">${email}</a>
              </div>
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #4b5563;">Personal Mobile:</strong>
              <div style="color: #1f2937; font-size: 16px; margin-top: 5px;">
                <a href="tel:${personalCountryCode}${personalPhone}" style="color: #0ea5e9; text-decoration: none;">
                  ${personalCountryCode} ${personalPhone}
                </a>
              </div>
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #4b5563;">WhatsApp Number:</strong>
              <div style="color: #1f2937; font-size: 16px; margin-top: 5px;">
                <a href="https://wa.me/${whatsappDisplay.replace(/[^0-9]/g, '')}" style="color: #25d366; text-decoration: none;">
                  ${whatsappDisplay}
                </a>
              </div>
            </div>
          </div>

          <div style="margin-top: 25px; padding: 20px; background-color: #ecfdf5; border-radius: 8px; border: 1px solid #d1fae5;">
            <h3 style="color: #065f46; margin: 0 0 10px 0; font-size: 16px;">Next Steps</h3>
            <p style="color: #047857; margin: 0; font-size: 14px;">
              Contact the client within 24 hours to discuss their ${serviceDisplayName.toLowerCase()} requirements and schedule a consultation.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; margin: 0; font-size: 12px;">
              Submitted on ${new Date().toLocaleString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </div>
    `;

    // Email template for client confirmation
    const clientEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
        <div style="background-color: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0369a1; margin: 0; font-size: 28px;">Thank You for Your Interest!</h1>
            <div style="width: 60px; height: 4px; background: linear-gradient(to right, #0ea5e9, #3b82f6); margin: 15px auto; border-radius: 2px;"></div>
          </div>
          
          <div style="text-align: center; margin-bottom: 25px;">
            <div style="font-size: 48px; margin-bottom: 15px;">🎉</div>
            <h2 style="color: #1f2937; margin: 0; font-size: 22px;">We've Received Your Application</h2>
          </div>

          <div style="background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); padding: 25px; border-radius: 8px; margin-bottom: 25px;">
            <p style="color: #0c4a6e; margin: 0; font-size: 16px; line-height: 1.6;">
              Dear <strong>${name}</strong>,<br><br>
              Thank you for your interest in our <strong>${serviceDisplayName}</strong> services for <strong>${country}</strong>. 
              We have successfully received your application and our team is reviewing your information.
            </p>
          </div>

          <div style="background-color: #f8fafc; padding: 25px; border-radius: 8px; border-left: 4px solid #10b981;">
            <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">What Happens Next?</h3>
            <div style="color: #4b5563; line-height: 1.6;">
              <p style="margin: 0 0 12px 0;">✅ Our expert consultants will review your application</p>
              <p style="margin: 0 0 12px 0;">📞 We'll contact you within 24 hours to discuss your requirements</p>
              <p style="margin: 0 0 12px 0;">📋 We'll provide you with a personalized consultation</p>
              <p style="margin: 0;">🎯 Together, we'll create a plan to achieve your goals</p>
            </div>
          </div>

          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border: 1px solid #fbbf24; margin: 25px 0;">
            <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">💡 Pro Tip</h3>
            <p style="color: #b45309; margin: 0; font-size: 14px;">
              While you wait, feel free to gather any relevant documents you might have. 
              Our consultant will guide you on what specific documents you'll need for your ${serviceDisplayName.toLowerCase()} process.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #4b5563; margin: 0 0 15px 0; font-size: 16px;">
              Have questions? We're here to help!
            </p>
            <a href="/contact-us" style="display: inline-block; background: linear-gradient(135deg, #0ea5e9, #3b82f6); color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              Contact Our Support Team
            </a>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; margin: 0; font-size: 12px;">
              This is an automated confirmation email. Please do not reply to this email.
            </p>
          </div>
        </div>
      </div>
    `;

    // Send email to admin
    const adminEmail = await resend.emails.send({
      from: 'noreply@yourdomain.com', // Replace with your verified domain
      to: ['info@jobsadmire.com'], // Replace with your admin email
      subject: `New ${serviceDisplayName} Inquiry from ${name}`,
      html: adminEmailHtml,
    });

    // Send confirmation email to client
    const clientEmail = await resend.emails.send({
      from: 'noreply@yourdomain.com', // Replace with your verified domain
      to: [email],
      subject: `Thank you for your ${serviceDisplayName} inquiry - We'll be in touch soon!`,
      html: clientEmailHtml,
    });

    return res.status(200).json({ 
      message: 'Emails sent successfully',
      adminEmailId: adminEmail.data?.id,
      clientEmailId: clientEmail.data?.id
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ 
      message: 'Failed to send emails',
      error: error.message 
    });
  }
}

// For App Router (Next.js 13+), use this format instead:
/*
export async function POST(request) {
  try {
    const body = await request.json();
    // ... same logic as above
    return Response.json({ message: 'Emails sent successfully' });
  } catch (error) {
    return Response.json({ message: 'Failed to send emails' }, { status: 500 });
  }
}
*/