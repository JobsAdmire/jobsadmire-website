import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    const { serviceType, formData } = req.body;

    // Validate required data
    if (!formData || !formData.name || !formData.email) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    console.log('Sending email with Resend...');

    // Generate email content
    const emailContent = generateServiceEmailTemplate(serviceType, formData);
    const subject = getEmailSubject(serviceType, formData.name);
    
    // Send email using Resend
    const { data, error } = await resend.emails.send({
        from: 'Jobs Admire <onboarding@resend.dev>',
      to: [process.env.RECIPIENT_EMAIL],
      subject: subject,
      html: emailContent,
    });

    if (error) {
      console.error('Resend error:', error);
      throw error;
    }

    console.log('Email sent successfully:', data);

    res.status(200).json({
      success: true,
      message: 'Request submitted successfully! We will contact you soon.',
      emailId: data.id
    });

  } catch (error) {
    console.error('Email sending failed:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to submit request. Please try again.',
      error: error.message
    });
  }
}

// Generate email subject based on service type
function getEmailSubject(serviceType, name) {
  const subjects = {
    work: `💼 New Work Overseas Request - ${name}`,
    migrate: `🏠 New Migration Request - ${name}`,
    visit: `✈️ New Visit & Explore Request - ${name}`
  };
  
  return subjects[serviceType] || `📝 New Service Request - ${name}`;
}

