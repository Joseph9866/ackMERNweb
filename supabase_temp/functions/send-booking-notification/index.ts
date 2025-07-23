// Supabase Edge Function: Send Booking Notification
import { serve } from 'https://deno.land/x/sift@0.6.0/mod.ts'

serve(async (request) => {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }
  const { bookingId, guestEmail } = await request.json()
  // TODO: Integrate with email provider (SendGrid, Resend, etc.)
  // Send booking confirmation email
  return new Response(JSON.stringify({ success: true }), { status: 200 })
})
