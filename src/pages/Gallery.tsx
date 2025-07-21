import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const images = [
    {
      src: 'Images/ACKview.jpeg',
      category: 'exterior',
      title: 'Main Building',
      description: 'Beautiful exterior view of ACK Guest House'
    },
    {
      src: 'Images/ACKbedmain.jpeg',
      category: 'rooms',
      title: 'Double Room',
      description: 'Comfortable and spacious double room with modern amenities'
    },
    {
      src: 'Images/ACKcompound2.jpeg',
      category: 'exterior',
      title: 'Compound Area',
      description: 'Peaceful gazebo setting perfect for relaxation'
    },
    {
      src: 'Images/ACKrestaurant.jpeg',
      category: 'dining',
      title: 'Restaurant Area',
      description: 'Dining area with a cozy atmosphere'
    },
    {
      src: 'Images/ACKcompound.jpeg',
      category: 'amenities',
      title: 'Parking Area',
      description: 'Spacious and secure parking area available for all guests.'

    },
    {
      src: 'Images/ACKroomWardrobe.jpeg',
      category: 'rooms',
      title: 'Executive Room with Wardrobe',
      description: 'Spacious executive room featuring a large wardrobe and modern furnishings'
    },
    {
      src: 'Images/ACKmainhall.jpeg',
      category: 'amenities',
      title: 'Conference Hall',
      description: 'Modern conference hall equipped with audio-visual facilities'
    },
    {
      src: 'Images/ACKminihall.jpeg',
      category: 'amenities',
      title: 'Community Hall',
      description: 'Spacious community hall suitable for gatherings and events'
    },
    {
      src: 'Images/ACKmainhall2.jpeg',
      category: 'amenities',
      title: 'Main Hall',
      description: 'Large main hall with seating for events and gatherings'
    },
    
    {
      src: 'Images/ACK2.webp',
      category: 'location',
      title: 'Welcoming Reception',
      description: 'Warm and inviting reception area to greet our guests'
    },

    {
      src: 'Images/ACK1.webp',
      category: 'location',
      title: 'Sunset Views',
      description: 'Spectacular sunset views from our property'
    }
  ];

  const categories = ['all', 'exterior', 'rooms', 'dining', 'amenities', 'location'];
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredImages = activeCategory === 'all' 
    ? images 
    : images.filter(img => img.category === activeCategory);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    
    const currentIndex = selectedImage;
    const maxIndex = filteredImages.length - 1;
    
    if (direction === 'prev') {
      setSelectedImage(currentIndex > 0 ? currentIndex - 1 : maxIndex);
    } else {
      setSelectedImage(currentIndex < maxIndex ? currentIndex + 1 : 0);
    }
  };

  const getCategoryTitle = (category: string) => {
    const titles: { [key: string]: string } = {
      all: 'All Photos',
      exterior: 'Exterior Views',
      rooms: 'Room Types',
      dining: 'Dining Areas',
      amenities: 'Facilities',
      location: 'Location & Views'
    };
    return titles[category] || category;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-amber-600 to-amber-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Photo Gallery
          </h1>
          <p className="text-xl text-amber-100 max-w-3xl mx-auto">
            Explore our beautiful accommodations and the stunning surroundings of Nyeri
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  activeCategory === category
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-amber-100 hover:text-amber-700'
                }`}
              >
                {getCategoryTitle(category)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Image Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image, index) => (
              <div
                key={index}
                className="relative group cursor-pointer overflow-hidden rounded-lg bg-gray-200 aspect-square"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-end">
                  <div className="p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <h3 className="font-semibold">{image.title}</h3>
                    <p className="text-sm opacity-90">{image.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-4xl mx-auto p-4">
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute -top-2 -right-2 bg-white text-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 z-10"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation buttons */}
            <button
              onClick={() => navigateImage('prev')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <button
              onClick={() => navigateImage('next')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image */}
            <img
              src={filteredImages[selectedImage].src}
              alt={filteredImages[selectedImage].title}
              className="max-w-full max-h-[80vh] object-contain mx-auto"
            />

            {/* Image info */}
            <div className="text-center text-white mt-4">
              <h3 className="text-xl font-semibold mb-2">{filteredImages[selectedImage].title}</h3>
              <p className="text-gray-300">{filteredImages[selectedImage].description}</p>
              <p className="text-sm text-gray-400 mt-2">
                {selectedImage + 1} of {filteredImages.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-amber-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Experience ACK Mt. Kenya Guest House?
          </h2>
          <p className="text-xl text-amber-100 mb-8">
            Book your stay and create your own memories in this beautiful setting
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/booking"
              className="bg-white text-amber-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Book Your Stay
            </a>
            <a
              href="/contact"
              className="border-2 border-white hover:bg-white hover:text-amber-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
            >
              Get More Info
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;