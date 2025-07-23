import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

// Room interface
export interface Room {
  id: string; // Supabase primary key
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
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRooms() {
      setLoading(true);
      const { data, error } = await supabase.from('rooms').select('*');
      if (error) setError(error.message);
      setRooms(data || []);
      setLoading(false);
    }
    fetchRooms();
  }, []);

  const getRoomById = (id: string): Room | undefined => {
    return rooms.find((room) => room.id === id);
  };

  // Get room price based on room id and meal plan
  const getRoomPrice = (roomId: string, mealPlan: 'bed_only' | 'bb' | 'half_board' | 'full_board'): number => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return 0;
    switch (mealPlan) {
      case 'bed_only':
        return room.bed_only ?? room.price ?? 0;
      case 'bb':
        return room.bb ?? room.price ?? 0;
      case 'half_board':
        return room.half_board ?? room.price ?? 0;
      case 'full_board':
        return room.full_board ?? room.price ?? 0;
      default:
        return room.price ?? 0;
    }
  };

  return { rooms, loading, error, getRoomById, getRoomPrice };
};
