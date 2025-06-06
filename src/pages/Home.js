import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import cleaningImg from "../assets/cleaning.jpg";
import plumbingImg from "../assets/plumbing.jpg";
import electricianImg from "../assets/electrician.jpg";
import heroImg from "../assets/chores-poster.jpg";

const HomePage = () => {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [expandedService, setExpandedService] = useState(null);

  const testimonials = [
    {
      id: 1,
      text: "The cleaning service was fantastic! My home has never been this clean. Highly recommend!",
      author: "Jane Doe",
    },
    {
      id: 2,
      text: "The plumber arrived on time and fixed the issue quickly. Great service!",
      author: "John Smith",
    },
    {
      id: 3,
      text: "The electrician was very professional and solved all my electrical issues. Will use again!",
      author: "Alice Johnson",
    },
  ];

  const services = [
    {
      id: 1,
      title: "Cleaning",
      description: "Professional cleaning services for your home or office.",
      details: "We offer deep cleaning, regular cleaning, and specialized cleaning services tailored to your needs.",
      image: cleaningImg,
    },
    {
      id: 2,
      title: "Plumbing",
      description: "Fix leaks, install fixtures, and more with expert plumbers.",
      details: "Our plumbers are licensed and experienced in handling all types of plumbing issues.",
      image: plumbingImg,
    },
    {
      id: 3,
      title: "Electrician",
      description: "Electrical repairs, installations, and maintenance.",
      details: "From wiring to lighting, our electricians ensure your home is safe and functional.",
      image: electricianImg,
    },
  ];

  const handleTestimonialNavigation = (direction) => {
    setTestimonialIndex((prev) =>
      direction === "prev"
        ? prev === 0 ? testimonials.length - 1 : prev - 1
        : prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <div
            className="relative w-full h-[70vh] bg-cover bg-center flex items-center justify-center text-white"
            style={{ backgroundImage: `url(${heroImg})` }}
            >
            <div className="bg-black bg-opacity-50 p-10 rounded-lg text-center">
                <h1 className="text-5xl font-bold mb-4 animate-fade-in">
                Your Trusted Household Services Platform
                </h1>
                <p className="text-xl mb-8 animate-fade-in">
                Book reliable and professional services for your home in just a few clicks.
                </p>
                <Link
                to="/services"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition-all duration-300 animate-bounce"
                >
                Explore Services
                </Link>
            </div>
            </div>


      {/* Services Section */}
      <div className="container mx-auto py-16">
        <h2 className="text-3xl font-bold text-center mb-8 animate-slide-in">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
              <img src={service.image} alt={service.title} className="w-full h-40 object-cover rounded-lg mb-4" />
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <button onClick={() => setExpandedService(expandedService === service.id ? null : service.id)} className="text-blue-600 hover:text-blue-700 flex items-center justify-center mx-auto">
                {expandedService === service.id ? "Show Less" : "Learn More"} <FaArrowRight className="ml-2" />
              </button>
              {expandedService === service.id && <p className="text-gray-600 mt-4">{service.details}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container mx-auto py-16">
        <h2 className="text-3xl font-bold text-center mb-8 animate-slide-in">What Our Customers Say</h2>
        <div className="relative max-w-2xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-600 mb-4">{testimonials[testimonialIndex].text}</p>
            <p className="text-gray-800 font-semibold">- {testimonials[testimonialIndex].author}</p>
          </div>
          <button onClick={() => handleTestimonialNavigation("prev")} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white p-2 rounded-full hover:bg-gray-700 transition-all duration-300">
            <FaChevronLeft />
          </button>
          <button onClick={() => handleTestimonialNavigation("next")} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white p-2 rounded-full hover:bg-gray-700 transition-all duration-300">
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8">
        <div className="container mx-auto text-center">
          <p className="mb-4">© 2023 Household Services Platform. All rights reserved.</p>
          <div className="flex justify-center space-x-6">
            <Link to="/about" className="hover:text-blue-500">About Us</Link>
            {/* <Link to="/contact" className="hover:text-blue-500">Contact</Link> */}
            <Link to="/privacy" className="hover:text-blue-500">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
