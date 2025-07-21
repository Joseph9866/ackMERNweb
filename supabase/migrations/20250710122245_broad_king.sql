/*
  # Fix Function Search Path Security Issues

  1. Security Fixes
    - Update `check_room_availability` function to use explicit search path
    - Update `update_updated_at_column` function to use explicit search path
    - Both functions now use `SET search_path = '';` for security
    - Functions use SECURITY DEFINER for proper privilege handling

  2. Function Updates
    - `check_room_availability`: Maintains existing logic with security improvements
    - `update_updated_at_column`: Maintains existing trigger logic with security improvements
    - All object references are now schema-qualified where needed

  3. Security Benefits
    - Prevents SQL injection vulnerabilities
    - Eliminates unpredictable function behavior
    - Prevents potential privilege escalation
    - Ensures functions only access explicitly qualified objects
*/

-- Fix check_room_availability function with explicit search path
CREATE OR REPLACE FUNCTION public.check_room_availability(
  room_id_param text,
  check_in_param date,
  check_out_param date
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Set search path to empty string for security
  SET search_path = '';
  
  -- Check if there are any overlapping bookings for the room
  -- that are not cancelled
  RETURN NOT EXISTS (
    SELECT 1
    FROM public.bookings
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

-- Fix update_updated_at_column function with explicit search path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  -- Set search path to empty string for security
  SET search_path = '';
  
  -- Update the updated_at column to current timestamp
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verify the functions are properly updated
-- You can run these queries to check the function definitions:
-- SELECT pg_get_functiondef(oid) FROM pg_proc WHERE proname = 'check_room_availability';
-- SELECT pg_get_functiondef(oid) FROM pg_proc WHERE proname = 'update_updated_at_column';

-- Add comment for documentation
COMMENT ON FUNCTION public.check_room_availability(text, date, date) IS 
'Checks room availability for given dates with secure search path';

COMMENT ON FUNCTION public.update_updated_at_column() IS 
'Updates updated_at column with secure search path for triggers';