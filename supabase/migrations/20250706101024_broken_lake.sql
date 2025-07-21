/*
  # Create booking system database schema

  1. New Tables
    - `rooms`
      - `id` (text, primary key) - matches the room IDs in the frontend
      - `name` (text) - room name
      - `description` (text) - room description
      - `price` (integer) - price per night in KSh
      - `capacity` (integer) - maximum guests
      - `amenities` (text array) - list of amenities
      - `image_url` (text) - room image URL
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `bookings`
      - `id` (uuid, primary key)
      - `room_id` (text, foreign key to rooms)
      - `guest_name` (text)
      - `guest_email` (text)
      - `guest_phone` (text)
      - `check_in_date` (date)
      - `check_out_date` (date)
      - `number_of_guests` (integer)
      - `special_requests` (text, optional)
      - `status` (text) - 'pending', 'confirmed', 'cancelled', 'completed'
      - `total_amount` (integer) - total booking amount
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access to rooms
    - Add policies for booking creation and management

  3. Functions
    - Function to check room availability for given dates
*/

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  price integer NOT NULL,
  capacity integer NOT NULL DEFAULT 1,
  amenities text[] DEFAULT '{}',
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id text NOT NULL REFERENCES rooms(id),
  guest_name text NOT NULL,
  guest_email text NOT NULL,
  guest_phone text NOT NULL,
  check_in_date date NOT NULL,
  check_out_date date NOT NULL,
  number_of_guests integer NOT NULL DEFAULT 1,
  special_requests text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  total_amount integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for rooms (public read access)
CREATE POLICY "Anyone can view rooms"
  ON rooms
  FOR SELECT
  TO public
  USING (true);

-- Create policies for bookings
CREATE POLICY "Anyone can create bookings"
  ON bookings
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view bookings"
  ON bookings
  FOR SELECT
  TO public
  USING (true);

-- Create function to check room availability
CREATE OR REPLACE FUNCTION check_room_availability(
  room_id_param text,
  check_in_param date,
  check_out_param date
)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if there are any overlapping bookings for the room
  -- that are not cancelled
  RETURN NOT EXISTS (
    SELECT 1
    FROM bookings
    WHERE room_id = room_id_param
      AND status IN ('pending', 'confirmed')
      AND (
        (check_in_date <= check_in_param AND check_out_date > check_in_param)
        OR (check_in_date < check_out_param AND check_out_date >= check_out_param)
        OR (check_in_date >= check_in_param AND check_out_date <= check_out_param)
      )
  );
END;
$$;

-- Insert initial room data
INSERT INTO rooms (id, name, description, price, capacity, amenities, image_url) VALUES
  ('1', 'Standard Single Room', 'Cozy and comfortable single room perfect for solo travelers', 3500, 1, 
   ARRAY['Free Wi-Fi', 'Private Bathroom', 'TV', 'Desk', 'Wardrobe'], 
   'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'),
  
  ('2', 'Deluxe Double Room', 'Spacious double room with modern amenities and garden view', 5500, 2,
   ARRAY['Free Wi-Fi', 'Private Bathroom', 'TV', 'Mini Fridge', 'Balcony', 'Work Desk'],
   'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'),
  
  ('3', 'Family Suite', 'Perfect for families with separate sleeping areas and living space', 8500, 4,
   ARRAY['Free Wi-Fi', 'Private Bathroom', 'TV', 'Mini Fridge', 'Seating Area', 'Kitchenette'],
   'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'),
  
  ('4', 'Executive Room', 'Premium room with lake view and enhanced amenities', 7500, 2,
   ARRAY['Free Wi-Fi', 'Private Bathroom', 'TV', 'Mini Fridge', 'Lake View', 'Work Desk', 'Coffee Machine'],
   'https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop')
ON CONFLICT (id) DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON rooms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();