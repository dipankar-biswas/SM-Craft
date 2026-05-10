// queries/contact.ts
import { Contact } from "@/model/contact-model";

export interface ContactType {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "pending" | "read" | "replied" | "spam";
  isRead: boolean;
  repliedAt?: Date;
  replyMessage?: string;
  ipAddress?: string;
  userAgent?: string;
  created_at?: Date;
  updated_at?: Date;
}

// Get all contact messages
export async function getAllMessages(
  filter: any = {},
  limit: number = 50,
  skip: number = 0
): Promise<ContactType[]> {
  try {
    const messages = await Contact.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    return messages as ContactType[];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}

// Get single message by ID
export async function getMessageById(id: string): Promise<ContactType | null> {
  try {
    const message = await Contact.findById(id).lean();
    return message as ContactType;
  } catch (error) {
    console.error("Error fetching message:", error);
    return null;
  }
}

// Create new message
export async function createMessage(data: Partial<ContactType>): Promise<ContactType | null> {
  try {
    const message = await Contact.create(data);
    return message.toObject() as ContactType;
  } catch (error) {
    console.error("Error creating message:", error);
    return null;
  }
}

// Update message
export async function updateMessage(
  id: string,
  data: Partial<ContactType>
): Promise<ContactType | null> {
  try {
    const message = await Contact.findByIdAndUpdate(
      id,
      { $set: { ...data, updated_at: new Date() } },
      { new: true }
    ).lean();
    return message as ContactType;
  } catch (error) {
    console.error("Error updating message:", error);
    return null;
  }
}

// Mark as read
export async function markAsRead(id: string): Promise<ContactType | null> {
  try {
    const message = await Contact.findByIdAndUpdate(
      id,
      { $set: { isRead: true, status: "read", updated_at: new Date() } },
      { new: true }
    ).lean();
    return message as ContactType;
  } catch (error) {
    console.error("Error marking message as read:", error);
    return null;
  }
}

// Reply to message
export async function replyToMessage(
  id: string,
  replyMessage: string
): Promise<ContactType | null> {
  try {
    const message = await Contact.findByIdAndUpdate(
      id,
      {
        $set: {
          status: "replied",
          replyMessage,
          repliedAt: new Date(),
          updated_at: new Date(),
        },
      },
      { new: true }
    ).lean();
    return message as ContactType;
  } catch (error) {
    console.error("Error replying to message:", error);
    return null;
  }
}

// Delete message
export async function deleteMessage(id: string): Promise<boolean> {
  try {
    const result = await Contact.findByIdAndDelete(id);
    return !!result;
  } catch (error) {
    console.error("Error deleting message:", error);
    return false;
  }
}

// Get unread count
export async function getUnreadCount(): Promise<number> {
  try {
    const count = await Contact.countDocuments({ isRead: false });
    return count;
  } catch (error) {
    console.error("Error getting unread count:", error);
    return 0;
  }
}

// Get messages by status
export async function getMessagesByStatus(
  status: string,
  limit: number = 50
): Promise<ContactType[]> {
  try {
    const messages = await Contact.find({ status })
      .sort({ created_at: -1 })
      .limit(limit)
      .lean();
    return messages as ContactType[];
  } catch (error) {
    console.error("Error fetching messages by status:", error);
    return [];
  }
}

// Delete old messages (older than days)
export async function deleteOldMessages(days: number = 30): Promise<number> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const result = await Contact.deleteMany({
      created_at: { $lt: cutoffDate },
      status: "spam",
    });
    
    return result.deletedCount;
  } catch (error) {
    console.error("Error deleting old messages:", error);
    return 0;
  }
}