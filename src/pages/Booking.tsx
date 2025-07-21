import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, Phone, MessageCircle, Mail, Calculator } from 'lucide-react';
import BookingForm from '../components/BookingForm';
import { useBookings } from '../hooks/useBookings';
import { useRooms } from '../hooks/useRooms';
import type { BookingData } from '../utils/types';

const Booking: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<BookingData | null>(null);
  const { createBooking } = useBookings();
  const { getRoomById, getRoomPrice } = useRooms();

  const selectedRoom = searchParams.get('room');

  const handleBookingSubmit = async (data: BookingData) => {
    const success = await createBooking(data);
    if (success) {
      setSubmittedData(data);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setSubmittedData(null);
  };

  const calculateBookingTotal = () => {
    if (!submittedData) return 0;
    const nights = Math.ceil(
      (new Date(submittedData.checkOut).getTime() -
        new Date(submittedData.checkIn).getTime()) /
        (1000 * 3600 * 24)
    );
    const roomPrice = getRoomPrice(submittedData.roomType, submittedData.mealPlan);
    return nights * roomPrice;
  };

  const calculateDepositAmount = () => {
    const total = calculateBookingTotal();
    return Math.ceil((total * 0.5) / 50) * 50; // Round up to nearest 50 KSh
  };

  const generateWhatsAppMessage = () => {
    if (!submittedData) return '';
    
    const room = getRoomById(submittedData.roomType);
    const total = calculateBookingTotal();
    const deposit = calculateDepositAmount();
    const nights = Math.ceil(
      (new Date(submittedData.checkOut).getTime() -
        new Date(submittedData.checkIn).getTime()) /
        (1000 * 3600 * 24)
    );

    const mealPlanNames = {
      bed_only: 'Bed Only',
      bb: 'Bed & Breakfast',
      half_board: 'Half Board',
      full_board: 'Full Board'
    };

    return `Hi, I would like to make a booking at ACK Mt. Kenya Guest House.

*BOOKING REQUEST*

*Guest Details:*
Name: ${submittedData.name}
Phone: ${submittedData.phone}
Email: ${submittedData.email}
Number of Guests: ${submittedData.guests}

*Accommodation Details:*
Room Type: ${room?.name}
Meal Plan: ${mealPlanNames[submittedData.mealPlan]}
Check-in: ${new Date(submittedData.checkIn).toLocaleDateString('en-US', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    })}
Check-out: ${new Date(submittedData.checkOut).toLocaleDateString('en-US', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    })}
Number of Nights: ${nights}

*Pricing:*
Rate per night: KSh ${getRoomPrice(submittedData.roomType, submittedData.mealPlan).toLocaleString()}
Total Amount: KSh ${total.toLocaleString()}
Required Deposit (50%): KSh ${deposit.toLocaleString()}

${submittedData.specialRequests ? `*Special Requests:*
${submittedData.specialRequests}

` : ''}Please confirm availability and let me know the next steps for payment.

Thank you!`;
  };

  if (isSubmitted && submittedData) {
    const whatsappMessage = encodeURIComponent(generateWhatsAppMessage());
    const emailSubject = encodeURIComponent('Booking Request - ACK Mt. Kenya Guest House');
    const emailBody = encodeURIComponent(generateWhatsAppMessage().replace(/\*/g, ''));

    return (
      <div className="min-h-screen bg-gray-50">
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Booking Request Prepared!
                </h1>

                <p className="text-lg text-gray-600 mb-6">
                  Your booking details have been prepared. Please contact us using one of the methods below to confirm your reservation.
                </p>
              </div>

              {/* Booking Summary */}
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Booking Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Name:</span> {submittedData.name}</div>
                  <div><span className="font-medium">Email:</span> {submittedData.email}</div>
                  <div><span className="font-medium">Phone:</span> {submittedData.phone}</div>
                  <div><span className="font-medium">Guests:</span> {submittedData.guests}</div>
                  <div><span className="font-medium">Room:</span> {getRoomById(submittedData.roomType)?.name}</div>
                  <div><span className="font-medium">Meal Plan:</span> {
                    submittedData.mealPlan === 'bed_only' ? 'Bed Only' :
                    submittedData.mealPlan === 'bb' ? 'Bed & Breakfast' :
                    submittedData.mealPlan === 'half_board' ? 'Half Board' : 'Full Board'
                  }</div>
                  <div><span className="font-medium">Check-in:</span> {new Date(submittedData.checkIn).toLocaleDateString()}</div>
                  <div><span className="font-medium">Check-out:</span> {new Date(submittedData.checkOut).toLocaleDateString()}</div>
                  <div><span className="font-medium">Nights:</span> {Math.ceil(
                    (new Date(submittedData.checkOut).getTime() - new Date(submittedData.checkIn).getTime()) / (1000 * 3600 * 24)
                  )}</div>
                  <div><span className="font-medium">Rate/night:</span> KSh {getRoomPrice(submittedData.roomType, submittedData.mealPlan).toLocaleString()}</div>
                  <div className="md:col-span-2 pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg">Total Amount:</span>
                      <span className="font-bold text-lg text-green-600">KSh {calculateBookingTotal().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="font-medium text-amber-700">Required Deposit (50%):</span>
                      <span className="font-medium text-amber-700">KSh {calculateDepositAmount().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                {submittedData.specialRequests && (
                  <div className="mt-4 pt-4 border-t">
                    <span className="font-medium">Special Requests:</span>
                    <p className="text-gray-600 mt-1">{submittedData.specialRequests}</p>
                  </div>
                )}
              </div>

              {/* Contact Methods */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 text-center">
                  Choose Your Preferred Contact Method:
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/254720577442?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-6 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 hover:border-green-300 transition-all group"
                  >
                    <div className="bg-green-600 p-3 rounded-full mb-3 group-hover:bg-green-700 transition-colors">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-green-900 mb-2">WhatsApp</h4>
                    <p className="text-sm text-green-700 text-center">
                      Instant messaging with pre-filled booking details
                    </p>
                    <span className="text-xs text-green-600 mt-2 font-medium">Recommended</span>
                  </a>

                  {/* Phone */}
                  <a
                    href="tel:+254720577442"
                    className="flex flex-col items-center p-6 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all group"
                  >
                    <div className="bg-blue-600 p-3 rounded-full mb-3 group-hover:bg-blue-700 transition-colors">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-blue-900 mb-2">Phone Call</h4>
                    <p className="text-sm text-blue-700 text-center">
                      Speak directly with our reservations team
                    </p>
                    <span className="text-xs text-blue-600 mt-2">+254 720 577 442</span>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:ackguesthsenyeri025@gmail.com?subject=${emailSubject}&body=${emailBody}`}
                    className="flex flex-col items-center p-6 bg-amber-50 border-2 border-amber-200 rounded-lg hover:bg-amber-100 hover:border-amber-300 transition-all group"
                  >
                    <div className="bg-amber-600 p-3 rounded-full mb-3 group-hover:bg-amber-700 transition-colors">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-amber-900 mb-2">Email</h4>
                    <p className="text-sm text-amber-700 text-center">
                      Send detailed booking request via email
                    </p>
                    <span className="text-xs text-amber-600 mt-2">24-48 hour response</span>
                  </a>
                </div>

                {/* Important Notes */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-medium text-blue-900 mb-3">Next Steps:</h4>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li>• Contact us using your preferred method above</li>
                    <li>• We'll confirm room availability for your dates</li>
                    <li>• A 50% deposit (KSh {calculateDepositAmount().toLocaleString()}) is required to secure your booking</li>
                    <li>• Payment can be made via M-Pesa, bank transfer, or cash</li>
                    <li>• You'll receive a booking confirmation once payment is processed</li>
                  </ul>
                </div>

                <div className="text-center">
                  <button
                    onClick={resetForm}
                    className="text-amber-600 hover:text-amber-700 font-semibold underline"
                  >
                    Make Another Booking Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative py-20 bg-gradient-to-r from-amber-600 to-amber-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Book Your Stay</h1>
          <p className="text-xl text-amber-100 max-w-3xl mx-auto">
            Fill out the form below and we'll help you complete your booking via WhatsApp, phone, or email
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Reservation Request</h2>
              <p className="text-gray-600">
                Complete the form below to prepare your booking request. We'll generate a detailed message that you can send to us via WhatsApp, phone, or email.
              </p>
            </div>

            <BookingForm
              selectedRoom={selectedRoom || undefined}
              onSubmit={handleBookingSubmit}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Booking;