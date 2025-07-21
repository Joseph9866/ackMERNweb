import { useState, useEffect } from 'react';

// Room interface
export interface Room {
  _id: string; // MongoDB ObjectId
  id: string; // keep for compatibility, but use _id everywhere
  name: string;
  description: string;
  price: number;
  capacity: number;
  amenities: string[];
  image_url: string;
  available: boolean;
  bed_only: number;
  bb: number;
  half_board: number;
  full_board: number;
}

export interface RoomWithAvailability extends Room {
  available: boolean;
}

export interface BookingData {
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType: string;
  specialRequests?: string;
}

export const useRooms = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/rooms');
        const data = await res.json();
        if (data.success) {
          setRooms(data.data);
        } else {
          setError(data.message || 'Failed to load rooms');
        }
      } catch (err) {
        setError('Failed to load rooms');
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const getRoomById = (id: string): any | undefined => {
    return rooms.find((room: any) => room._id === id);
  };

  return { rooms, loading, error, getRoomById };
};
