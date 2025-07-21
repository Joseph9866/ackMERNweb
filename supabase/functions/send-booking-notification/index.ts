import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface BookingNotificationPayload {
  type: 'INSERT'
  table: string
  record: {
    id: string
    room_id: string
    guest_name: string
    guest_email: string
    guest_phone: string
    check_in_date: string
    check_out_date: string
    number_of_guests: number
    special_requests?: string
    total_amount: number
    status: string
    created_at: string
  }
  old_record?: any
}

interface EmailData {
  bookingId: string
  guestName: string
  guestEmail: string
  guestPhone: string
  checkInDate: string
  checkOutDate: string
  numberOfGuests: number
  roomName: string
  totalAmount: number
  specialRequests?: string
  bookingDate: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify request method
    if (req.method !== 'POST') {
      throw new Error('Method not allowed')
    }

    // Get environment variables
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL')
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!RESEND_API_KEY || !ADMIN_EMAIL || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables')
    }

    // Parse the webhook payload
    const payload: BookingNotificationPayload = await req.json()
    
    console.log('Received booking notification:', payload)

    // Validate payload
    if (payload.type !== 'INSERT' || payload.table !== 'bookings') {
      throw new Error('Invalid webhook payload')
    }

    const booking = payload.record

    // Initialize Supabase client with service role key
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Get room details
    const { data: roomData, error: roomError } = await supabase
      .from('rooms')
      .select('name')
      .eq('id', booking.room_id)
      .single()

    if (roomError || !roomData) {
      console.error('Error fetching room data:', roomError)
      throw new Error('Failed to fetch room details')
    }

    // Prepare email data
    const emailData: EmailData = {
      bookingId: booking.id,
      guestName: booking.guest_name,
      guestEmail: booking.guest_email,
      guestPhone: booking.guest_phone,
      checkInDate: new Date(booking.check_in_date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      checkOutDate: new Date(booking.check_out_date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      numberOfGuests: booking.number_of_guests,
      roomName: roomData.name,
      totalAmount: booking.total_amount,
      specialRequests: booking.special_requests || undefined,
      bookingDate: new Date(booking.created_at).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // Calculate number of nights
    const checkIn = new Date(booking.check_in_date)
    const checkOut = new Date(booking.check_out_date)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24))

    // Create email HTML content
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
            @media (max-width: 600px) {
              .container { padding: 10px; }
              .detail-row { flex-direction: column; }
              .detail-label, .detail-value { margin: 2px 0; }
            }
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
                  <span class="detail-value">#${emailData.bookingId.substring(0, 8)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Booking Date:</span>
                  <span class="detail-value">${emailData.bookingDate}</span>
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
                  <span class="detail-value">${emailData.guestName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email:</span>
                  <span class="detail-value">
                    <a href="mailto:${emailData.guestEmail}" style="color: #2563eb;">${emailData.guestEmail}</a>
                  </span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Phone:</span>
                  <span class="detail-value">
                    <a href="tel:${emailData.guestPhone}" style="color: #2563eb;">${emailData.guestPhone}</a>
                  </span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Number of Guests:</span>
                  <span class="detail-value">${emailData.numberOfGuests}</span>
                </div>
              </div>

              <h2>🏠 Accommodation Details</h2>
              <div class="booking-details">
                <div class="detail-row">
                  <span class="detail-label">Room Type:</span>
                  <span class="detail-value">${emailData.roomName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Check-in Date:</span>
                  <span class="detail-value">${emailData.checkInDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Check-out Date:</span>
                  <span class="detail-value">${emailData.checkOutDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Number of Nights:</span>
                  <span class="detail-value">${nights}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Total Amount:</span>
                  <span class="detail-value" style="font-size: 18px; font-weight: bold; color: #059669;">
                    KSh ${emailData.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              ${emailData.specialRequests ? `
                <h2>📝 Special Requests</h2>
                <div class="booking-details">
                  <p style="margin: 0; font-style: italic;">"${emailData.specialRequests}"</p>
                </div>
              ` : ''}

              <h2>🚀 Quick Actions</h2>
              <div style="text-align: center; margin: 30px 0;">
                <a href="tel:${emailData.guestPhone}" class="button">📞 Call Guest</a>
                <a href="mailto:${emailData.guestEmail}?subject=Booking Confirmation - ACK Mt. Kenya Guest House&body=Dear ${emailData.guestName},%0A%0AThank you for your booking request. We are pleased to confirm your reservation.%0A%0ABooking Details:%0A- Booking ID: ${emailData.bookingId.substring(0, 8)}%0A- Room: ${emailData.roomName}%0A- Check-in: ${emailData.checkInDate}%0A- Check-out: ${emailData.checkOutDate}%0A- Guests: ${emailData.numberOfGuests}%0A- Total: KSh ${emailData.totalAmount.toLocaleString()}%0A%0ABest regards,%0AACK Mt. Kenya Guest House Team" class="button">✉️ Send Confirmation</a>
                <a href="https://wa.me/${emailData.guestPhone.replace(/[^0-9]/g, '')}?text=Hello ${emailData.guestName}, thank you for your booking at ACK Mt. Kenya Guest House. We have received your request and will confirm shortly." class="button">💬 WhatsApp</a>
              </div>
            </div>

            <div class="footer">
              <p><strong>ACK Mt. Kenya Guest House</strong></p>
              <p>Nyeri, Kenya | +254 759 750 318 | josekeam01@gmail.com</p>
              <p style="font-size: 12px; color: #6b7280; margin-top: 15px;">
                This is an automated notification. Please respond to the guest promptly to confirm their booking.
              </p>
            </div>
          </div>
        </body>
      </html>
    `

    // Send email using Resend API
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'ACK Mt. Kenya Guest House <bookings@ackguesthouse.com>',
        to: [ADMIN_EMAIL],
        subject: `🚨 New Booking Alert - ${emailData.guestName} (${emailData.roomName})`,
        html: emailHtml,
        text: `
New Booking Alert - ACK Mt. Kenya Guest House

Booking ID: ${emailData.bookingId.substring(0, 8)}
Guest: ${emailData.guestName}
Email: ${emailData.guestEmail}
Phone: ${emailData.guestPhone}
Room: ${emailData.roomName}
Check-in: ${emailData.checkInDate}
Check-out: ${emailData.checkOutDate}
Guests: ${emailData.numberOfGuests}
Nights: ${nights}
Total: KSh ${emailData.totalAmount.toLocaleString()}
${emailData.specialRequests ? `Special Requests: ${emailData.specialRequests}` : ''}

Please contact the guest to confirm this booking.
        `.trim(),
        tags: [
          { name: 'category', value: 'booking-notification' },
          { name: 'booking-id', value: emailData.bookingId.substring(0, 8) }
        ]
      }),
    })

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      console.error('Resend API error:', errorText)
      throw new Error(`Failed to send email: ${emailResponse.status} ${errorText}`)
    }

    const emailResult = await emailResponse.json()
    console.log('Email sent successfully:', emailResult)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Booking notification sent successfully',
        emailId: emailResult.id,
        bookingId: emailData.bookingId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in send-booking-notification function:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})