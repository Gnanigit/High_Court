import React from "react";

const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="max-w-2xl bg-white shadow-lg rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">About Us</h1>
        <p className="text-gray-600 leading-relaxed">
          Welcome to our platform! We are dedicated to providing innovative
          solutions to make your experience seamless and efficient. Our mission
          is to simplify complex tasks with technology and ensure user-friendly
          interactions.
        </p>
        <p className="text-gray-600 mt-4">
          Our team is passionate about building scalable and robust
          applications. We strive to deliver the best user experience through
          continuous improvement and innovation.
        </p>
      </div>
    </div>
  );
};

export default About;
