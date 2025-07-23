import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  amenities: string[];
  image_url: string;
  available: boolean;
  pricing: {
    bed_only: number;
    bb: number;
    half_board: number;
    full_board: number;
  };
}

export interface Booking {
  id: string;
  room_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  meal_plan: 'bed_only' | 'bb' | 'half_board' | 'full_board';
  special_requests?: string;
  status: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface CreateBookingData {
  room_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  meal_plan: 'bed_only' | 'bb' | 'half_board' | 'full_board';
  special_requests?: string;
}

export interface CreateContactData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// Custom hook for rooms
export const useRooms = (checkIn?: string, checkOut?: string) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRooms() {
      setLoading(true);
      const query = supabase.from('rooms').select('*');
      // Optionally filter by availability dates if needed
      // You can add logic here to filter rooms based on checkIn/checkOut
      const { data, error } = await query;
      if (error) setError(error.message);
      setRooms(data || []);
      setLoading(false);
    }
    fetchRooms();
  }, [checkIn, checkOut]);

  const getRoomById = (id: string): Room | undefined => {
    return rooms.find(room => room.id === id);
  };

  const getAvailableRooms = (): Room[] => {
    return rooms.filter(room => room.available);
  };

  const getRoomPrice = (
    roomId: string,
    mealPlan: 'bed_only' | 'bb' | 'half_board' | 'full_board' = 'bed_only'
  ): number => {
    const room = getRoomById(roomId);
    if (!room) return 0;
    return room.pricing[mealPlan] || room.pricing.bed_only;
  };

  return {
    rooms,
    loading,
    error,
    getRoomById,
    getAvailableRooms,
    getRoomPrice
  };
};

// Custom hook for bookings
export const useBookings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = async (bookingData: CreateBookingData): Promise<Booking | null> => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.from('bookings').insert([bookingData]).select().single();
      if (error) throw new Error(error.message);
      return data as Booking;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getBookingById = async (id: string): Promise<Booking | null> => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.from('bookings').select('*').eq('id', id).single();
      if (error) throw new Error(error.message);
      return data as Booking;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch booking');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
      if (error) throw new Error(error.message);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update booking status');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createBooking,
    getBookingById,
    updateBookingStatus,
    loading,
    error
  };
};

// Custom hook for contacts
export const useContacts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitContact = async (contactData: CreateContactData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.from('contacts').insert([contactData]);
      if (error) throw new Error(error.message);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit contact form');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitContact,
    loading,
    error
  };
};

// Custom hook for room availability checking
export const useRoomAvailability = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAvailability = async (
    roomId: string,
    checkIn: string,
    checkOut: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      // Example: Check for overlapping bookings in Supabase
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('room_id', roomId)
        .or(`check_in_date.lte.${checkOut},check_out_date.gte.${checkIn}`);
      if (error) throw new Error(error.message);
      // If no overlapping bookings, room is available
      return !data || data.length === 0;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check availability');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    checkAvailability,
    loading,
    error
  };
};