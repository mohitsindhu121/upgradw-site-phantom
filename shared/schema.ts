import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  username: varchar("username").unique(),
  password: varchar("password"), // Added password field for authentication
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  googleId: varchar("google_id").unique(), // Google authentication
  role: varchar("role").default("user"), // user, seller, admin
  isVerified: boolean("is_verified").default(false),
  storeName: varchar("store_name"), // For seller accounts
  storeDescription: text("store_description"), // For seller accounts
  phoneNumber: varchar("phone_number"), // Contact information
  address: text("address"), // Full address
  city: varchar("city"), // City
  state: varchar("state"), // State/Province
  country: varchar("country").default("India"), // Country
  pincode: varchar("pincode"), // Postal code
  businessType: varchar("business_type"), // Individual, Company, etc.
  gstNumber: varchar("gst_number"), // GST registration number
  panNumber: varchar("pan_number"), // PAN card number
  bankAccountNumber: varchar("bank_account_number"), // Bank details
  permissions: text("permissions").array().default([]), // User permissions array
  bankIfscCode: varchar("bank_ifsc_code"), // IFSC code
  bankName: varchar("bank_name"), // Bank name
  specialization: text("specialization"), // What they specialize in
  experience: varchar("experience"), // Years of experience
  portfolio: text("portfolio"), // Portfolio/previous work
  socialMediaLinks: text("social_media_links"), // JSON string of social links
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("0"), // Customer rating
  totalSales: integer("total_sales").default(0), // Number of sales
  isActive: boolean("is_active").default(true), // Account status
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  productId: varchar("product_id").notNull().unique(), // Auto-generated like MCG-001
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("INR"), // INR, USD, BDT
  category: varchar("category", { length: 50 }).notNull(), // panels, bots, websites, youtube
  imageUrl: varchar("image_url"),
  videoUrl: varchar("video_url"),
  purchaseLink: varchar("purchase_link"), // Custom purchase link set by seller
  isActive: boolean("is_active").default(true),
  ownerId: varchar("owner_id").notNull(), // Links to user who owns this product
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// YouTube resources table
export const youtubeResources = pgTable("youtube_resources", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  youtubeUrl: varchar("youtube_url").notNull(),
  thumbnailUrl: varchar("thumbnail_url"),
  category: varchar("category", { length: 50 }).notNull(), // tutorials, reviews, gaming
  duration: varchar("duration"), // e.g., "12:45"
  views: varchar("views"), // e.g., "125K views"
  isActive: boolean("is_active").default(true),
  ownerId: varchar("owner_id").notNull(), // Links to user who owns this resource
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact messages table
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Orders table for purchase tracking
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderId: varchar("order_id").unique().notNull(),
  productId: varchar("product_id").notNull(),
  sellerId: varchar("seller_id").notNull(), // Owner of the product
  customerName: varchar("customer_name").notNull(),
  customerPhone: varchar("customer_phone").notNull(),
  customerEmail: varchar("customer_email"),
  customerAddress: text("customer_address"),
  paymentMethod: varchar("payment_method").notNull(), // upi, card, netbanking, cod
  paymentOption: varchar("payment_option").notNull(), // immediate, emi_3, emi_6, emi_12, advance_booking
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status").default("pending"), // pending, confirmed, processing, shipped, delivered, cancelled
  transactionId: varchar("transaction_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Seller messages table for order notifications and customer communication
export const sellerMessages = pgTable("seller_messages", {
  id: serial("id").primaryKey(),
  sellerId: varchar("seller_id").notNull(), // Seller receiving the message
  orderId: varchar("order_id"), // Related order if applicable
  messageType: varchar("message_type").notNull(), // order_notification, customer_inquiry, system_message
  subject: varchar("subject").notNull(),
  content: text("content").notNull(),
  customerInfo: jsonb("customer_info"), // Customer details for contact
  isRead: boolean("is_read").default(false),
  priority: varchar("priority").default("normal"), // low, normal, high, urgent
  createdAt: timestamp("created_at").defaultNow(),
});

// Announcements table for admin announcements on home page
export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  type: varchar("type").default("info"), // info, warning, success, error
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(0), // Higher number = higher priority
  expiresAt: timestamp("expires_at"), // Optional expiry date
  createdBy: varchar("created_by").notNull(), // Admin user ID
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Export schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  productId: true,
  ownerId: true, // Remove ownerId from schema as it will be added by server
  createdAt: true,
  updatedAt: true,
});

export const insertYoutubeResourceSchema = createInsertSchema(youtubeResources).omit({
  id: true,
  ownerId: true, // Remove ownerId from schema as it will be added by server
  createdAt: true,
  updatedAt: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  isRead: true,
  createdAt: true,
});

// Export types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertYoutubeResource = z.infer<typeof insertYoutubeResourceSchema>;
export type YoutubeResource = typeof youtubeResources.$inferSelect;

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSellerMessageSchema = createInsertSchema(sellerMessages).omit({
  id: true,
  createdAt: true,
});

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertSellerMessage = z.infer<typeof insertSellerMessageSchema>;
export type SellerMessage = typeof sellerMessages.$inferSelect;

export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcements.$inferSelect;
