import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./simpleAuth";
import { insertProductSchema, insertYoutubeResourceSchema, insertContactMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes are handled in setupAuth

  // Product routes
  app.get('/api/products', async (req, res) => {
    try {
      const { category, search } = req.query;
      let products;
      
      if (search) {
        products = await storage.searchProducts(search as string);
      } else if (category) {
        products = await storage.getProductsByCategory(category as string);
      } else {
        products = await storage.getProducts();
      }
      
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post('/api/products', isAuthenticated, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put('/api/products/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const productData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, productData);
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete('/api/products/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProduct(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // YouTube resource routes
  app.get('/api/youtube-resources', async (req, res) => {
    try {
      const { category } = req.query;
      let resources;
      
      if (category) {
        resources = await storage.getYoutubeResourcesByCategory(category as string);
      } else {
        resources = await storage.getYoutubeResources();
      }
      
      res.json(resources);
    } catch (error) {
      console.error("Error fetching YouTube resources:", error);
      res.status(500).json({ message: "Failed to fetch YouTube resources" });
    }
  });

  app.post('/api/youtube-resources', isAuthenticated, async (req, res) => {
    try {
      const resourceData = insertYoutubeResourceSchema.parse(req.body);
      const resource = await storage.createYoutubeResource(resourceData);
      res.status(201).json(resource);
    } catch (error) {
      console.error("Error creating YouTube resource:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create YouTube resource" });
    }
  });

  app.put('/api/youtube-resources/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const resourceData = insertYoutubeResourceSchema.partial().parse(req.body);
      const resource = await storage.updateYoutubeResource(id, resourceData);
      res.json(resource);
    } catch (error) {
      console.error("Error updating YouTube resource:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update YouTube resource" });
    }
  });

  app.delete('/api/youtube-resources/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteYoutubeResource(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting YouTube resource:", error);
      res.status(500).json({ message: "Failed to delete YouTube resource" });
    }
  });

  // Contact message routes
  app.get('/api/contact-messages', isAuthenticated, async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });

  app.post('/api/contact-messages', async (req, res) => {
    try {
      const messageData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      console.error("Error creating contact message:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create contact message" });
    }
  });

  app.patch('/api/contact-messages/:id/read', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.markMessageAsRead(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  // AI Chat route
  app.post('/api/ai-chat', async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ response: "Message is required" });
      }

      // Get current products and YouTube resources for context
      const products = await storage.getProducts();
      const youtubeResources = await storage.getYoutubeResources();
      
      // Build product knowledge base
      const productInfo = products.map(p => 
        `${p.productId}: ${p.name} | Category: ${p.category} | Price: $${p.price} | Description: ${p.description || 'Premium gaming solution'}`
      ).join('\n');
      
      const categories = [...new Set(products.map(p => p.category))];
      const categoryInfo = categories.map(cat => {
        const categoryProducts = products.filter(p => p.category === cat);
        return `${cat.toUpperCase()}: ${categoryProducts.length} products available - ${categoryProducts.map(p => p.productId).join(', ')}`;
      }).join('\n');
      
      const youtubeInfo = youtubeResources.map(y => 
        `${y.title} | Category: ${y.category} | ${y.description || 'Educational content'}`
      ).join('\n');

      // Use Groq AI for intelligent responses
      const Groq = (await import('groq-sdk')).default;
      const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY
      });

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a professional AI assistant for Mohit Corporation, a premium gaming technology company.

            COMPANY INFORMATION:
            - Company Name: Mohit Corporation
            - Owner/Founder: Mohit Sindhu
            - Contact Email: mohitsindhu121@gmail.com
            - Website: mohitcorporation.com
            - Specialization: Gaming technology solutions and digital services
            
            OFFICIAL SOCIAL LINKS:
            - YouTube: https://youtube.com/channel/UCTqVAZM7HsFoz7xrpRMoADg/
            - Discord: https://discord.gg/zpw3fAq6Q2
            - Instagram: https://www.instagram.com/trueb_yhabit/
            - WhatsApp: https://chat.whatsapp.com/KJVjYJqIIseK2L0ewUtgcU
            - Facebook: https://www.facebook.com/profile.php?id=61576600540576
            
            AVAILABLE PRODUCTS:
            ${productInfo}
            
            PRODUCT CATEGORIES:
            ${categoryInfo}
            
            YOUTUBE RESOURCES:
            ${youtubeInfo}
            
            SERVICES WE OFFER:
            - Gaming Control Panels & Management Systems
            - Custom Discord Bots for Gaming Communities  
            - Modern Gaming Websites & Web Applications
            - YouTube Channel Management & Growth Services
            - Gaming Server Hosting & Management
            - Cyberpunk-inspired UI/UX Design
            
            INTELLIGENT RESPONSE CAPABILITIES:
            - When asked about specific product IDs (like MCG-001, MCB-001), provide detailed info including name, category, price, description
            - When asked about categories, explain what products we have in that category and their features
            - When asked about website processes, explain our services and how they work
            - For contact info, provide exact details
            - For general questions, be helpful and informative
            
            RESPONSE GUIDELINES:
            - For product queries: Include product ID, name, category, price, and description
            - For category queries: List available products and explain category purpose
            - For contact info: Use exact provided information
            - For general questions: Keep responses helpful but concise (under 50 words)
            - Always be professional and enthusiastic about our gaming solutions`
          },
          {
            role: "user",
            content: message
          }
        ],
        model: "llama3-8b-8192",
        temperature: 0.3,
        max_tokens: 200
      });

      const aiResponse = chatCompletion.choices[0]?.message?.content || 
        "I'm having trouble processing that right now. Could you please rephrase your question?";

      res.json({ response: aiResponse });
    } catch (error) {
      console.error("Error in AI chat:", error);
      res.status(500).json({ 
        response: "I'm experiencing some technical difficulties. Please try again later or contact our support team directly!" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
