// pages/api/send-form.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { formType, ...formData } = req.body;

  // Generate email content based on form type
  const generateEmailContent = (type, data) => {
    const baseStyle = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f0f9ff;">
        <div style="background-color: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border: 1px solid #e0f2fe;">
    `;
    
    const endStyle = `
        </div>
      </div>
    `;

    const formTitles = {
      turkey: 'Turkey Residence Permit Application',
      albania: 'Albania Application',
      dubai: 'Dubai Application', 
      china: 'China Application',
      kazakhstan: 'Kazakhstan Application'
    };

    const formColors = {
      turkey: '#0ea5e9',
      albania: '#ef4444',
      dubai: '#f59e0b',
      china: '#dc2626',
      kazakhstan: '#10b981'
    };

    const color = formColors[type] || '#0ea5e9';

    let content = `${baseStyle}
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, ${color}, ${color}aa); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
          <span style="color: white; font-size: 24px;">🛡️</span>
        </div>
        <h2 style="color: #1e293b; margin: 0; font-size: 24px; font-weight: bold;">
          ${formTitles[type]}
        </h2>
        <p style="color: #64748b; margin: 5px 0 0 0; font-size: 14px;">
          New consultation request received
        </p>
      </div>
      
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #334155; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
          Contact Information
        </h3>
    `;

    // Add form data to email
    const fieldLabels = {
      name: 'Full Name',
      phone: 'Phone Number',
      email: 'Email Address'
    };

    Object.entries(data).forEach(([key, value]) => {
      if (value && fieldLabels[key]) {
        content += `
          <div style="margin-bottom: 12px; padding: 12px; background-color: white; border-radius: 6px; border-left: 4px solid ${color};">
            <strong style="color: #475569; display: block; margin-bottom: 4px; font-size: 14px;">
              ${fieldLabels[key]}:
            </strong>
            <span style="color: #1e293b; font-size: 16px;">${value}</span>
          </div>
        `;
      }
    });

    content += `
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
        <p style="color: #64748b; margin: 0; font-size: 12px;">
          This email was sent from your ${formTitles[type]} consultation form
        </p>
        <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 12px;">
          Received on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
        </p>
      </div>
      
      ${endStyle}
    `;
    
    return content;
  };

  const emailConfig = {
    turkey: {
      subject: '🇹🇷 New Turkey Residence Permit Consultation Request',
      html: generateEmailContent('turkey', formData)
    },
    albania: {
      subject: '🇦🇱 New Albania Consultation Request',
      html: generateEmailContent('albania', formData)
    },
    dubai: {
      subject: '🇦🇪 New Dubai Consultation Request',
      html: generateEmailContent('dubai', formData)
    },
    china: {
      subject: '🇨🇳 New China Consultation Request',
      html: generateEmailContent('china', formData)
    },
    kazakhstan: {
      subject: '🇰🇿 New Kazakhstan Consultation Request',
      html: generateEmailContent('kazakhstan', formData)
    }
  };

  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Replace with your verified domain
      to: ['info@jobsadmire.com'], // Replace with your email
      subject: emailConfig[formType].subject,
      html: emailConfig[formType].html,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}