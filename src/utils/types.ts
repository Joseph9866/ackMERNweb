export interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  amenities: string[];
  capacity: number;
  available: boolean;
}

export interface BookingData {
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType: string; // now a string (ObjectId)
  specialRequests?: string;
  mealPlan: 'bed_only' | 'bb' | 'half_board' | 'full_board';
}

export interface PaymentData {
  bookingId: string;
  amount: number;
  paymentType: 'deposit' | 'balance' | 'full';
  paymentMethod: 'mpesa' | 'cash' | 'cheque' | 'bank_transfer';
  paymentReference?: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  payment_type: 'deposit' | 'balance' | 'full';
  payment_method: 'mpesa' | 'cash' | 'cheque' | 'bank_transfer';
  payment_reference?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

// WhatsApp booking interfaces
export interface WhatsAppBooking extends BookingData {
  id: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  total_amount?: number;
}

// Legacy database interfaces (hidden but kept for future use)
export interface DatabaseRoom {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  amenities: string[];
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface DatabaseBooking {
  id: string;
  room_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  special_requests: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_amount: number;
  deposit_amount?: number;
  deposit_paid?: boolean;
  balance_amount?: number;
  payment_status?: 'pending_deposit' | 'deposit_paid' | 'fully_paid';
  created_at: string;
  updated_at: string;
}