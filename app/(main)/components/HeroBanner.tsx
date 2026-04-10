'use client'

export const HeroBanner = () => {
  return (
    <div className="relative w-full overflow-hidden bg-[#FAF6E9] min-h-[500px] flex items-center justify-between px-8 md:px-16 lg:px-24 py-12 lg:py-0">
      
      {/* Background Graphic (Mosque/Kaaba) */}
      <div className="absolute inset-0 pointer-events-none flex justify-center items-center lg:items-end z-0">
        <img 
          src="/kaaba_drawing.png" 
          alt="Kaaba Background" 
          className="h-full object-cover object-bottom opacity-20 mix-blend-multiply transform translate-y-8"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between h-full">
        
        {/* Left Side (Text content) */}
        <div className="flex-1 max-w-2xl text-left space-y-6 lg:pr-12">
          
          {/* Umrah Logo Area */}
          <div className="inline-block relative">
            <div className="absolute -top-3 left-4 bg-white px-2 text-xs font-semibold text-gray-500 rounded z-10">
              with Smart Panjabi Shop
            </div>
            <div className="bg-[#D93826] text-white px-8 py-3 rounded-md shadow-lg">
              <span className="text-5xl font-serif italic font-bold tracking-wider drop-shadow-sm">Umrah</span>
            </div>
          </div>

          {/* Bengali Text Title */}
          <div className="space-y-2 pt-8 pb-8 z-20 relative">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 flex flex-wrap items-baseline gap-3">
              <span className="text-red-600 text-4xl md:text-5xl lg:text-6xl tracking-tight drop-shadow-sm whitespace-nowrap">স্মার্ট পাঞ্জাবী শপ</span>
              <span className="whitespace-nowrap">থেকে কেনাকাটা করে</span>
            </h2>
            
            <h1 className="text-[3.5rem] md:text-7xl lg:text-8xl font-black text-[#0B6B3F] leading-none drop-shadow-sm tracking-tight py-2">
              ৩ জন বিজয়ী পাবেন
            </h1>
            
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 flex flex-wrap items-end gap-4 pt-4">
              <span className="mb-2">পবিত্র</span>
              <span className="text-red-600 text-6xl md:text-7xl lg:text-8xl tracking-tighter drop-shadow-sm leading-none">উমরাহ্</span>
              <span className="mb-2">পালনের সুযোগ</span>
            </h3>
          </div>
        </div>

        {/* Right Side (Models) */}
        <div className="flex-1 relative w-full h-[400px] lg:h-[600px] mt-12 lg:mt-0 flex items-end justify-center lg:justify-end z-20">
          <img 
            src="/men_panjabi.png" 
            alt="Men wearing Panjabi" 
            className="h-[105%] w-auto object-contain object-bottom transform translate-y-8 lg:translate-y-12 drop-shadow-2xl origin-bottom max-w-none ml-12"
          />
        </div>
      </div>
      
    </div>
  );
}
