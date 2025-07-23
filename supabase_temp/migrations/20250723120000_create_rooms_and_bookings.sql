-- Supabase migration: Create rooms and bookings tables
CREATE TABLE rooms (
  id text PRIMARY KEY,
  name text,
  description text,
  price integer,
  capacity integer,
  amenities text[],
  image_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id text REFERENCES rooms(id),
  guest_name text,
  guest_email text,
  guest_phone text,
  check_in_date date,
  check_out_date date,
  number_of_guests integer,
  special_requests text,
  status text,
  total_amount integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
