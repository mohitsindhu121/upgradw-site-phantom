import {
  users,
  products,
  youtubeResources,
  contactMessages,
  type User,
  type UpsertUser,
  type Product,
  type InsertProduct,
  type YoutubeResource,
  type InsertYoutubeResource,
  type ContactMessage,
  type InsertContactMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, like, or, desc } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Product operations
  getProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;

  // YouTube resource operations
  getYoutubeResources(): Promise<YoutubeResource[]>;
  getYoutubeResourcesByCategory(category: string): Promise<YoutubeResource[]>;
  getYoutubeResource(id: number): Promise<YoutubeResource | undefined>;
  createYoutubeResource(resource: InsertYoutubeResource): Promise<YoutubeResource>;
  updateYoutubeResource(id: number, resource: Partial<InsertYoutubeResource>): Promise<YoutubeResource>;
  deleteYoutubeResource(id: number): Promise<void>;

  // Contact message operations
  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markMessageAsRead(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
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

  // Product operations
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.isActive, true)).orderBy(desc(products.createdAt));
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products)
      .where(eq(products.category, category))
      .orderBy(desc(products.createdAt));
  }

  async searchProducts(query: string): Promise<Product[]> {
    const searchTerm = `%${query}%`;
    return await db.select().from(products)
      .where(
        or(
          like(products.name, searchTerm),
          like(products.productId, searchTerm),
          like(products.description, searchTerm)
        )
      )
      .orderBy(desc(products.createdAt));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
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
        updatedAt: new Date(),
      })
      .returning();
    return product;
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product> {
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

  async deleteProduct(id: number): Promise<void> {
    await db.update(products).set({ isActive: false }).where(eq(products.id, id));
  }

  // YouTube resource operations
  async getYoutubeResources(): Promise<YoutubeResource[]> {
    return await db.select().from(youtubeResources)
      .where(eq(youtubeResources.isActive, true))
      .orderBy(desc(youtubeResources.createdAt));
  }

  async getYoutubeResourcesByCategory(category: string): Promise<YoutubeResource[]> {
    return await db.select().from(youtubeResources)
      .where(eq(youtubeResources.category, category))
      .orderBy(desc(youtubeResources.createdAt));
  }

  async getYoutubeResource(id: number): Promise<YoutubeResource | undefined> {
    const [resource] = await db.select().from(youtubeResources).where(eq(youtubeResources.id, id));
    return resource;
  }

  async createYoutubeResource(resourceData: InsertYoutubeResource): Promise<YoutubeResource> {
    const [resource] = await db
      .insert(youtubeResources)
      .values({
        ...resourceData,
        updatedAt: new Date(),
      })
      .returning();
    return resource;
  }

  async updateYoutubeResource(id: number, resourceData: Partial<InsertYoutubeResource>): Promise<YoutubeResource> {
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

  async deleteYoutubeResource(id: number): Promise<void> {
    await db.update(youtubeResources).set({ isActive: false }).where(eq(youtubeResources.id, id));
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
}

export const storage = new DatabaseStorage();
