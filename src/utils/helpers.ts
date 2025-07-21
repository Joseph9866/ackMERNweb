// Date utilities
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const calculateNights = (checkIn: string, checkOut: string): number => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

export const calculateTotal = (pricePerNight: number, nights: number): number => {
  return pricePerNight * nights;
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[\d\s-()]+$/;
  return phoneRegex.test(phone);
};

export const validateDateRange = (checkIn: string, checkOut: string): { valid: boolean; error?: string } => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (checkInDate < today) {
    return { valid: false, error: 'Check-in date cannot be in the past' };
  }

  if (checkOutDate <= checkInDate) {
    return { valid: false, error: 'Check-out date must be after check-in date' };
  }

  return { valid: true };
};

// Currency formatting
export const formatCurrency = (amount: number): string => {
  return `KSh ${amount.toLocaleString()}`;
};

// WhatsApp message generator
export const generateWhatsAppMessage = (data: {
  name?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  roomType?: string;
  message?: string;
}): string => {
  let message = 'Hi, I have an inquiry about ACK Mt. Kenya Guest House.';
  
  if (data.name) message += `%0A%0AName: ${data.name}`;
  if (data.checkIn) message += `%0ACheck-in: ${data.checkIn}`;
  if (data.checkOut) message += `%0ACheck-out: ${data.checkOut}`;
  if (data.guests) message += `%0AGuests: ${data.guests}`;
  if (data.roomType) message += `%0ARoom Type: ${data.roomType}`;
  if (data.message) message += `%0A%0AMessage: ${data.message}`;
  
  return message;
};

// Image optimization
export const getOptimizedImageUrl = (url: string, width: number = 800, height: number = 600): string => {
  if (url.includes('pexels.com')) {
    return `${url}?auto=compress&cs=tinysrgb&w=${width}&h=${height}&fit=crop`;
  }
  return url;
};

// Local storage utilities
export const saveToLocalStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getFromLocalStorage = (key: string): any => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};