import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Clock, CheckCircle } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import type { ContactData } from '../utils/types';

const Contact: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<ContactData | null>(null);

  const handleContactSubmit = (data: ContactData) => {
    setSubmittedData(data);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setSubmittedData(null);
  };

  if (isSubmitted && submittedData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Message Sent Successfully!</h1>
              <p className="text-lg text-gray-600 mb-8">
                Thank you for contacting us, {submittedData.name}! We've received your message and will get back to you within 24 hours.
              </p>
              <div className="bg-gray-50 p-6 rounded-lg mb-8 text-left">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Summary</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Subject:</span> {submittedData.subject}</div>
                  <div><span className="font-medium">Email:</span> {submittedData.email}</div>
                  {submittedData.phone && <div><span className="font-medium">Phone:</span> {submittedData.phone}</div>}
                </div>
              </div>
              <div className="space-y-4 mb-8">
                <p className="text-gray-600">Need immediate assistance? Contact us directly:</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="tel:+254759750318"
                    className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    <Phone className="h-5 w-5" />
                    <span>Call Now</span>
                  </a>
                  <a
                    href="https://wa.me/254720577442?text=Hi, I just sent a message through your website"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
              <button
                onClick={resetForm}
                className="text-amber-600 hover:text-amber-700 font-semibold"
              >
                Send Another Message
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-amber-600 to-amber-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-xl text-amber-100 max-w-3xl mx-auto">
            Get in touch with our friendly team - we're here to help make your stay perfect
          </p>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600 mb-2">Call us for immediate assistance</p>
                    <a href="tel:+254720577442" className="text-amber-600 hover:text-amber-700 font-semibold">
                      +254 720 577 442
                    </a>
                    
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600 mb-2">Send us a message anytime</p>
                    <a href="mailto:ackguesthsenyeri025@gmail.com" className="text-amber-600 hover:text-amber-700 font-semibold">
                      ackguesthsenyeri025@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                    <p className="text-gray-600 mb-2">Visit us at our location</p>
                    <address className="text-gray-700 not-italic">
                      ACK Mt. Kenya Guest House<br />
                      Nyeri, opposite Wamuti Distributors<br />
                      on your way to King'ong'o near Chania Bridge
                    </address>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Hours</h3>
                    <p className="text-gray-600 mb-2">Reception is open 24/7</p>
                    <p className="text-gray-700">24 Hours Daily</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Quick Contact */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                  <h3 className="font-semibold text-green-900">Quick WhatsApp Contact</h3>
                </div>
                <p className="text-green-700 mb-4">
                  Get instant responses to your questions via WhatsApp
                </p>
                <a
                  href="https://wa.me/254720577442?text=Hi, I have a question about ACK Mt. Kenya Guest House"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Chat Now</span>
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                <ContactForm onSubmit={handleContactSubmit} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Us</h2>
            <p className="text-xl text-gray-600">Located in the heart of Nyeri with easy access to major attractions</p>
          </div>

          <div className="bg-gray-200 rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5158.573778844751!2d36.94111547600069!3d-0.41700103529597493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x18285de01f6ca12b%3A0x31b86b9743836a35!2sACK%20Mt.%20Kenya%20Guest%20House%2C%20Nyeri!5e1!3m2!1sen!2ske!4v1751188841074!5m2!1sen!2ske"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="ACK Mt. Kenya Guest House Location"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <MapPin className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Nyeri Town</h3>
              <p className="text-gray-600 text-sm">2 minutes drive</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <MapPin className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Nyeri Golf Club</h3>
              <p className="text-gray-600 text-sm">3 minutes drive</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <MapPin className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">White Rhino Hotel</h3>
              <p className="text-gray-600 text-sm">4 minutes drive</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
