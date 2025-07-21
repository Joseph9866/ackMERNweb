import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Wifi,
  Tv,
  Bath,
  CheckCircle,
  Calendar,
  AlertCircle,
  type LucideIcon,
} from 'lucide-react';
import { useRooms } from '../hooks/useRooms';
import type { RoomWithAvailability } from '../hooks/useRooms';

const Rooms: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<RoomWithAvailability | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const { rooms, loading, error } = useRooms(checkIn, checkOut);

  const amenityIcons: Record<string, LucideIcon> = {
    'Free Wi-Fi': Wifi,
    'TV': Tv,
    'Private Bathroom': Bath,
    'Desk': Users,
    'Wardrobe': Users,
  };

  const getMinDate = () => new Date().toISOString().split('T')[0];

  const getMinCheckoutDate = () => {
    if (checkIn) {
      const date = new Date(checkIn);
      date.setDate(date.getDate() + 1);
      return date.toISOString().split('T')[0];
    }
    return getMinDate();
  };

  // Defensive price rendering helper
  const getPrice = (room: any, key: string): string => {
    if (room.pricing && typeof room.pricing[key] === 'number') return room.pricing[key].toLocaleString();
    if (typeof room[key] === 'number') return room[key].toLocaleString();
    return 'N/A';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading rooms...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">Error loading rooms: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 text-center bg-gradient-to-r from-amber-600 to-amber-700 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Rooms & Rates</h1>
        <p className="text-xl max-w-2xl mx-auto">
          Choose from our comfortable and affordable room options with flexible meal plans.
        </p>
      </section>

      {/* Check Availability */}
      <section className="py-8 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" /> Check Availability (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="checkIn" className="block text-sm mb-1">Check-in</label>
                <input
                  type="date"
                  id="checkIn"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={getMinDate()}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label htmlFor="checkOut" className="block text-sm mb-1">Check-out</label>
                <input
                  type="date"
                  id="checkOut"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={getMinCheckoutDate()}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <button
                  onClick={() => {
                    setCheckIn('');
                    setCheckOut('');
                  }}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md mt-6"
                >
                  Clear Dates
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Room List */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 grid gap-8 lg:grid-cols-2">
          {rooms.slice(0, 10).map((room) => (
            <div key={room.id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
              <div className="relative">
                <img
                  src={room.image_url}
                  alt={room.name}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
                <span className={`absolute top-4 right-4 px-3 py-1 text-sm font-semibold rounded-full ${
                  room.available ? 'bg-green-500' : 'bg-red-500'
                } text-white`}>
                  {room.available ? 'Available' : 'Check Availability'}
                </span>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{room.name}</h3>
                  <div className="text-right">
                    <div className="text-2xl text-amber-600 font-bold">
                      KSh {getPrice(room, 'bed_only')}
                    </div>
                    <div className="text-sm text-gray-500">per night</div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{room.description}</p>

                <div className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Up to {room.capacity} Guest{room.capacity > 1 ? 's' : ''}</span>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Meal Plans:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between"><span>Bed Only:</span><span>KSh {getPrice(room, 'bed_only')}</span></div>
                    <div className="flex justify-between"><span>B&B:</span><span>KSh {getPrice(room, 'bb')}</span></div>
                    <div className="flex justify-between"><span>Half Board:</span><span>KSh {getPrice(room, 'half_board')}</span></div>
                    <div className="flex justify-between"><span>Full Board:</span><span>KSh {getPrice(room, 'full_board')}</span></div>
                  </div>
                </div>

                {room.amenities?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Amenities:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {room.amenities.map((amenity: string, i: number) => {
                        const Icon = amenityIcons[amenity] || CheckCircle;
                        return (
                          <div key={i} className="flex items-center space-x-2">
                            <Icon className="w-4 h-4 text-green-500" />
                            <span>{amenity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={() => setSelectedRoom(room)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
                  >
                    View Details
                  </button>
                  <Link
                    to={`/booking?room=${room.id}`}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md text-center"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Room Details Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl overflow-y-auto max-h-[90vh]">
            <div className="relative">
              <img
                src={selectedRoom.image_url}
                alt={selectedRoom.name}
                className="w-full h-64 object-cover rounded-t-lg"
              />
              <button
                onClick={() => setSelectedRoom(null)}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-opacity-70"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">{selectedRoom.name}</h3>
              <p className="text-gray-600 mb-4">{selectedRoom.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium">Bed Only</h4>
                  <div className="text-lg font-bold text-amber-600">KSh {getPrice(selectedRoom, 'bed_only')}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium">Full Board</h4>
                  <div className="text-lg font-bold text-amber-600">KSh {getPrice(selectedRoom, 'full_board')}</div>
                </div>
              </div>

              <ul className="list-disc text-sm text-gray-700 space-y-1 pl-5">
                <li>Children under 3 stay free if sharing with an adult.</li>
                <li>Children 4–12 are charged 50% when sharing with adults.</li>
                <li>Guests over 13 are charged full rate.</li>
                <li>50% deposit required to reserve.</li>
                <li>Payment via M-Pesa, bank, cash, or cheque.</li>
              </ul>

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-md"
                >
                  Close
                </button>
                <Link
                  to={`/booking?room=${selectedRoom.id}`}
                  onClick={() => setSelectedRoom(null)}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-md"
                >
                  Book This Room
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
