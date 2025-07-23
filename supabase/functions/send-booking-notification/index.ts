// This file has been removed as part of the migration from Supabase to MongoDB.
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

// This file has been deleted as part of the migration from Supabase to MongoDB.