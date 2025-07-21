const nodemailer = require('nodemailer');

// Email service configuration
const createTransporter = () => {
  if (process.env.RESEND_API_KEY) {
    // Using Resend SMTP
    return nodemailer.createTransporter({
      host: 'smtp.resend.com',
      port: 587,
      secure: false,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY
      }
    });
  } else if (process.env.SENDGRID_API_KEY) {
    // Using SendGrid SMTP
    return nodemailer.createTransporter({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
  } else {
    // Fallback to Gmail (for development)
    console.warn('No email service configured. Using Gmail fallback.');
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
};

// Send booking notification email
const sendBookingNotification = async (booking) => {
  try {
    const transporter = createTransporter();
    
    // Calculate nights
    const checkIn = new Date(booking.check_in_date);
    const checkOut = new Date(booking.check_out_date);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    // Format dates
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Booking Notification</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #d97706, #f59e0b); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none; }
            .booking-details { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-label { font-weight: bold; color: #374151; }
            .detail-value { color: #6b7280; }
            .highlight { background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0; }
            .button { display: inline-block; background: #d97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 5px; }
            .urgent { color: #dc2626; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏨 New Booking Alert</h1>
              <p>ACK Mt. Kenya Guest House</p>
            </div>
            
            <div class="content">
              <div class="highlight">
                <p class="urgent">⚠️ URGENT: New booking requires immediate attention!</p>
                <p>A new booking has been submitted and is awaiting confirmation.</p>
              </div>

              <h2>📋 Booking Details</h2>
              <div class="booking-details">
                <div class="detail-row">
                  <span class="detail-label">Booking ID:</span>
                  <span class="detail-value">#${booking._id.toString().substring(0, 8)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Status:</span>
                  <span class="detail-value" style="color: #f59e0b; font-weight: bold;">PENDING CONFIRMATION</span>
                </div>
              </div>

              <h2>👤 Guest Information</h2>
              <div class="booking-details">
                <div class="detail-row">
                  <span class="detail-label">Name:</span>
                  <span class="detail-value">${booking.guest_name}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email:</span>
                  <span class="detail-value">
                    <a href="mailto:${booking.guest_email}" style="color: #2563eb;">${booking.guest_email}</a>
                  </span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Phone:</span>
                  <span class="detail-value">
                    <a href="tel:${booking.guest_phone}" style="color: #2563eb;">${booking.guest_phone}</a>
                  </span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Number of Guests:</span>
                  <span class="detail-value">${booking.number_of_guests}</span>
                </div>
              </div>

              <h2>🏠 Accommodation Details</h2>
              <div class="booking-details">
                <div class="detail-row">
                  <span class="detail-label">Room Type:</span>
                  <span class="detail-value">${booking.room.name}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Meal Plan:</span>
                  <span class="detail-value">${booking.meal_plan.replace('_', ' ').toUpperCase()}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Check-in Date:</span>
                  <span class="detail-value">${formatDate(booking.check_in_date)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Check-out Date:</span>
                  <span class="detail-value">${formatDate(booking.check_out_date)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Number of Nights:</span>
                  <span class="detail-value">${nights}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Total Amount:</span>
                  <span class="detail-value" style="font-size: 18px; font-weight: bold; color: #059669;">
                    KSh ${booking.total_amount.toLocaleString()}
                  </span>
                </div>
              </div>

              ${booking.special_requests ? `
                <h2>📝 Special Requests</h2>
                <div class="booking-details">
                  <p style="margin: 0; font-style: italic;">"${booking.special_requests}"</p>
                </div>
              ` : ''}

              <h2>🚀 Quick Actions</h2>
              <div style="text-align: center; margin: 30px 0;">
                <a href="tel:${booking.guest_phone}" class="button">📞 Call Guest</a>
                <a href="mailto:${booking.guest_email}?subject=Booking Confirmation - ACK Mt. Kenya Guest House" class="button">✉️ Send Confirmation</a>
                <a href="https://wa.me/${booking.guest_phone.replace(/[^0-9]/g, '')}?text=Hello ${booking.guest_name}, thank you for your booking at ACK Mt. Kenya Guest House." class="button">💬 WhatsApp</a>
              </div>
            </div>

            <div class="footer">
              <p><strong>ACK Mt. Kenya Guest House</strong></p>
              <p>Nyeri, Kenya | +254 720 577 442 | ackguesthsenyeri025@gmail.com</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_USER || 'bookings@ackguesthouse.com',
      to: process.env.ADMIN_EMAIL,
      subject: `🚨 New Booking Alert - ${booking.guest_name} (${booking.room.name})`,
      html: emailHtml,
      text: `
New Booking Alert - ACK Mt. Kenya Guest House

Booking ID: ${booking._id.toString().substring(0, 8)}
Guest: ${booking.guest_name}
Email: ${booking.guest_email}
Phone: ${booking.guest_phone}
Room: ${booking.room.name}
Check-in: ${formatDate(booking.check_in_date)}
Check-out: ${formatDate(booking.check_out_date)}
Guests: ${booking.number_of_guests}
Nights: ${nights}
Total: KSh ${booking.total_amount.toLocaleString()}
${booking.special_requests ? `Special Requests: ${booking.special_requests}` : ''}

Please contact the guest to confirm this booking.
      `.trim()
    };

    await transporter.sendMail(mailOptions);
    console.log('Booking notification email sent successfully');
  } catch (error) {
    console.error('Error sending booking notification email:', error);
    throw error;
  }
};

// Send contact form notification
const sendContactNotification = async (contact) => {
  try {
    const transporter = createTransporter();

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Contact Form Submission</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #d97706; color: white; padding: 20px; text-align: center; }
            .content { background: #ffffff; padding: 20px; border: 1px solid #e5e7eb; }
            .detail-row { margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
            .label { font-weight: bold; color: #374151; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 New Contact Form Submission</h1>
            </div>
            <div class="content">
              <div class="detail-row">
                <div class="label">Name:</div>
                <div>${contact.name}</div>
              </div>
              <div class="detail-row">
                <div class="label">Email:</div>
                <div><a href="mailto:${contact.email}">${contact.email}</a></div>
              </div>
              ${contact.phone ? `
                <div class="detail-row">
                  <div class="label">Phone:</div>
                  <div><a href="tel:${contact.phone}">${contact.phone}</a></div>
                </div>
              ` : ''}
              <div class="detail-row">
                <div class="label">Subject:</div>
                <div>${contact.subject}</div>
              </div>
              <div class="detail-row">
                <div class="label">Message:</div>
                <div style="white-space: pre-wrap;">${contact.message}</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_USER || 'contact@ackguesthouse.com',
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact: ${contact.subject}`,
      html: emailHtml,
      replyTo: contact.email
    };

    await transporter.sendMail(mailOptions);
    console.log('Contact notification email sent successfully');
  } catch (error) {
    console.error('Error sending contact notification email:', error);
    throw error;
  }
};

module.exports = {
  sendBookingNotification,
  sendContactNotification
};