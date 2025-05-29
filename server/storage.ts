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
import { eq, like, or, desc, and, ilike, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  upsertUser(user: UpsertUser): Promise<User>;
  deleteUser(id: string): Promise<void>;

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
    // Super admin (mohit) sees all products, public users see all
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
