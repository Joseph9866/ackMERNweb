// Contact Information
export const CONTACT_INFO = {
  phone: '+254 759 750 318',
  catering_phone: '0735 756923',
  email: 'josekeam01@gmail.com',
  whatsapp: '+254759750318',
  address: {
    street: 'ACK Mt. Kenya Guest House',
    city: 'Nyeri, opposite Wamuti Distributors on your way to King\'ong\'o near Chania Bridge',
    country: 'Kenya'
  }
};

// Business Hours
export const BUSINESS_HOURS = {
  reception: '24 Hours Daily',
  checkin: '2:00 PM',
  checkout: '11:00 AM'
};

// Room Categories
export const ROOM_CATEGORIES = {
  STANDARD: 'standard',
  DELUXE: 'deluxe',
  FAMILY: 'family',
  EXECUTIVE: 'executive'
} as const;

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
} as const;

// Common amenities
export const COMMON_AMENITIES = [
  'Free Wi-Fi',
  'Private Bathroom',
  'TV',
  'Mini Fridge',
  'Work Desk',
  'Wardrobe',
  'Balcony',
  'Lake View',
  'Coffee Machine',
  'Seating Area',
  'Kitchenette'
];

// Pricing
export const ADDITIONAL_SERVICES = {
  AIRPORT_TRANSFER: 2500,
  BREAKFAST_PACKAGE: 800,
  TOUR_GUIDE: 3000
};

// Hall Hire Rates
export const HALL_HIRE_RATES = {
  LARGE: { capacity: '50–200 pax', price: 10000 },
  MEDIUM: { capacity: '20–50 pax', price: 5000 },
  SMALL: { capacity: '20–30 pax', price: 3000 },
  MINI: { capacity: '7–9 pax', price: 2000 }
};

// Meal Rates (per person)
export const MEAL_RATES = {
  BREAKFAST: 500,
  TEA_SNACKS: 300,
  BUFFET_LUNCH: 800,
  BUFFET_DINNER: 800,
  HIGH_TEA: 600
};

// Accommodation Rates
export const ACCOMMODATION_RATES = {
  SINGLE: { bed_only: 1000, bb: 1200, half_board: 2500, full_board: 3500 },
  DOUBLE: { bed_only: 1200, bb: 1500, half_board: 2800, full_board: 4300 },
  DOUBLE_EXTENDED: { bed_only: 2500, bb: 2900, half_board: 4300, full_board: 6300 }
};

// Conference Rates
export const CONFERENCE_RATES = {
  FULL_BOARD_SINGLE: 3700,
  FULL_BOARD_DOUBLE: 4000,
  FULL_DAY: 2500,
  HALF_DAY: 1500,
  FULL_DAY_STATIONERY: 2800,
  HALF_DAY_STATIONERY: 1700
};

// Catering Services
export const CATERING_SERVICES = [
  'Corporate events', 'Weddings', 'Birthday parties', 'Ruracio events',
  'Burials', 'Graduation', 'Church events', 'Public/community meetings'
];

// Social Media Links
export const SOCIAL_LINKS = {
  facebook: '#',
  instagram: '#',
  whatsapp: `https://wa.me/${CONTACT_INFO.whatsapp.replace('+', '')}`
};