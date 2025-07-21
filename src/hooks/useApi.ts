import { useState, useEffect } from 'react';
import { roomsApi, bookingsApi, contactsApi, type Room, type Booking, type CreateBookingData, type CreateContactData } from '../lib/api';

// Custom hook for rooms
export const useRooms = (checkIn?: string, checkOut?: string) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = checkIn && checkOut ? { check_in: checkIn, check_out: checkOut } : undefined;
        const response = await roomsApi.getAll(params);
        
        if (response.success && response.data) {
          setRooms(response.data);
        } else {
          throw new Error(response.message || 'Failed to fetch rooms');
        }
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch rooms');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [checkIn, checkOut]);

  const getRoomById = (id: string): Room | undefined => {
    return rooms.find(room => room._id === id);
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

      const response = await bookingsApi.create(bookingData);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create booking');
      }
    } catch (err) {
      console.error('Error creating booking:', err);
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

      const response = await bookingsApi.getById(id);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Booking not found');
      }
    } catch (err) {
      console.error('Error fetching booking:', err);
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

      const response = await bookingsApi.updateStatus(id, status);
      
      if (response.success) {
        return true;
      } else {
        throw new Error(response.message || 'Failed to update booking status');
      }
    } catch (err) {
      console.error('Error updating booking status:', err);
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

      const response = await contactsApi.create(contactData);
      
      if (response.success) {
        return true;
      } else {
        throw new Error(response.message || 'Failed to submit contact form');
      }
    } catch (err) {
      console.error('Error submitting contact form:', err);
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

      const response = await roomsApi.checkAvailability(roomId, {
        check_in_date: checkIn,
        check_out_date: checkOut
      });
      
      if (response.success && response.data) {
        return response.data.available;
      } else {
        throw new Error(response.message || 'Failed to check availability');
      }
    } catch (err) {
      console.error('Error checking availability:', err);
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