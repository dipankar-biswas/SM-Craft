"use client";

import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import DOMPurify from "dompurify";

interface ContactData {
  title: string;
  titleBn: string;
  content: string;
  contentBn: string;
  bannerImage: string;
  email: string;
  phone: string;
  address: string;
  addressBn: string;
  googleMapUrl: string;
  workingHours: string;
  workingHoursBn: string;
}

export default function ContactPage() {
  const { isBn } = useApp();
  const [data, setData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/page-content?pageType=contact");
      const result = await res.json();
      
      console.log("API Response:", result); // ডিবাগ করার জন্য
      
      if (result.success) {
        console.log("Content data:", result.data.content); // কন্টেন্ট চেক করুন
        console.log("ContentBn data:", result.data.contentBn); // বাংলা কন্টেন্ট চেক করুন
        setData(result.data);
      } else {
        setError(result.error || "Failed to load data");
      }
    } catch (error) {
      console.error("Error fetching contact data:", error);
      setError("Network error");
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={fetchData} className="px-4 py-2 bg-blue-600 text-white rounded">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Get content based on language
  const rawContent = isBn ? data.contentBn : data.content;
  
  // Sanitize HTML content
  const sanitizedContent = DOMPurify.sanitize(rawContent, {
    ALLOWED_TAGS: [
      'p', 'br', 'b', 'strong', 'i', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'a', 'img', 'div', 'span', 'table', 'tr', 'td', 'th',
      'blockquote', 'pre', 'code', 'hr', 'section', 'article'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'id', 'style', 'target', 'rel']
  });

  return (
    <div className="bg-[#f3f3f3] py-8">
      <div className="container mx-auto w-full px-4">
        <div className="rounded-lg border border-gray-100 bg-white p-4 md:p-8">
          <div className="py-6 space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
              {isBn ? data.titleBn : data.title}
            </h1>
            
            {/* Content with HTML support */}
            <div 
              className="prose prose-lg max-w-none text-gray-600 
                         prose-headings:text-gray-800 
                         prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                         prose-strong:text-gray-800
                         prose-img:rounded-lg prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
            
            {/* যদি কন্টেন্ট খালি থাকে */}
            {(!rawContent || rawContent.trim() === "") && (
              <div className="text-center py-8 text-gray-400">
                <p>No content available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}