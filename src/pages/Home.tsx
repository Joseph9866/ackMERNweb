import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Wifi, Coffee, Car, Users, CheckCircle } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    { icon: Wifi, title: 'Free Wi-Fi', description: 'High-speed internet throughout the property' },
    { icon: Coffee, title: 'Breakfast Included', description: 'Start your day with a complimentary breakfast' },
    { icon: Car, title: 'Free Parking', description: 'Secure parking available for all guests' },
    { icon: Users, title: '24/7 Reception', description: 'Round-the-clock assistance for your needs' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'Amazing place with beautiful views! The staff was incredibly welcoming and the rooms were spotless.',
      date: '2 weeks ago'
    },
    {
      name: 'Michael Chen',
      rating: 5,
      comment: 'Perfect location for exploring Nyeri. The guest house exceeded our expectations in every way.',
      date: '1 month ago'
    },
    {
      name: 'Emma Wilson',
      rating: 5,
      comment: 'A peaceful retreat with excellent service. We felt right at home from the moment we arrived.',
      date: '3 weeks ago'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/Images/ACKview.jpeg')`
          


          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Welcome to<br />
            <span className="text-amber-400">ACK Mt. Kenya Guest House</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Your peaceful retreat in the heart of Nyeri, where comfort meets nature
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/booking"
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Book Your Stay
            </Link>
            <Link
              to="/rooms"
              className="border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
            >
              View Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose ACK Mt. Kenya Guest House?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience exceptional hospitality with modern amenities in a serene setting
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                A Home Away From Home
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Nestled in the beautiful landscape of Nyeri, ACK Mt. Kenya Guest House offers 
                a perfect blend of comfort, tranquility, and convenience. Our carefully designed 
                accommodations provide the ideal base for exploring the region's attractions.
              </p>
              <ul className="space-y-3 mb-8">
                {['Prime location in Nyeri town', 'Comfortable, well-appointed rooms', 'Personalized service', 'Peaceful garden setting'].map((item, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/about"
                className="inline-flex items-center text-amber-600 hover:text-amber-700 font-semibold"
              >
                Learn More About Us
                <span className="ml-2">→</span>
              </Link>
            </div>
            <div className="relative">
              <img
                src="/Images/ACKcompound2.jpeg"
                alt="Guest house exterior"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Guests Say
            </h2>
            <p className="text-xl text-gray-600">
              Read reviews from our satisfied guests
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">{testimonial.name}</span>
                  <span className="text-sm text-gray-500">{testimonial.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-amber-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready for Your Perfect Getaway?
          </h2>
          <p className="text-xl text-amber-100 mb-8">
            Book your stay at ACK Mt. Kenya Guest House and experience the best of Nyeri
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/booking"
              className="bg-white text-amber-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Book Now
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white hover:bg-white hover:text-amber-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;