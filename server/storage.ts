import {
  users,
  products,
  youtubeResources,
  contactMessages,
  orders,
  sellerMessages,
  announcements,
  type User,
  type UpsertUser,
  type Product,
  type InsertProduct,
  type YoutubeResource,
  type InsertYoutubeResource,
  type ContactMessage,
  type InsertContactMessage,
  type Order,
  type InsertOrder,
  type SellerMessage,
  type InsertSellerMessage,
  type Announcement,
  type InsertAnnouncement,
} from "@shared/schema";
import { db } from "./db";
import { eq, like, or, desc, and, ilike, sql, isNull, gt } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  upsertUser(user: UpsertUser): Promise<User>;
  deleteUser(id: string): Promise<void>;
  updateUserPermissions(id: string, permissions: string[]): Promise<User>;

  // Product operations
  getProducts(ownerId?: string): Promise<Product[]>;
  getProductsByCategory(category: string, ownerId?: string): Promise<Product[]>;
  searchProducts(query: string, ownerId?: string): Promise<Product[]>;
  getProduct(id: number, ownerId?: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct, ownerId: string): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>, ownerId?: string): Promise<Product>;
  deleteProduct(id: number, ownerId?: string): Promise<void>;

  // YouTube resource operations
  getYoutubeResources(ownerId?: string): Promise<YoutubeResource[]>;
  getYoutubeResourcesByCategory(category: string, ownerId?: string): Promise<YoutubeResource[]>;
  getYoutubeResource(id: number, ownerId?: string): Promise<YoutubeResource | undefined>;
  createYoutubeResource(resource: InsertYoutubeResource, ownerId: string): Promise<YoutubeResource>;
  updateYoutubeResource(id: number, resource: Partial<InsertYoutubeResource>, ownerId?: string): Promise<YoutubeResource>;
  deleteYoutubeResource(id: number, ownerId?: string): Promise<void>;

  // Contact message operations
  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markMessageAsRead(id: number): Promise<void>;

  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrders(sellerId?: string): Promise<Order[]>;
  getOrder(orderId: string): Promise<Order | undefined>;
  updateOrderStatus(orderId: string, status: string): Promise<Order>;

  // Seller message operations
  createSellerMessage(message: InsertSellerMessage): Promise<SellerMessage>;
  getSellerMessages(sellerId: string): Promise<SellerMessage[]>;
  markSellerMessageAsRead(id: number): Promise<void>;
  getUnreadMessageCount(sellerId: string): Promise<number>;

  // Announcement operations
  getAnnouncements(): Promise<Announcement[]>;
  getActiveAnnouncements(): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: number, announcement: Partial<InsertAnnouncement>): Promise<Announcement>;
  deleteAnnouncement(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    // Delete user's products first
    await db.delete(products).where(eq(products.ownerId, id));
    // Delete user's YouTube resources
    await db.delete(youtubeResources).where(eq(youtubeResources.ownerId, id));
    // Delete the user
    await db.delete(users).where(eq(users.id, id));
  }

  // Product operations
  async getProducts(ownerId?: string): Promise<Product[]> {
    if (ownerId && ownerId !== 'mohit') {
      // Regular users see only their own products
      return await db.select().from(products)
        .where(and(eq(products.isActive, true), eq(products.ownerId, ownerId)))
        .orderBy(desc(products.createdAt));
    }
    // Super admin (mohit) sees all products including inactive ones, public users see all active
    if (ownerId === 'mohit') {
      return await db.select().from(products).orderBy(desc(products.createdAt));
    }
    return await db.select().from(products).where(eq(products.isActive, true)).orderBy(desc(products.createdAt));
  }

  async getProductsByCategory(category: string, ownerId?: string): Promise<Product[]> {
    if (ownerId && ownerId !== 'mohit') {
      return await db.select().from(products)
        .where(and(eq(products.category, category), eq(products.ownerId, ownerId)))
        .orderBy(desc(products.createdAt));
    }
    return await db.select().from(products)
      .where(eq(products.category, category))
      .orderBy(desc(products.createdAt));
  }

  async searchProducts(query: string, ownerId?: string): Promise<Product[]> {
    const searchTerm = `%${query}%`;
    const searchCondition = or(
      like(products.name, searchTerm),
      like(products.productId, searchTerm),
      like(products.description, searchTerm)
    );
    
    if (ownerId && ownerId !== 'mohit') {
      return await db.select().from(products)
        .where(and(searchCondition, eq(products.ownerId, ownerId)))
        .orderBy(desc(products.createdAt));
    }
    return await db.select().from(products)
      .where(searchCondition)
      .orderBy(desc(products.createdAt));
  }

  async getProduct(id: number, ownerId?: string): Promise<Product | undefined> {
    if (ownerId && ownerId !== 'mohit') {
      const [product] = await db.select().from(products)
        .where(and(eq(products.id, id), eq(products.ownerId, ownerId)));
      return product;
    }
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(productData: InsertProduct, ownerId: string): Promise<Product> {
    // Generate unique product ID
    const categoryPrefix = {
      panels: 'MCG',
      bots: 'MCB',
      websites: 'MCW',
      youtube: 'MCY'
    }[productData.category] || 'MCP';

    const count = await db.select().from(products).where(eq(products.category, productData.category));
    const productId = `${categoryPrefix}-${String(count.length + 1).padStart(3, '0')}`;

    const [product] = await db
      .insert(products)
      .values({
        ...productData,
        productId,
        ownerId,
        updatedAt: new Date(),
      })
      .returning();
    return product;
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>, ownerId?: string): Promise<Product> {
    if (ownerId && ownerId !== 'mohit') {
      const [product] = await db
        .update(products)
        .set({
          ...productData,
          updatedAt: new Date(),
        })
        .where(and(eq(products.id, id), eq(products.ownerId, ownerId)))
        .returning();
      return product;
    }
    const [product] = await db
      .update(products)
      .set({
        ...productData,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id: number, ownerId?: string): Promise<void> {
    if (ownerId && ownerId !== 'mohit') {
      await db.update(products).set({ isActive: false })
        .where(and(eq(products.id, id), eq(products.ownerId, ownerId)));
    } else {
      await db.update(products).set({ isActive: false }).where(eq(products.id, id));
    }
  }

  // YouTube resource operations
  async getYoutubeResources(ownerId?: string): Promise<YoutubeResource[]> {
    if (ownerId && ownerId !== 'mohit') {
      return await db.select().from(youtubeResources)
        .where(and(eq(youtubeResources.ownerId, ownerId), eq(youtubeResources.isActive, true)))
        .orderBy(desc(youtubeResources.createdAt));
    }
    return await db.select().from(youtubeResources)
      .where(eq(youtubeResources.isActive, true))
      .orderBy(desc(youtubeResources.createdAt));
  }

  async getYoutubeResourcesByCategory(category: string, ownerId?: string): Promise<YoutubeResource[]> {
    if (ownerId && ownerId !== 'mohit') {
      return await db.select().from(youtubeResources)
        .where(and(
          eq(youtubeResources.category, category),
          eq(youtubeResources.ownerId, ownerId),
          eq(youtubeResources.isActive, true)
        ))
        .orderBy(desc(youtubeResources.createdAt));
    }
    return await db.select().from(youtubeResources)
      .where(and(
        eq(youtubeResources.category, category),
        eq(youtubeResources.isActive, true)
      ))
      .orderBy(desc(youtubeResources.createdAt));
  }

  async getYoutubeResource(id: number): Promise<YoutubeResource | undefined> {
    const [resource] = await db.select().from(youtubeResources).where(eq(youtubeResources.id, id));
    return resource;
  }

  async createYoutubeResource(resourceData: InsertYoutubeResource, ownerId: string): Promise<YoutubeResource> {
    const [resource] = await db
      .insert(youtubeResources)
      .values({
        ...resourceData,
        ownerId,
      })
      .returning();
    return resource;
  }

  async updateYoutubeResource(id: number, resourceData: Partial<InsertYoutubeResource>, ownerId?: string): Promise<YoutubeResource> {
    if (ownerId && ownerId !== 'mohit') {
      const [resource] = await db
        .update(youtubeResources)
        .set({
          ...resourceData,
          updatedAt: new Date(),
        })
        .where(and(eq(youtubeResources.id, id), eq(youtubeResources.ownerId, ownerId)))
        .returning();
      return resource;
    } else {
      const [resource] = await db
        .update(youtubeResources)
        .set({
          ...resourceData,
          updatedAt: new Date(),
        })
        .where(eq(youtubeResources.id, id))
        .returning();
      return resource;
    }
  }

  async deleteYoutubeResource(id: number, ownerId?: string): Promise<void> {
    if (ownerId && ownerId !== 'mohit') {
      await db.update(youtubeResources).set({ isActive: false })
        .where(and(eq(youtubeResources.id, id), eq(youtubeResources.ownerId, ownerId)));
    } else {
      await db.update(youtubeResources).set({ isActive: false }).where(eq(youtubeResources.id, id));
    }
  }

  // Contact message operations
  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async createContactMessage(messageData: InsertContactMessage): Promise<ContactMessage> {
    const [message] = await db
      .insert(contactMessages)
      .values(messageData)
      .returning();
    return message;
  }

  async markMessageAsRead(id: number): Promise<void> {
    await db.update(contactMessages).set({ isRead: true }).where(eq(contactMessages.id, id));
  }

  // User permissions management
  async updateUserPermissions(id: string, permissions: string[]): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ permissions, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }

  // Order operations
  async createOrder(orderData: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(orderData)
      .returning();
    return order;
  }

  async getOrders(sellerId?: string): Promise<Order[]> {
    if (sellerId) {
      return await db.select().from(orders)
        .where(eq(orders.sellerId, sellerId))
        .orderBy(desc(orders.createdAt));
    }
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrder(orderId: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.orderId, orderId));
    return order;
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    const [order] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.orderId, orderId))
      .returning();

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  }

  // Seller message operations
  async createSellerMessage(messageData: InsertSellerMessage): Promise<SellerMessage> {
    const [message] = await db
      .insert(sellerMessages)
      .values(messageData)
      .returning();
    return message;
  }

  async getSellerMessages(sellerId: string): Promise<SellerMessage[]> {
    return await db.select().from(sellerMessages)
      .where(eq(sellerMessages.sellerId, sellerId))
      .orderBy(desc(sellerMessages.createdAt));
  }

  async markSellerMessageAsRead(id: number): Promise<void> {
    await db.update(sellerMessages).set({ isRead: true }).where(eq(sellerMessages.id, id));
  }

  async getUnreadMessageCount(sellerId: string): Promise<number> {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(sellerMessages)
      .where(and(eq(sellerMessages.sellerId, sellerId), eq(sellerMessages.isRead, false)));
    return result.count;
  }

  // Announcement operations
  async getAnnouncements(): Promise<Announcement[]> {
    const result = await db
      .select()
      .from(announcements)
      .orderBy(desc(announcements.priority), desc(announcements.createdAt));
    
    return result;
  }

  async getActiveAnnouncements(): Promise<Announcement[]> {
    const now = new Date();
    const result = await db
      .select()
      .from(announcements)
      .where(
        and(
          eq(announcements.isActive, true),
          or(
            isNull(announcements.expiresAt),
            gt(announcements.expiresAt, now)
          )
        )
      )
      .orderBy(desc(announcements.priority), desc(announcements.createdAt));
    
    return result;
  }

  async createAnnouncement(announcementData: InsertAnnouncement): Promise<Announcement> {
    const [announcement] = await db
      .insert(announcements)
      .values(announcementData)
      .returning();
    
    return announcement;
  }

  async updateAnnouncement(id: number, announcementData: Partial<InsertAnnouncement>): Promise<Announcement> {
    const [announcement] = await db
      .update(announcements)
      .set({ ...announcementData, updatedAt: new Date() })
      .where(eq(announcements.id, id))
      .returning();
    
    if (!announcement) {
      throw new Error("Announcement not found");
    }
    
    return announcement;
  }

  async deleteAnnouncement(id: number): Promise<void> {
    await db.delete(announcements).where(eq(announcements.id, id));
  }
}

export const storage = new DatabaseStorage();
