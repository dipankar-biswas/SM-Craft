"use client";

import ImageGallery from "../components/ImageGallery";


const AboutPage = () => (
  <div className="bg-[#f3f3f3] py-8">
    <div className="container mx-auto w-full px-4">
      <div className="rounded-lg border border-gray-100 bg-white p-4">
        <div className="flex justify-center py-6">
          <div className="flex items-center">
            <img
              src="https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop"
              alt="About Us"
              className="w-[200px] rounded-lg shadow-md mr-6"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Mizan</h1>
              <h4 className="text-lg text-gray-600">Founder & CEO</h4>
              <h4 className="text-lg text-gray-600">Smart Panjabi Shop</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-100 bg-white mt-12">
        <ImageGallery />
      </div>
    </div>
  </div>
);

export default AboutPage;
