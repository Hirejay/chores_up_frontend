import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <div className="font-sans bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 text-white py-20"
      >
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">About ChoresUp</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Connecting you with trusted professionals to make your home life easier and more comfortable.
          </p>
        </div>
      </motion.div>

      {/* Our Story Section */}
      <div className="container mx-auto py-16">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="md:w-1/2 bg-gray-700 p-2 rounded-xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1579389083078-4e7018379f7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
              alt="ChoresUp team" 
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </motion.div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Story</h2>
            <p className="text-gray-600 mb-4">
              ChoresUp was founded in 2020 with a simple mission: to make household services more accessible, reliable, and convenient for everyone.
            </p>
            <p className="text-gray-600 mb-4">
              Frustrated by the difficulty of finding trustworthy service providers, our founders set out to create a platform that would connect homeowners with vetted professionals at the tap of a button.
            </p>
            <p className="text-gray-600">
              Today, we serve thousands of happy customers across the country, helping them maintain their homes with peace of mind.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-gray-200 py-16">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="md:w-1/2 bg-gray-700 p-2 rounded-xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Our mission" 
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </motion.div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                To revolutionize the way people access home services by providing:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Instant access to pre-vetted professionals</li>
                <li>Transparent pricing with no hidden fees</li>
                <li>Reliable service with satisfaction guarantees</li>
                <li>Convenient booking and payment options</li>
                <li>Exceptional customer support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="container mx-auto py-16">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="md:w-1/2 bg-gray-700 p-2 rounded-xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
              alt="Our values" 
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </motion.div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Values</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Trust</h3>
                <p className="text-gray-600">
                  We thoroughly vet all service providers and maintain high standards for quality and reliability.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Transparency</h3>
                <p className="text-gray-600">
                  No hidden fees or surprises - just clear pricing and honest communication.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Customer Focus</h3>
                <p className="text-gray-600">
                  Your satisfaction is our top priority. We're here to make your life easier.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Innovation</h3>
                <p className="text-gray-600">
                  We continuously improve our platform to better serve your needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-200 py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Meet Our Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Johnson",
                role: "CEO & Co-founder",
                bio: "Alex brings 15 years of experience in the home services industry and a passion for customer satisfaction."
              },
              {
                name: "Maria Garcia",
                role: "CTO & Co-founder",
                bio: "Maria is a tech innovator who has built platforms that connect service providers with customers."
              },
              {
                name: "James Wilson",
                role: "Head of Operations",
                bio: "James ensures our service providers meet our high standards and customers receive exceptional service."
              }
            ].map((member, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <div className="w-32 h-32 bg-gray-700 text-white rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-xl font-semibold mb-1 text-gray-800">{member.name}</h3>
                <p className="text-gray-600 mb-3">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;