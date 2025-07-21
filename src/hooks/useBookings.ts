import { useState } from 'react';
import type { BookingData } from '../utils/types';

// Local types for the WhatsApp booking system
interface StoredBooking extends BookingData {
  id: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  total_amount?: number;
}

export const useBookings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Remove any mock ROOMS array and related logic from this file.
  // Always use useRooms for room data in the app.

  const createBooking = async (bookingData: BookingData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Send booking to backend API
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_id: bookingData.roomType,
          guest_name: bookingData.name,
          guest_email: bookingData.email,
          guest_phone: bookingData.phone,
          check_in_date: bookingData.checkIn,
          check_out_date: bookingData.checkOut,
          number_of_guests: bookingData.guests,
          special_requests: bookingData.specialRequests,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        return true;
      } else {
        throw new Error(data.message || 'Failed to create booking');
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      setError(err instanceof Error ? err.message : 'Failed to create booking');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getBookings = async (): Promise<StoredBooking[]> => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const storedBookings = localStorage.getItem('whatsapp_bookings');
      const bookings = storedBookings ? JSON.parse(storedBookings) : [];
      
      // Sort by creation date (newest first)
      return bookings.sort((a: StoredBooking, b: StoredBooking) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: 'confirmed' | 'cancelled'): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const storedBookings = JSON.parse(localStorage.getItem('whatsapp_bookings') || '[]');
      const updatedBookings = storedBookings.map((booking: StoredBooking) =>
        booking.id === bookingId ? { ...booking, status } : booking
      );

      localStorage.setItem('whatsapp_bookings', JSON.stringify(updatedBookings));
      return true;
    } catch (err) {
      console.error('Error updating booking status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update booking');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteBooking = async (bookingId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const storedBookings = JSON.parse(localStorage.getItem('whatsapp_bookings') || '[]');
      const filteredBookings = storedBookings.filter((booking: StoredBooking) => booking.id !== bookingId);

      localStorage.setItem('whatsapp_bookings', JSON.stringify(filteredBookings));
      return true;
    } catch (err) {
      console.error('Error deleting booking:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete booking');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearAllBookings = (): void => {
    localStorage.removeItem('whatsapp_bookings');
  };

  return {
    createBooking,
    getBookings,
    updateBookingStatus,
    deleteBooking,
    clearAllBookings,
    loading,
    error
  };
};