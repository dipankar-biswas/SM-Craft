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
  Tractor,
  Van,
} from "lucide-react";
import Link from "next/link";
import { Logo } from "./Logo";
import { useApp } from "../context/AppContext";
import { toBengaliNumber } from "@/utils/helpers";
import Icon from "@/components/Icon";

export const Footer = ({ settings, categories }) => {
  const { isBn } = useApp();
  const logo = settings.footerLogo;

  return (
    <div className="bg-[#f8f5f0]">
      {/* Main Card Container */}
      <div className="mx-auto bg-white shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-xl">
        {/* Three Column Grid for Categories, Links, Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 py-10 md:px-10 bg-[#fffdf9]">
          {/* Column 1: Popular Categories */}
          <div className="space-y-4">
            {/* Logo */}
            <Logo logo={logo} />
            <p className="text-[#6b4c2c] text-md text-justify font-medium">
              {isBn
                ? settings.footerTextBn ||
                  "আমাদের মিশন হল আমাদের গ্রাহকদের সর্বোত্তম মানের পোশাক সরবরাহ করা, যা তাদের ব্যক্তিত্ব এবং শৈলীকে প্রতিফলিত করে।"
                : settings.footerText ||
                  "Our mission is to provide our customers with the best quality garments that reflect their personality and style."}
            </p>
          </div>

          {/* Column 2: Popular Categories */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-amber-200/60 pb-2 w-fit">
              <Flame className="w-5 h-5 text-[#d4a373]" />
              <h2 className="font-bold text-xl md:text-2xl text-[#2c3e2f] font-['Playfair_Display',serif]">
                {isBn ? "জনপ্রিয় বিভাগ" : "Popular Categories"}
              </h2>
            </div>
            <ul className="space-y-3 mt-4">
              {categories.slice(0, 4).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`${`/product-category/${cat.slug}`}`}
                    className="group flex items-center gap-3 text-[#2c3e2f] font-medium transition-all duration-200 hover:text-[#b45f2b] hover:translate-x-1"
                  >
                    <Icon
                      name={cat.icon}
                      size={20}
                      color={cat.iconColor || "#d4a373"}
                    />
                    <span>{isBn ? cat.nameBn : cat.name}</span>
                    {/* <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full ml-1">
                    Best Seller
                  </span> */}
                  </Link>
                </li>
              ))}
            </ul>
            {/* <div className="pt-4 hidden md:block">
              <div className="inline-flex items-center gap-2 text-xs bg-[#f2ede5] px-3 py-1.5 rounded-full text-[#6b4c2c]">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>{isBn ? "১০০% খাঁটি কাপড় | হস্তনির্মিত" : "100% authentic fabric | Handcrafted"}</span>
              </div>
            </div> */}
          </div>

          {/* Column 3: Useful Links */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-amber-200/60 pb-2 w-fit">
              <LinkIcon className="w-5 h-5 text-[#d4a373]" />
              <h2 className="font-bold text-xl md:text-2xl text-[#2c3e2f] font-['Playfair_Display',serif]">
                {isBn ? "প্রযুক্তিমূলক লিঙ্ক" : "Useful Links"}
              </h2>
            </div>
            <ul className="space-y-3 mt-4">
              <li>
                <Link
                  href="/about"
                  className="group flex items-center gap-3 text-[#2c3e2f] font-medium transition-all duration-200 hover:text-[#b45f2b] hover:translate-x-1"
                >
                  <Store className="w-5 h-5 text-stone-500" />
                  <span>{isBn ? "আমাদের সম্পর্কে" : "About Us"}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="group flex items-center gap-3 text-[#2c3e2f] font-medium transition-all duration-200 hover:text-[#b45f2b] hover:translate-x-1"
                >
                  <Mail className="w-5 h-5 text-stone-500" />
                  <span>{isBn ? "যোগাযোগ" : "Contact Us"}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="group flex items-center gap-3 text-[#2c3e2f] font-medium transition-all duration-200 hover:text-[#b45f2b] hover:translate-x-1"
                >
                  <FileText className="w-5 h-5 text-stone-500" />
                  <span>{isBn ? "শর্তাবলী এবং নীতি" : "Terms & Policy"}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/order-tracking"
                  className="group flex items-center gap-3 text-[#2c3e2f] font-medium transition-all duration-200 hover:text-[#b45f2b] hover:translate-x-1"
                >
                  <Van className="w-5 h-5 text-stone-500" />
                  <span>{isBn ? "অর্ডার ট্র্যাকিং" : "Order Tracking"}</span>
                </Link>
              </li>
            </ul>
            {/* <div className="pt-4 text-xs text-[#5a6e5a] flex gap-3 items-center">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d4a373]" />
              <span>{isBn ? "নিরাপদ পেমেন্ট এবং সহজ রিটার্ন" : "Secure payments & easy returns"}</span>
            </div> */}
          </div>

          {/* Column 4: Contact Us */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-amber-200/60 pb-2 w-fit">
              <Contact className="w-5 h-5 text-[#d4a373]" />
              <h2 className="font-bold text-xl md:text-2xl text-[#2c3e2f] font-['Playfair_Display',serif]">
                {isBn ? "যোগাযোগ" : "Contact Us"}
              </h2>
            </div>
            <div className="mt-4 space-y-4">
              {/* Address */}
              <div className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-[#c17b42] mt-0.5" />
                <div className="text-[#2c3e2f] font-medium text-sm md:text-base leading-relaxed">
                  {isBn
                    ? settings?.addressBn || "ঢাকা, বাংলাদেশ"
                    : settings?.address || "Dhaka, Bangladesh"}
                </div>
              </div>
              {/* Phone */}
              <div className="flex gap-3 items-center">
                <Phone className="w-5 h-5 text-[#c17b42]" />
                <div className="font-semibold">
                  <Link
                    href={`tel:${isBn ? toBengaliNumber(settings?.phone) : settings?.phone || (isBn ? toBengaliNumber("01741571104") : "01741571104")}`}
                    className="text-[#1e4a46] hover:text-[#d4a373] transition"
                  >
                    {isBn
                      ? toBengaliNumber(settings?.phone)
                      : settings?.phone ||
                        (isBn ? toBengaliNumber("01741571104") : "01741571104")}
                  </Link>
                </div>
              </div>
              {/* Social Links */}
              <div className="pt-2">
                <p className="text-xs uppercase tracking-wide text-stone-400 mb-2 flex items-center gap-2">
                  {isBn ? "আমাদের অনুসরণ করুন" : "Follow us"}
                </p>
                <div className="flex gap-4 items-center">
                  <Link
                    href={settings?.facebook || "#"}
                    className="bg-[#f2ede5] w-9 h-9 rounded-full flex items-center justify-center text-[#2c3e2f] hover:bg-[#d4a373] hover:text-white transition-all duration-200 hover:-translate-y-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </Link>
                  <Link
                    href={settings?.twitter || "#"}
                    className="bg-[#f2ede5] w-9 h-9 rounded-full flex items-center justify-center text-[#2c3e2f] hover:bg-[#d4a373] hover:text-white transition-all duration-200 hover:-translate-y-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </Link>
                  <Link
                    href={settings?.instagram || "#"}
                    className="bg-[#f2ede5] w-9 h-9 rounded-full flex items-center justify-center text-[#2c3e2f] hover:bg-[#d4a373] hover:text-white transition-all duration-200 hover:-translate-y-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </Link>
                  <Link
                    href={settings?.tiktok || "#"}
                    className="bg-[#f2ede5] w-9 h-9 rounded-full flex items-center justify-center text-[#2c3e2f] hover:bg-[#d4a373] hover:text-white transition-all duration-200 hover:-translate-y-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z" />
                    </svg>
                  </Link>
                  <Link
                    href={settings?.youtube || "#"}
                    className="bg-[#f2ede5] w-9 h-9 rounded-full flex items-center justify-center text-[#2c3e2f] hover:bg-[#d4a373] hover:text-white transition-all duration-200 hover:-translate-y-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.498 6.186a2.996 2.996 0 00-2.11-2.12C19.555 3.5 12 3.5 12 3.5s-7.555 0-9.388.566a2.996 2.996 0 00-2.11 2.12C0 8.02 0 12 0 12s0 3.98.502 5.814a2.996 2.996 0 002.11 2.12C4.445 20.5 12 20.5 12 20.5s7.555 0 9.388-.566a2.996 2.996 0 002.11-2.12C24 15.98 24 12 24 12s0-3.98-.502-5.814zM9.75 15.568V8.432L15.818 12 9.75 15.568z" />
                    </svg>
                  </Link>
                </div>
              </div>
              {/* Shop hours */}
              {/* <div className="flex items-center gap-2 text-xs text-stone-500 pt-1 border-t border-stone-100 mt-2">
                <Clock className="w-3.5 h-3.5" />
                <span>{isBn ? "শনি - বৃহস্পতি: সকাল ১০টা – রাত ৯টা | শুক্রবার: দুপুর ২টা – রাত ৮টা" : "Sat - Thu: 10AM – 9PM | Fri: 2PM – 8PM"}</span>
              </div> */}
            </div>
          </div>
        </div>

        {/* Footer Copyright */}
        <div className="bg-[#faf7f2] border-t border-[#efe0cf] px-6 py-4 text-center text-sm text-[#5a6e5a] flex flex-wrap justify-center items-center gap-2">
          <Copyright className="w-3.5 h-3.5" />
          <span>
            {isBn
              ? settings?.copyrightBn || "সর্বস্বত্ব সংরক্ষিত"
              : settings?.copyright || "All rights reserved"}
          </span>
          <span className="inline-flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-[#c97e5a] fill-[#c97e5a]" />
            {isBn ? "বিকাশ করেছেন" : "Development By"}{" "}
            <Link
              href="https://imdipankarbiswas.com/"
              target="_blank"
              className="hover:text-[#d4a373] underline"
              rel="noopener noreferrer"
            >
              {isBn ? "দিপংকর" : "Dipankar"}
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};
