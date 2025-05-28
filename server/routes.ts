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
        return res.status(400).json({ message: "Message is required" });
      }

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            {
              role: 'system',
              content: `You are a helpful AI assistant for Mohit Corporation, a gaming technology company. You help customers with:
              - Gaming panels and software
              - Gaming bots and automation tools
              - Website development services
              - YouTube services and content creation tools
              
              Be friendly, knowledgeable, and helpful. Always mention relevant products when appropriate. Keep responses concise but informative. If asked about pricing or specific details, suggest contacting support for the latest information.`
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('Groq API request failed');
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || "I'm sorry, I couldn't process your request right now. Please try again or contact our support team!";

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
