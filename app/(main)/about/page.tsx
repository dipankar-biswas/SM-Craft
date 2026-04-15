// app/about/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { Mail, Phone, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import Link from "next/link";

interface AboutData {
  title: string;
  titleBn: string;
  content: string;
  contentBn: string;
  mission: string;
  missionBn: string;
  vision: string;
  visionBn: string;
  bannerImage: string;
  aboutImage: string;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;
}

export default function AboutPage() {
  const { isBn } = useApp();
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/page-content?pageType=about");
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Error fetching about data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Section */}
      {data.bannerImage && (
        <div className="relative h-[300px] md:h-[400px] overflow-hidden">
          <img
            src={data.bannerImage}
            alt="About banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold">
                {isBn ? data.titleBn : data.title}
              </h1>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: isBn ? data.contentBn : data.content 
            }}
          />
        </div>

        {/* Mission & Vision Section */}
        {(data.mission || data.vision) && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {data.mission && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {isBn ? "আমাদের মিশন" : "Our Mission"}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {isBn ? data.missionBn : data.mission}
                </p>
              </div>
            )}
            {data.vision && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {isBn ? "আমাদের ভিশন" : "Our Vision"}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {isBn ? data.visionBn : data.vision}
                </p>
              </div>
            )}
          </div>
        )}

        {/* About Image */}
        {data.aboutImage && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <img
              src={data.aboutImage}
              alt="About"
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Social Links */}
        {(data.facebook || data.twitter || data.instagram || data.linkedin || data.youtube) && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {isBn ? "সোশ্যাল মিডিয়ায় আমাদের ফলো করুন" : "Follow Us on Social Media"}
            </h2>
            <div className="flex justify-center gap-4">
              {data.facebook && (
                <Link href={data.facebook} target="_blank" className="p-3 bg-gray-100 rounded-full hover:bg-blue-100 transition">
                  <Facebook className="w-6 h-6 text-blue-600" />
                </Link>
              )}
              {data.twitter && (
                <Link href={data.twitter} target="_blank" className="p-3 bg-gray-100 rounded-full hover:bg-blue-100 transition">
                  <Twitter className="w-6 h-6 text-blue-400" />
                </Link>
              )}
              {data.instagram && (
                <Link href={data.instagram} target="_blank" className="p-3 bg-gray-100 rounded-full hover:bg-pink-100 transition">
                  <Instagram className="w-6 h-6 text-pink-600" />
                </Link>
              )}
              {data.linkedin && (
                <Link href={data.linkedin} target="_blank" className="p-3 bg-gray-100 rounded-full hover:bg-blue-100 transition">
                  <Linkedin className="w-6 h-6 text-blue-700" />
                </Link>
              )}
              {data.youtube && (
                <Link href={data.youtube} target="_blank" className="p-3 bg-gray-100 rounded-full hover:bg-red-100 transition">
                  <Youtube className="w-6 h-6 text-red-600" />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}