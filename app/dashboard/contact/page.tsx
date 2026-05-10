// app/admin/contact/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { toast } from "sonner";
import { 
  Mail, 
  Eye, 
  CheckCircle, 
  Reply, 
  Trash2, 
  MessageCircle,
  Check,
  X,
  Send
} from "lucide-react";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "pending" | "read" | "replied" | "spam";
  isRead: boolean;
  replyMessage?: string;
  created_at: string;
}

export default function AdminContact() {
  const { isBn } = useApp();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyModal, setReplyModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const url = filter === "all" 
        ? "/api/contact" 
        : `/api/contact?status=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isRead: true, status: "read" }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(isBn ? "পঠিত হিসেবে চিহ্নিত করা হয়েছে" : "Marked as read");
        fetchMessages();
      }
    } catch (error) {
      console.error("Error marking as read:", error);
      toast.error("Failed to update");
    }
  };

  const handleReply = async (id: string) => {
    if (!replyText.trim()) {
      toast.error(isBn ? "রিপ্লাই লেখা প্রয়োজন" : "Reply message is required");
      return;
    }
    
    try {
      const res = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, replyMessage: replyText }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(isBn ? "রিপ্লাই পাঠানো হয়েছে" : "Reply sent");
        setReplyModal(false);
        setReplyText("");
        fetchMessages();
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Failed to send reply");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(isBn ? "আপনি কি এই মেসেজটি ডিলিট করতে চান?" : "Are you sure you want to delete this message?")) {
      try {
        const res = await fetch("/api/contact", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        const data = await res.json();
        if (data.success) {
          toast.success(isBn ? "মেসেজ ডিলিট করা হয়েছে" : "Message deleted");
          fetchMessages();
        }
      } catch (error) {
        console.error("Error deleting message:", error);
        toast.error("Failed to delete");
      }
    }
  };

  const filteredMessages = messages.filter(msg =>
    msg.name.toLowerCase().includes(search.toLowerCase()) ||
    msg.email.toLowerCase().includes(search.toLowerCase()) ||
    msg.subject.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">Pending</span>;
      case "read":
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">Read</span>;
      case "replied":
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Replied</span>;
      case "spam":
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">Spam</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {isBn ? "যোগাযোগের বার্তা" : "Contact Messages"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {messages.length} {isBn ? "টি বার্তা পাওয়া গেছে" : "messages found"}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === "pending"
                ? "bg-yellow-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === "read"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Read
          </button>
          <button
            onClick={() => setFilter("replied")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === "replied"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Replied
          </button>
          
          {/* Search */}
          <div className="flex-1 max-w-md ml-auto">
            <input
              type="text"
              placeholder={isBn ? "খুঁজুন..." : "Search..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          {filteredMessages.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">{isBn ? "কোন বার্তা পাওয়া যায়নি" : "No messages found"}</p>
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <div
                key={msg._id}
                className={`bg-white rounded-xl shadow-sm border transition-all ${
                  !msg.isRead ? "border-blue-300 bg-blue-50/30" : "border-gray-100"
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{msg.name}</h3>
                        {getStatusBadge(msg.status)}
                        {!msg.isRead && (
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {msg.email} {msg.phone && `• ${msg.phone}`}
                      </p>
                      <p className="text-sm font-medium text-gray-700 mt-2">
                        Subject: {msg.subject}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedMessage(msg);
                          setReplyModal(true);
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                        title="Reply"
                      >
                        <Reply className="w-4 h-4" />
                      </button>
                      {!msg.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(msg._id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Mark as read"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(msg._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mt-2">
                    <p className="text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                  </div>
                  
                  {msg.replyMessage && (
                    <div className="mt-3 bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                      <p className="text-sm font-medium text-green-700 mb-1">Reply:</p>
                      <p className="text-gray-700">{msg.replyMessage}</p>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-400 mt-3">
                    {new Date(msg.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reply Modal */}
      {replyModal && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {isBn ? "রিপ্লাই করুন" : "Reply to"} {selectedMessage.name}
              </h2>
              <button onClick={() => setReplyModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">Original Message:</p>
                <p className="text-gray-600">{selectedMessage.message}</p>
                <p className="text-xs text-gray-400 mt-2">
                  From: {selectedMessage.email}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isBn ? "আপনার রিপ্লাই" : "Your Reply"}
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={isBn ? "আপনার রিপ্লাই লিখুন..." : "Write your reply..."}
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setReplyModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  {isBn ? "বাতিল" : "Cancel"}
                </button>
                <button
                  onClick={() => handleReply(selectedMessage._id)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {isBn ? "পাঠান" : "Send Reply"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}