"use cleint";

import Link from "next/link";

export const Logo = () => {
  return (
    <Link
      href="/"
      className="relative flex flex-col items-center justify-center min-w-[120px] min-h-[42px] lg:min-w-[150px] lg:min-h-[50px] -mt-2"
    >
      <div className="flex items-center gap-0.5 z-10">
        <span className="text-black text-[1.5rem] lg:text-[2rem] font-black tracking-tighter">
          SMCR
        </span>
        <div className="relative flex items-end">
          <span className="text-black text-[1.5rem] lg:text-[2rem] font-black z-20">A</span>
          {/* Decorative A swoosh */}
          <div className="absolute -left-2 -bottom-1 w-[18px] h-[30px] border-r-[6px] border-b-[6px] border-red-600 rounded-br-full rotate-12 -z-10"></div>
          <div className="absolute -left-4 -bottom-2 w-[22px] h-[35px] border-r-[4px] border-b-[4px] border-green-500 rounded-br-full rotate-6 -z-20"></div>
        </div>
        <span className="text-black text-[1.5rem] lg:text-[2rem] font-black tracking-tighter">
          FT
        </span>
      </div>
      <div className="bg-white px-2 py-0.5 rounded-full shadow-sm text-red-600 font-bold text-[10px] uppercase tracking-[0.2em] -mt-2 z-30">
        Panjabi Shop
      </div>
    </Link>
  );
};