// Generate beautiful email template
function generateServiceEmailTemplate(serviceType, data) {
  const serviceConfig = {
    work: {
      title: 'Work Overseas Request',
      icon: '💼',
      color: '#06b6d4',
      description: 'Build career with global opportunities'
    },
    migrate: {
      title: 'Migration Request',
      icon: '🏠',
      color: '#3b82f6',
      description: 'Start a new life abroad with family'
    },
    visit: {
      title: 'Visit & Explore Request',
      icon: '✈️',
      color: '#0ea5e9',
      description: 'Discover amazing destinations worldwide'
    }
  };

  const config = serviceConfig[serviceType] || serviceConfig.migrate;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${config.title}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background: #f8fafc;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, ${config.color}, #1e40af); padding: 40px 30px; text-align: center; border-radius: 15px 15px 0 0;">
          <div style="font-size: 64px; margin-bottom: 15px; line-height: 1;">${config.icon}</div>
          <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold; margin-bottom: 8px;">${config.title}</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 18px;">${config.description}</p>
        </div>
        
        <!-- Content -->
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Alert Banner -->
          <div style="background: linear-gradient(135deg, #fef2f2, #fee2e2); border: 2px solid #ef4444; border-radius: 12px; padding: 20px; margin-bottom: 30px; text-align: center;">
            <div style="font-size: 24px; margin-bottom: 8px;">🚨</div>
            <h2 style="color: #dc2626; margin: 0; font-size: 18px; font-weight: bold;">
              NEW CLIENT REQUEST - IMMEDIATE ACTION REQUIRED
            </h2>
            <p style="color: #b91c1c; margin: 8px 0 0 0; font-size: 14px;">
              Contact within 24 hours for best conversion rate
            </p>
          </div>

          <!-- Personal Information Section -->
          <div style="background: linear-gradient(135deg, #f1f5f9, #e2e8f0); padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid ${config.color};">
            <h3 style="color: #1e293b; margin-top: 0; font-size: 20px; display: flex; align-items: center; margin-bottom: 20px;">
              <span style="margin-right: 12px; font-size: 24px;">👤</span>
              Personal Information
            </h3>
            <div style="display: grid; gap: 12px;">
              <div style="background: white; padding: 15px; border-radius: 8px; border-left: 3px solid ${config.color};">
                <strong style="color: #374151; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Full Name</strong>
                <p style="margin: 5px 0 0 0; color: #111827; font-size: 16px; font-weight: 600;">${data.name}</p>
              </div>
              <div style="background: white; padding: 15px; border-radius: 8px; border-left: 3px solid ${config.color};">
                <strong style="color: #374151; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Destination Country</strong>
                <p style="margin: 5px 0 0 0; color: #111827; font-size: 16px; font-weight: 600;">${data.country || 'Not specified'}</p>
              </div>
              <div style="background: white; padding: 15px; border-radius: 8px; border-left: 3px solid ${config.color};">
                <strong style="color: #374151; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Email Address</strong>
                <p style="margin: 5px 0 0 0; color: #111827; font-size: 16px; font-weight: 600;">
                  <a href="mailto:${data.email}" style="color: ${config.color}; text-decoration: none;">${data.email}</a>
                </p>
              </div>
            </div>
          </div>

          <!-- Contact Information Section -->
          <div style="background: linear-gradient(135deg, #ecfdf5, #d1fae5); padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #10b981;">
            <h3 style="color: #065f46; margin-top: 0; font-size: 20px; display: flex; align-items: center; margin-bottom: 20px;">
              <span style="margin-right: 12px; font-size: 24px;">📱</span>
              Contact Information
            </h3>
            <div style="display: grid; gap: 12px;">
              <div style="background: white; padding: 15px; border-radius: 8px; border-left: 3px solid #10b981;">
                <strong style="color: #065f46; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Personal Mobile</strong>
                <p style="margin: 5px 0 0 0; color: #111827; font-size: 16px; font-weight: 600;">
                  <a href="tel:${data.personalPhone}" style="color: #10b981; text-decoration: none;">${data.personalPhone}</a>
                </p>
              </div>
              <div style="background: white; padding: 15px; border-radius: 8px; border-left: 3px solid #10b981;">
                <strong style="color: #065f46; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">WhatsApp Number</strong>
                <p style="margin: 5px 0 0 0; color: #111827; font-size: 16px; font-weight: 600;">
                  ${data.isWhatsAppSame ? 
                    `<span style="color: #059669;">Same as personal mobile ✅</span>` :
                    `<a href="https://wa.me/${data.whatsappPhone}" style="color: #10b981; text-decoration: none;">${data.whatsappPhone || 'Not provided'}</a>`
                  }
                </p>
              </div>
            </div>
          </div>

          <!-- Service Details Section -->
          <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #f59e0b;">
            <h3 style="color: #92400e; margin-top: 0; font-size: 20px; display: flex; align-items: center; margin-bottom: 20px;">
              <span style="margin-right: 12px; font-size: 24px;">🎯</span>
              Service Details
            </h3>
            <div style="display: grid; gap: 12px;">
              <div style="background: white; padding: 15px; border-radius: 8px; border-left: 3px solid #f59e0b;">
                <strong style="color: #92400e; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Service Type</strong>
                <p style="margin: 5px 0 0 0; color: #111827; font-size: 16px; font-weight: 600;">${config.title}</p>
              </div>
              <div style="background: white; padding: 15px; border-radius: 8px; border-left: 3px solid #f59e0b;">
                <strong style="color: #92400e; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Terms Accepted</strong>
                <p style="margin: 5px 0 0 0; color: #111827; font-size: 16px; font-weight: 600;">
                  ${data.acceptTerms ? 
                    '<span style="color: #059669;">Yes ✅</span>' : 
                    '<span style="color: #dc2626;">No ❌</span>'
                  }
                </p>
              </div>
            </div>
          </div>

          <!-- Next Steps Section -->
          <div style="background: linear-gradient(135deg, #e0e7ff, #c7d2fe); padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #6366f1;">
            <h3 style="color: #3730a3; margin-top: 0; font-size: 20px; display: flex; align-items: center; margin-bottom: 20px;">
              <span style="margin-right: 12px; font-size: 24px;">⚡</span>
              Recommended Next Steps
            </h3>
            <div style="color: #4338ca; line-height: 1.6;">
              <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 3px solid #6366f1;">
                <strong>1. Immediate Contact</strong> - Call within 2 hours for best results
              </div>
              <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 3px solid #6366f1;">
                <strong>2. Needs Assessment</strong> - Understand their specific requirements
              </div>
              <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 3px solid #6366f1;">
                <strong>3. Service Proposal</strong> - Send customized service options
              </div>
              <div style="background: white; padding: 15px; border-radius: 8px; border-left: 3px solid #6366f1;">
                <strong>4. Follow-up</strong> - Schedule consultation within 48 hours
              </div>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px;">
            <a href="tel:${data.personalPhone}" style="display: block; background: linear-gradient(135deg, #059669, #047857); color: white; padding: 15px; text-align: center; text-decoration: none; border-radius: 8px; font-weight: bold;">
              📞 Call Now
            </a>
            <a href="mailto:${data.email}" style="display: block; background: linear-gradient(135deg, ${config.color}, #1e40af); color: white; padding: 15px; text-align: center; text-decoration: none; border-radius: 8px; font-weight: bold;">
              ✉️ Send Email
            </a>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 25px; background: #f8fafc; border-radius: 12px; color: #64748b; border: 2px dashed #cbd5e1;">
            <div style="font-size: 18px; margin-bottom: 10px;">📅</div>
            <p style="margin: 0; font-size: 16px; font-weight: 600; color: #374151;">
              <strong>Submitted:</strong> ${new Date().toLocaleString()}
            </p>
            <p style="margin: 8px 0 0 0; font-size: 14px;">
              🌐 <strong>Source:</strong> Website Contact Form
            </p>
          </div>

        </div>
      </div>
    </body>
    </html>
  `;
}