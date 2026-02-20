// pages/api/send-visa-application.js (for Next.js)
// or create this as a separate API endpoint in your backend

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) { 
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { applicationData, selectedPackage, submissionDate } = req.body;

    // Format the email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Visa Application Submission</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0ea5e9, #2563eb); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
          .section { background: white; margin: 20px 0; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .label { font-weight: bold; color: #475569; display: inline-block; width: 150px; }
          .value { color: #1e293b; }
          .package-info { background: #e0f2fe; border-left: 4px solid #0ea5e9; padding: 15px; margin: 15px 0; }
          .document-info { background: #f0f9ff; border: 1px solid #bae6fd; padding: 15px; margin: 10px 0; border-radius: 6px; }
          .traveler-card { background: #f1f5f9; border: 1px solid #cbd5e1; padding: 15px; margin: 10px 0; border-radius: 6px; }
          .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🛂 New Visa Application Submission</h1>
            <p>Application ID: ${applicationData.applicationId}</p>
          </div>
          
          <div class="content">
            <div class="package-info">
              <h3>📋 Package Information</h3>
              <p><span class="label">Package Type:</span> <span class="value">${selectedPackage?.type || 'N/A'}</span></p>
              <p><span class="label">Destination:</span> <span class="value">${selectedPackage?.destination || 'N/A'}</span></p>
              <p><span class="label">Price:</span> <span class="value">$${selectedPackage?.price || 'N/A'} USD</span></p>
              <p><span class="label">Processing:</span> <span class="value">${selectedPackage?.processing || 'N/A'}</span></p>
            </div>

            <div class="section">
              <h3>👤 Personal Information</h3>
              <p><span class="label">Full Name:</span> <span class="value">${applicationData.firstName} ${applicationData.lastName}</span></p>
              <p><span class="label">Email:</span> <span class="value">${applicationData.email}</span></p>
              <p><span class="label">Phone:</span> <span class="value">${applicationData.phoneNumber}</span></p>
              <p><span class="label">Profession:</span> <span class="value">${applicationData.profession}</span></p>
              <p><span class="label">Passport Number:</span> <span class="value">${applicationData.passportNumber}</span></p>
            </div>

            <div class="section">
              <h3>🌍 Travel Information</h3>
              <p><span class="label">From Country:</span> <span class="value">${applicationData.fromCountry}</span></p>
              <p><span class="label">Residence:</span> <span class="value">${applicationData.toCountry}</span></p>
              <p><span class="label">Travel Date:</span> <span class="value">${applicationData.travelDate}</span></p>
              <p><span class="label">Return Date:</span> <span class="value">${applicationData.travelToDate}</span></p>
              <p><span class="label">Travel Purpose:</span> <span class="value">${applicationData.travelPurpose}</span></p>
              <p><span class="label">Number of Travelers:</span> <span class="value">${applicationData.numberOfTravelers}</span></p>
            </div>

            ${applicationData.numberOfTravelers > 1 ? `
            <div class="section">
              <h3>👥 Additional Travelers</h3>
              ${applicationData.travelers.slice(1).map((traveler, index) => `
                <div class="traveler-card">
                  <h4>Traveler ${index + 2}</h4>
                  <p><span class="label">Name:</span> <span class="value">${traveler.name || 'Not provided'}</span></p>
                  <p><span class="label">Phone:</span> <span class="value">${traveler.phoneNumber || 'Not provided'}</span></p>
                </div>
              `).join('')}
            </div>
            ` : ''}

            <div class="section">
              <h3>📄 Documents</h3>
              <div class="document-info">
                <p><span class="label">Passport Document:</span> <span class="value">${applicationData.passportDocument?.name || 'Not uploaded'}</span></p>
                ${applicationData.passportDocument ? `<p><span class="label">File Size:</span> <span class="value">${Math.round(applicationData.passportDocument.size / 1024)} KB</span></p>` : ''}
              </div>
              <div class="document-info">
                <p><span class="label">Picture/Headshot:</span> <span class="value">${applicationData.pictureHeadshot?.name || 'Not uploaded'}</span></p>
                ${applicationData.pictureHeadshot ? `<p><span class="label">File Size:</span> <span class="value">${Math.round(applicationData.pictureHeadshot.size / 1024)} KB</span></p>` : ''}
              </div>
            </div>

            <div class="section">
              <h3>✅ Confirmations</h3>
              <p><span class="label">Valid Passport:</span> <span class="value">${applicationData.hasValidPassport ? '✅ Confirmed' : '❌ Not confirmed'}</span></p>
              <p><span class="label">Picture Available:</span> <span class="value">${applicationData.hasPictureHeadshot ? '✅ Confirmed' : '❌ Not confirmed'}</span></p>
              <p><span class="label">No Active Application:</span> <span class="value">${applicationData.confirmNoActiveApplication ? '✅ Confirmed' : '❌ Not confirmed'}</span></p>
              <p><span class="label">Government Discretion:</span> <span class="value">${applicationData.confirmGovernmentDiscretion ? '✅ Acknowledged' : '❌ Not acknowledged'}</span></p>
            </div>

            <div class="section">
              <h3>📅 Submission Details</h3>
              <p><span class="label">Submitted:</span> <span class="value">${new Date(submissionDate).toLocaleString()}</span></p>
              <p><span class="label">Application ID:</span> <span class="value">${applicationData.applicationId}</span></p>
            </div>

            <div class="footer">
              <p>This application was submitted through the Visa Application Portal</p>
              <p>Please process this application according to your standard procedures.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Prepare attachments
    const attachments = [];
    
    if (applicationData.passportDocument) {
      attachments.push({
        filename: applicationData.passportDocument.name,
        content: applicationData.passportDocument.data.split(',')[1], // Remove data:mime;base64, prefix
        encoding: 'base64'
      });
    }
    
    if (applicationData.pictureHeadshot) {
      attachments.push({
        filename: applicationData.pictureHeadshot.name,
        content: applicationData.pictureHeadshot.data.split(',')[1], // Remove data:mime;base64, prefix
        encoding: 'base64'
      });
    }

    // Send email using Resend
    const data = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev', // Replace with your verified domain
      to: [process.env.TO_EMAIL || 'info@jobsadmire.com'], // Replace with recipient email
      cc: [applicationData.email], // Send copy to applicant
      subject: `New Visa Application - ${applicationData.firstName} ${applicationData.lastName} - ID: ${applicationData.applicationId}`,
      html: emailHtml,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    // Send confirmation email to applicant
    const confirmationHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Visa Application Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0ea5e9, #2563eb); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
          .success-box { background: #dcfce7; border: 1px solid #16a34a; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .info-box { background: #e0f2fe; border-left: 4px solid #0ea5e9; padding: 15px; margin: 15px 0; }
          .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Application Submitted Successfully!</h1>
            <p>Thank you, ${applicationData.firstName}!</p>
          </div>
          
          <div class="content">
            <div class="success-box">
              <h2>🎉 Your visa application has been received!</h2>
              <p><strong>Application ID: ${applicationData.applicationId}</strong></p>
              <p>Please save this ID for future reference.</p>
            </div>

            <div class="info-box">
              <h3>📋 Application Summary</h3>
              <p><strong>Package:</strong> ${selectedPackage?.type || 'N/A'}</p>
              <p><strong>Destination:</strong> ${selectedPackage?.destination || 'N/A'}</p>
              <p><strong>Submitted:</strong> ${new Date(submissionDate).toLocaleString()}</p>
            </div>

            <div class="info-box">
              <h3>⏰ What's Next?</h3>
              <p>• Our team will review your application within 24-48 hours</p>
              <p>• You will receive updates via email at ${applicationData.email}</p>
              <p>• Processing time: ${selectedPackage?.processing || 'Standard processing time applies'}</p>
              <p>• If additional documents are needed, we will contact you</p>
            </div>

            <div class="info-box">
              <h3>📞 Need Help?</h3>
              <p>If you have any questions about your application, please contact us:</p>
              <p>📧 Email: support@yourdomain.com</p>
              <p>📱 Phone: +1 (555) 123-4567</p>
              <p>🆔 Reference your Application ID: ${applicationData.applicationId}</p>
            </div>

            <div class="footer">
              <p>Thank you for choosing our visa services!</p>
              <p>This is an automated confirmation email.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send confirmation to applicant
    await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@yourdomain.com',
      to: [applicationData.email],
      subject: `Visa Application Confirmation - ID: ${applicationData.applicationId}`,
      html: confirmationHtml,
    });

    res.status(200).json({ 
      success: true, 
      message: 'Application submitted successfully',
      applicationId: applicationData.applicationId,
      emailId: data.id 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit application',
      error: error.message 
    });
  }
}

// For Express.js, use this format instead:
/*
const express = require('express');
const { Resend } = require('resend');
const router = express.Router();

const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/send-visa-application', async (req, res) => {
  // Same logic as above
});

module.exports = router;
*/