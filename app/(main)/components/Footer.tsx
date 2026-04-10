"use client";
// app/page.tsx
import {
  Shirt,
  Star,
  Flame,
  Palette,
  Users,
  UserCog,
  Layers,
  Store,
  Mail,
  FileText,
  Contact,
  MapPin,
  Phone,
  //   Facebook,
  //   Instagram,
  //   Twitter,
  //   Youtube,
  Copyright,
  Heart,
  Link as LinkIcon,
  Clock,
  Award,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { Logo } from "./Logo";

export const Footer = () => {
  return (
    <div className="bg-[#f8f5f0]">
      {/* Main Card Container */}
      <div className="mx-auto bg-white shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-xl">

        {/* Three Column Grid for Categories, Links, Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 py-10 md:px-10 bg-[#fffdf9]">
          {/* Column 1: Popular Categories */}
          <div className="space-y-4">
            {/* Logo */}
            <Logo />
            <p className="text-[#6b4c2c] text-md text-justify font-medium">
              Smart Panjabi Shop — The best Panjabi shop in Bangladesh. We sell premium quality Panjabis and traditional men’s wear.
            </p>
          </div>

          {/* Column 2: Popular Categories */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-amber-200/60 pb-2 w-fit">
              <Flame className="w-5 h-5 text-[#d4a373]" />
              <h2 className="font-bold text-xl md:text-2xl text-[#2c3e2f] font-['Playfair_Display',serif]">
                Popular Categories
              </h2>
            </div>
            <ul className="space-y-3 mt-4">
              <li>
                <a
                  href="#"
                  className="group flex items-center gap-3 text-[#2c3e2f] font-medium transition-all duration-200 hover:text-[#b45f2b] hover:translate-x-1"
                >
                  <Palette className="w-5 h-5 text-[#d4a373]" />
                  <span>Embroidery Panjabi</span>
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full ml-1">
                    Best Seller
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="group flex items-center gap-3 text-[#2c3e2f] font-medium transition-all duration-200 hover:text-[#b45f2b] hover:translate-x-1"
                >
                  <Users className="w-5 h-5 text-[#d4a373]" />
                  <span>Three Pieces</span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full ml-1">
                    Trending
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="group flex items-center gap-3 text-[#2c3e2f] font-medium transition-all duration-200 hover:text-[#b45f2b] hover:translate-x-1"
                >
                  <UserCog className="w-5 h-5 text-[#d4a373]" />
                  <span>Premium Koti</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="group flex items-center gap-3 text-[#2c3e2f] font-medium transition-all duration-200 hover:text-[#b45f2b] hover:translate-x-1"
                >
                  <Layers className="w-5 h-5 text-[#d4a373]" />
                  <span>Koti & Panjabi Combo</span>
                </a>
              </li>
            </ul>
            <div className="pt-4 hidden md:block">
              <div className="inline-flex items-center gap-2 text-xs bg-[#f2ede5] px-3 py-1.5 rounded-full text-[#6b4c2c]">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>100% authentic fabric | Handcrafted</span>
              </div>
            </div>
          </div>

          {/* Column 3: Useful Links */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-amber-200/60 pb-2 w-fit">
              <LinkIcon className="w-5 h-5 text-[#d4a373]" />
              <h2 className="font-bold text-xl md:text-2xl text-[#2c3e2f] font-['Playfair_Display',serif]">
                Useful Links
              </h2>
            </div>
            <ul className="space-y-3 mt-4">
              <li>
                <Link
                  href="/about"
                  className="group flex items-center gap-3 text-[#2c3e2f] font-medium transition-all duration-200 hover:text-[#b45f2b] hover:translate-x-1"
                >
                  <Store className="w-5 h-5 text-stone-500" />
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="group flex items-center gap-3 text-[#2c3e2f] font-medium transition-all duration-200 hover:text-[#b45f2b] hover:translate-x-1"
                >
                  <Mail className="w-5 h-5 text-stone-500" />
                  <span>Contact Us</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="group flex items-center gap-3 text-[#2c3e2f] font-medium transition-all duration-200 hover:text-[#b45f2b] hover:translate-x-1"
                >
                  <FileText className="w-5 h-5 text-stone-500" />
                  <span>Terms & Policy</span>
                </Link>
              </li>
            </ul>
            <div className="pt-4 text-xs text-[#5a6e5a] flex gap-3 items-center">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d4a373]" />
              <span>Secure payments & easy returns</span>
            </div>
          </div>

          {/* Column 4: Contact Us */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-amber-200/60 pb-2 w-fit">
              <Contact className="w-5 h-5 text-[#d4a373]" />
              <h2 className="font-bold text-xl md:text-2xl text-[#2c3e2f] font-['Playfair_Display',serif]">
                Contact Us
              </h2>
            </div>
            <div className="mt-4 space-y-4">
              {/* Address */}
              <div className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-[#c17b42] mt-0.5" />
                <div className="text-[#2c3e2f] font-medium text-sm md:text-base leading-relaxed">
                  Dr Nowab Ali Tower, 2nd Floor, <br /> 24 Purana Paltan, Dhaka
                </div>
              </div>
              {/* Phone */}
              <div className="flex gap-3 items-center">
                <Phone className="w-5 h-5 text-[#c17b42]" />
                <div className="font-semibold">
                  <a
                    href="tel:01965666777"
                    className="text-[#1e4a46] hover:text-[#d4a373] transition"
                  >
                    01965-666777
                  </a>
                </div>
              </div>
              {/* Social Links */}
              <div className="pt-2">
                <p className="text-xs uppercase tracking-wide text-stone-400 mb-2 flex items-center gap-2">
                  Follow us
                </p>
                <div className="flex gap-4 items-center">
                  <a
                    href="#"
                    className="bg-[#f2ede5] w-9 h-9 rounded-full flex items-center justify-center text-[#2c3e2f] hover:bg-[#d4a373] hover:text-white transition-all duration-200 hover:-translate-y-1"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a
                    href="#"
                    className="bg-[#f2ede5] w-9 h-9 rounded-full flex items-center justify-center text-[#2c3e2f] hover:bg-[#d4a373] hover:text-white transition-all duration-200 hover:-translate-y-1"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a
                    href="#"
                    className="bg-[#f2ede5] w-9 h-9 rounded-full flex items-center justify-center text-[#2c3e2f] hover:bg-[#d4a373] hover:text-white transition-all duration-200 hover:-translate-y-1"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </a>
                  <a
                    href="#"
                    className="bg-[#f2ede5] w-9 h-9 rounded-full flex items-center justify-center text-[#2c3e2f] hover:bg-[#d4a373] hover:text-white transition-all duration-200 hover:-translate-y-1"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z"/></svg>
                  </a>
                </div>
              </div>
              {/* Shop hours */}
              <div className="flex items-center gap-2 text-xs text-stone-500 pt-1 border-t border-stone-100 mt-2">
                <Clock className="w-3.5 h-3.5" />
                <span>Sat - Thu: 10AM – 9PM | Fri: 2PM – 8PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Copyright */}
        <div className="bg-[#faf7f2] border-t border-[#efe0cf] px-6 py-4 text-center text-sm text-[#5a6e5a] flex flex-wrap justify-center items-center gap-2">
          <Copyright className="w-3.5 h-3.5" />
          <span>
            2025 Smart Panjabi Shop — Premium traditional wear in Bangladesh.
          </span>
          <span className="inline-flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-[#c97e5a] fill-[#c97e5a]" />
            Elegance since 2018
          </span>
        </div>
      </div>

    </div>
  );
};
