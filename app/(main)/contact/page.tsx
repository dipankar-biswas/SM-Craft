// app/contact/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { toast } from "sonner";

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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/page-content?pageType=contact");
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Error fetching contact data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const result = await res.json();
      
      if (result.success) {
        toast.success(isBn ? "আপনার বার্তা পাঠানো হয়েছে!" : "Your message has been sent!");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(isBn ? "বার্তা পাঠাতে ব্যর্থ" : "Failed to send message");
    } finally {
      setSending(false);
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
            alt="Contact banner"
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
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {isBn ? "যোগাযোগের তথ্য" : "Contact Information"}
              </h2>
              
              <div className="space-y-4">
                {data.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <a href={`mailto:${data.email}`} className="text-gray-600 hover:text-blue-600">
                        {data.email}
                      </a>
                    </div>
                  </div>
                )}
                
                {data.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <a href={`tel:${data.phone}`} className="text-gray-600 hover:text-blue-600">
                        {data.phone}
                      </a>
                    </div>
                  </div>
                )}
                
                {data.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Address</p>
                      <p className="text-gray-600">
                        {isBn ? data.addressBn : data.address}
                      </p>
                    </div>
                  </div>
                )}
                
                {data.workingHours && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {isBn ? "কাজের সময়" : "Working Hours"}
                      </p>
                      <p className="text-gray-600">
                        {isBn ? data.workingHoursBn : data.workingHours}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Google Map */}
            {data.googleMapUrl && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <iframe
                  src={data.googleMapUrl}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {isBn ? "বার্তা পাঠান" : "Send us a Message"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isBn ? "আপনার নাম" : "Your Name"} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isBn ? "বিষয়" : "Subject"} *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isBn ? "বার্তা" : "Message"} *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {sending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {isBn ? "পাঠান" : "Send Message"}
              </button>
            </form>
          </div>
        </div>

        {/* Content Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-8">
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: isBn ? data.contentBn : data.content 
            }}
          />
        </div>
      </div>
    </div>
  );
}