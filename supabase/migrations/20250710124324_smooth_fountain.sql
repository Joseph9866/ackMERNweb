/*
  # Add payment system for 50% deposit requirement

  1. New Tables
    - `payments`
      - `id` (uuid, primary key)
      - `booking_id` (uuid, foreign key to bookings)
      - `amount` (integer) - payment amount in KSh
      - `payment_type` (text) - 'deposit', 'balance', 'full'
      - `payment_method` (text) - 'mpesa', 'cash', 'cheque', 'bank_transfer'
      - `payment_reference` (text) - M-Pesa code, cheque number, etc.
      - `status` (text) - 'pending', 'completed', 'failed', 'refunded'
      - `paid_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Updates to bookings table
    - Add `deposit_amount` (integer) - required deposit (50% of total)
    - Add `deposit_paid` (boolean) - whether deposit has been paid
    - Add `balance_amount` (integer) - remaining amount to pay
    - Add `payment_status` (text) - 'pending_deposit', 'deposit_paid', 'fully_paid'

  3. Security
    - Enable RLS on payments table
    - Add policies for payment management
    - Add functions for payment calculations

  4. Functions
    - Function to calculate deposit amount (50% of total)
    - Function to update booking payment status
    - Function to check payment completion
*/

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  payment_type text NOT NULL CHECK (payment_type IN ('deposit', 'balance', 'full')),
  payment_method text NOT NULL CHECK (payment_method IN ('mpesa', 'cash', 'cheque', 'bank_transfer')),
  payment_reference text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  paid_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add payment-related columns to bookings table
DO $$
BEGIN
  -- Add deposit_amount column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'deposit_amount'
  ) THEN
    ALTER TABLE bookings ADD COLUMN deposit_amount integer;
  END IF;

  -- Add deposit_paid column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'deposit_paid'
  ) THEN
    ALTER TABLE bookings ADD COLUMN deposit_paid boolean DEFAULT false;
  END IF;

  -- Add balance_amount column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'balance_amount'
  ) THEN
    ALTER TABLE bookings ADD COLUMN balance_amount integer;
  END IF;

  -- Add payment_status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE bookings ADD COLUMN payment_status text DEFAULT 'pending_deposit' 
    CHECK (payment_status IN ('pending_deposit', 'deposit_paid', 'fully_paid'));
  END IF;
END $$;

-- Enable RLS on payments table
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policies for payments
CREATE POLICY "Anyone can view payments"
  ON payments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create payments"
  ON payments
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update payments"
  ON payments
  FOR UPDATE
  TO public
  USING (true);

-- Function to calculate deposit amount (50% of total)
CREATE OR REPLACE FUNCTION calculate_deposit_amount(total_amount integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Set search path to empty string for security
  SET search_path = '';
  
  -- Calculate 50% deposit, rounded up to nearest 50 KSh
  RETURN CEIL((total_amount * 0.5) / 50.0) * 50;
END;
$$;

-- Function to update booking payment status
CREATE OR REPLACE FUNCTION update_booking_payment_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  booking_total integer;
  total_paid integer;
  deposit_required integer;
BEGIN
  -- Set search path to empty string for security
  SET search_path = '';
  
  -- Get booking total amount
  SELECT total_amount INTO booking_total
  FROM public.bookings
  WHERE id = NEW.booking_id;
  
  -- Calculate required deposit
  deposit_required := calculate_deposit_amount(booking_total);
  
  -- Calculate total amount paid for this booking
  SELECT COALESCE(SUM(amount), 0) INTO total_paid
  FROM public.payments
  WHERE booking_id = NEW.booking_id AND status = 'completed';
  
  -- Update booking payment status
  IF total_paid >= booking_total THEN
    -- Fully paid
    UPDATE public.bookings 
    SET 
      payment_status = 'fully_paid',
      deposit_paid = true,
      deposit_amount = deposit_required,
      balance_amount = 0,
      updated_at = now()
    WHERE id = NEW.booking_id;
  ELSIF total_paid >= deposit_required THEN
    -- Deposit paid
    UPDATE public.bookings 
    SET 
      payment_status = 'deposit_paid',
      deposit_paid = true,
      deposit_amount = deposit_required,
      balance_amount = booking_total - total_paid,
      updated_at = now()
    WHERE id = NEW.booking_id;
  ELSE
    -- Still pending deposit
    UPDATE public.bookings 
    SET 
      payment_status = 'pending_deposit',
      deposit_paid = false,
      deposit_amount = deposit_required,
      balance_amount = booking_total - total_paid,
      updated_at = now()
    WHERE id = NEW.booking_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to update booking payment status when payments change
CREATE TRIGGER update_booking_payment_status_trigger
  AFTER INSERT OR UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_booking_payment_status();

-- Function to initialize payment amounts for existing bookings
CREATE OR REPLACE FUNCTION initialize_booking_payment_amounts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Set search path to empty string for security
  SET search_path = '';
  
  -- Update existing bookings with payment amounts
  UPDATE public.bookings 
  SET 
    deposit_amount = calculate_deposit_amount(total_amount),
    balance_amount = total_amount - calculate_deposit_amount(total_amount),
    payment_status = 'pending_deposit',
    deposit_paid = false
  WHERE deposit_amount IS NULL;
END;
$$;

-- Initialize payment amounts for existing bookings
SELECT initialize_booking_payment_amounts();

-- Create updated_at trigger for payments table
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_payment_type ON payments(payment_type);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);

-- Create view for payment summary
CREATE OR REPLACE VIEW booking_payment_summary AS
SELECT 
  b.id as booking_id,
  b.guest_name,
  b.guest_email,
  r.name as room_name,
  b.check_in_date,
  b.check_out_date,
  b.total_amount,
  b.deposit_amount,
  b.balance_amount,
  b.payment_status,
  b.deposit_paid,
  COALESCE(SUM(CASE WHEN p.status = 'completed' THEN p.amount ELSE 0 END), 0) as total_paid,
  COALESCE(SUM(CASE WHEN p.status = 'pending' THEN p.amount ELSE 0 END), 0) as pending_payments,
  COUNT(p.id) as payment_count
FROM public.bookings b
JOIN public.rooms r ON b.room_id = r.id
LEFT JOIN public.payments p ON b.id = p.booking_id
GROUP BY b.id, r.name
ORDER BY b.created_at DESC;

-- Add comments for documentation
COMMENT ON TABLE payments IS 'Stores payment records for bookings with 50% deposit requirement';
COMMENT ON FUNCTION calculate_deposit_amount(integer) IS 'Calculates 50% deposit amount rounded to nearest 50 KSh';
COMMENT ON FUNCTION update_booking_payment_status() IS 'Updates booking payment status based on completed payments';
COMMENT ON VIEW booking_payment_summary IS 'Summary view of booking payment status and amounts';