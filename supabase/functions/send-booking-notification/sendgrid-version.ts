// Alternative version using SendGrid instead of Resend
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed')
    }

    // Get environment variables
    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY')
    const SENDGRID_FROM_EMAIL = Deno.env.get('SENDGRID_FROM_EMAIL')
    const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL')
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!SENDGRID_API_KEY || !SENDGRID_FROM_EMAIL || !ADMIN_EMAIL || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables')
    }

    const payload = await req.json()
    const booking = payload.record

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Get room details
    const { data: roomData, error: roomError } = await supabase
      .from('rooms')
      .select('name')
      .eq('id', booking.room_id)
      .single()

    if (roomError || !roomData) {
      throw new Error('Failed to fetch room details')
    }

    // Calculate nights
    const checkIn = new Date(booking.check_in_date)
    const checkOut = new Date(booking.check_out_date)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24))

    // Send email using SendGrid API
    const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: ADMIN_EMAIL }],
          subject: `🚨 New Booking Alert - ${booking.guest_name} (${roomData.name})`
        }],
        from: {
          email: SENDGRID_FROM_EMAIL,
          name: 'ACK Mt. Kenya Guest House'
        },
        content: [{
          type: 'text/html',
          value: `
            <h2>New Booking Alert</h2>
            <p><strong>Booking ID:</strong> ${booking.id.substring(0, 8)}</p>
            <p><strong>Guest:</strong> ${booking.guest_name}</p>
            <p><strong>Email:</strong> ${booking.guest_email}</p>
            <p><strong>Phone:</strong> ${booking.guest_phone}</p>
            <p><strong>Room:</strong> ${roomData.name}</p>
            <p><strong>Check-in:</strong> ${new Date(booking.check_in_date).toLocaleDateString()}</p>
            <p><strong>Check-out:</strong> ${new Date(booking.check_out_date).toLocaleDateString()}</p>
            <p><strong>Guests:</strong> ${booking.number_of_guests}</p>
            <p><strong>Nights:</strong> ${nights}</p>
            <p><strong>Total:</strong> KSh ${booking.total_amount.toLocaleString()}</p>
            ${booking.special_requests ? `<p><strong>Special Requests:</strong> ${booking.special_requests}</p>` : ''}
          `
        }],
        categories: ['booking-notification'],
        custom_args: {
          booking_id: booking.id.substring(0, 8)
        }
      }),
    })

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      throw new Error(`SendGrid API error: ${emailResponse.status} ${errorText}`)
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Booking notification sent successfully via SendGrid'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})