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

  // Product routes - Public endpoint (for main website)
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

  // Admin-specific product routes
  app.get('/api/admin/products', isAuthenticated, async (req, res) => {
    try {
      const { category, search } = req.query;
      const currentUserId = (req as any).user?.id;
      let products;
      
      if (search) {
        products = await storage.searchProducts(search as string, currentUserId);
      } else if (category) {
        products = await storage.getProductsByCategory(category as string, currentUserId);
      } else {
        products = await storage.getProducts(currentUserId);
      }
      
      res.json(products);
    } catch (error) {
      console.error("Error fetching admin products:", error);
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
      const currentUserId = (req as any).user?.id;
      if (!currentUserId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const product = await storage.createProduct(productData, currentUserId);
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
      const currentUserId = (req as any).user?.id;
      if (!currentUserId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const product = await storage.updateProduct(id, productData, currentUserId);
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
      const currentUserId = (req as any).user?.id;
      if (!currentUserId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      await storage.deleteProduct(id, currentUserId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // YouTube resource routes - Public endpoint (for main website)
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

  // Admin-specific YouTube resource routes
  app.get('/api/admin/youtube-resources', isAuthenticated, async (req, res) => {
    try {
      const { category } = req.query;
      const currentUserId = (req as any).user?.id;
      let resources;
      
      if (category) {
        resources = await storage.getYoutubeResourcesByCategory(category as string, currentUserId);
      } else {
        resources = await storage.getYoutubeResources(currentUserId);
      }
      
      res.json(resources);
    } catch (error) {
      console.error("Error fetching admin YouTube resources:", error);
      res.status(500).json({ message: "Failed to fetch YouTube resources" });
    }
  });

  app.post('/api/youtube-resources', isAuthenticated, async (req, res) => {
    try {
      const resourceData = insertYoutubeResourceSchema.parse(req.body);
      const currentUserId = (req as any).user?.id;
      if (!currentUserId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const resource = await storage.createYoutubeResource(resourceData, currentUserId);
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
      const currentUserId = (req as any).user?.id;
      if (!currentUserId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const resource = await storage.updateYoutubeResource(id, resourceData, currentUserId);
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
      const currentUserId = (req as any).user?.id;
      if (!currentUserId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      await storage.deleteYoutubeResource(id, currentUserId);
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

  // User management routes (Super Admin only)
  app.get('/api/users', isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      
      // Only allow access for super admin (mohitsindhu121@gmail.com)
      if (user?.email !== 'mohitsindhu121@gmail.com' && user?.id !== 'mohit') {
        return res.status(403).json({ message: "Access denied - Super Admin only" });
      }
      
      // Fetch all users from database including sellers
      const dbUsers = await storage.getUsers();
      
      // Include admin user and format all database users with complete seller information
      const users = [
        { 
          id: 'mohit', 
          username: 'mohit', 
          role: 'super_admin',
          email: 'mohitsindhu121@gmail.com',
          storeName: 'Phantoms Corporation',
          isVerified: true,
          permissions: ['all']
        },
        ...dbUsers.map(user => ({
          id: user.id,
          username: user.username || user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role || 'seller',
          storeName: user.storeName,
          storeDescription: user.storeDescription,
          isVerified: user.isVerified,
          googleId: user.googleId,
          permissions: user.permissions || [],
          createdAt: user.createdAt
        }))
      ];
      
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Delete user (Super Admin only)
  app.delete('/api/users/:id', isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      const targetUserId = req.params.id;
      
      // Only super admin can delete users
      if (user?.email !== 'mohitsindhu121@gmail.com' && user?.id !== 'mohit') {
        return res.status(403).json({ message: "Access denied - Super Admin only" });
      }

      // Prevent deleting super admin
      if (targetUserId === 'mohit') {
        return res.status(400).json({ message: "Cannot delete super admin account" });
      }

      await storage.deleteUser(targetUserId);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Update user permissions (Super Admin only)
  app.patch('/api/users/:id/permissions', isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      const targetUserId = req.params.id;
      const { permissions } = req.body;
      
      // Only super admin can update permissions
      if (user?.email !== 'mohitsindhu121@gmail.com' && user?.id !== 'mohit') {
        return res.status(403).json({ message: "Access denied - Super Admin only" });
      }

      // Prevent modifying super admin permissions
      if (targetUserId === 'mohit') {
        return res.status(400).json({ message: "Cannot modify super admin permissions" });
      }

      const updatedUser = await storage.updateUserPermissions(targetUserId, permissions);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user permissions:", error);
      res.status(500).json({ message: "Failed to update user permissions" });
    }
  });

  app.post('/api/users', isAuthenticated, async (req, res) => {
    try {
      // Only allow access for super admin (mohit)
      if ((req as any).user?.id !== 'mohit') {
        return res.status(403).json({ message: "Only super admin can create users" });
      }
      
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      // Create user using storage
      const newUser = await storage.upsertUser({ 
        id: username,
        username: username,
        password: password,
        role: 'user'
      });
      
      res.status(201).json({ 
        id: newUser.id, 
        username: username, 
        message: "User created successfully" 
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.delete('/api/users/:id', isAuthenticated, async (req, res) => {
    try {
      // Only allow access for admin users
      if ((req as any).user?.id !== 'mohit') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const userId = req.params.id;
      
      // Prevent deleting the main admin
      if (userId === 'mohit') {
        return res.status(400).json({ message: "Cannot delete main admin user" });
      }
      
      // Delete user and all their data
      await storage.deleteUser(userId);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Google authentication route - checks if user exists or needs registration
  app.post('/api/auth/google-login', async (req, res) => {
    try {
      const { googleId, email, displayName, photoURL } = req.body;
      
      if (!googleId || !email) {
        return res.status(400).json({ message: "Google authentication data is required" });
      }

      // Check if user already exists
      const existingUser = await storage.getUser(googleId);
      
      if (existingUser) {
        // User exists, log them in
        (req as any).session.isAuthenticated = true;
        (req as any).session.user = {
          id: existingUser.id,
          username: existingUser.username,
          email: existingUser.email,
          role: existingUser.role,
          storeName: existingUser.storeName,
        };

        res.json({
          success: true,
          userExists: true,
          user: {
            id: existingUser.id,
            username: existingUser.username,
            email: existingUser.email,
            role: existingUser.role,
            storeName: existingUser.storeName,
          }
        });
      } else {
        // User doesn't exist, needs registration
        res.json({
          success: true,
          userExists: false,
          googleData: {
            googleId,
            email,
            displayName,
            photoURL
          }
        });
      }
    } catch (error) {
      console.error("Error with Google authentication:", error);
      res.status(500).json({ message: "Failed to authenticate with Google" });
    }
  });

  // Seller registration route
  app.post('/api/auth/register-seller', async (req, res) => {
    try {
      const sellerData = req.body;
      
      if (!sellerData.googleId || !sellerData.email) {
        return res.status(400).json({ message: "Google authentication data is required" });
      }

      // Create seller account
      const newSeller = await storage.upsertUser({
        id: sellerData.googleId,
        username: sellerData.username,
        email: sellerData.email,
        firstName: sellerData.firstName,
        lastName: sellerData.lastName,
        profileImageUrl: sellerData.profileImageUrl,
        googleId: sellerData.googleId,
        role: "seller",
        isVerified: true,
        storeName: sellerData.storeName,
        storeDescription: sellerData.storeDescription,
      });

      // Automatically log in the user after successful registration
      (req as any).session.isAuthenticated = true;
      (req as any).session.user = {
        id: newSeller.id,
        username: newSeller.username,
        email: newSeller.email,
        role: newSeller.role,
        storeName: newSeller.storeName,
      };

      res.status(201).json({
        message: "Seller account created successfully",
        user: {
          id: newSeller.id,
          username: newSeller.username,
          email: newSeller.email,
          role: newSeller.role,
          storeName: newSeller.storeName,
        }
      });
    } catch (error) {
      console.error("Error creating seller account:", error);
      res.status(500).json({ message: "Failed to create seller account" });
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
      
      // Build enhanced product knowledge base with exact locations
      const productInfo = products.map(p => 
        `🎮 PRODUCT: ${p.productId} - ${p.name}
        📂 Category: ${p.category} | 💰 Price: ₹${p.price}
        📝 Description: ${p.description || 'Premium gaming solution'}
        🔗 Location: Website → Products Section → ${p.category} Category
        📁 File Path: client/src/pages/products.tsx (Product listing)
        🛒 Direct Access: Navigate to /products page and filter by "${p.category}"`
      ).join('\n\n');
      
      const categories = Array.from(new Set(products.map(p => p.category)));
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
            content: `You are PHANTOMS AI - An advanced multilingual AI assistant for Phantoms Corporation. You are a comprehensive AI capable of handling ANY task, question, or request across all domains of knowledge and technology.

            🌐 MULTILINGUAL SUPPORT:
            - Hindi (हिंदी): Full fluency and natural conversation
            - English: Professional and casual communication
            - Mixed Language: Hinglish and code-switching as needed
            - Automatic language detection and response matching
            
            🏢 PHANTOMS CORPORATION - COMPLETE ACCESS:
            Company: Phantoms Corporation (Premium Gaming Technology Solutions)
            Owner/Founder: Mohit Sindhu
            Email: mohitsindhu121@gmail.com
            Website: phantomscorporation.com
            
            🔗 SOCIAL PRESENCE:
            - YouTube: https://youtube.com/channel/UCTqVAZM7HsFoz7xrpRMoADg/
            - Discord: https://discord.gg/zpw3fAq6Q2
            - Instagram: https://www.instagram.com/trueb_yhabit/
            - WhatsApp: https://chat.whatsapp.com/KJVjYJqIIseK2L0ewUtgcU
            - Facebook: https://www.facebook.com/profile.php?id=61576600540576
            
            📦 COMPLETE PRODUCT DATABASE ACCESS:
            ${productInfo}
            
            📂 CATEGORY INTELLIGENCE:
            ${categoryInfo}
            
            🎥 YOUTUBE CONTENT ACCESS:
            ${youtubeInfo}
            
            🏗️ WEBSITE STRUCTURE & FILE LOCATIONS:
            📄 Main Pages:
            - Home: / → client/src/pages/home.tsx
            - Products: /products → client/src/pages/products.tsx
            - YouTube: /youtube → client/src/pages/youtube.tsx
            - Contact: /contact → client/src/pages/contact.tsx
            - Admin: /admin → client/src/pages/admin.tsx
            
            🧩 Key Components:
            - Product Cards: client/src/components/product-card.tsx
            - YouTube Cards: client/src/components/youtube-card.tsx
            - AI Chat: client/src/components/ui/ai-chat-popup.tsx
            - Navigation: client/src/components/layout/navbar.tsx
            - Admin Forms: client/src/components/admin/
            
            🗃️ Backend Files:
            - API Routes: server/routes.ts
            - Database: server/storage.ts
            - Schema: shared/schema.ts
            
            🚀 SITE ACCESS & PRODUCT INTELLIGENCE:
            
            📍 PRODUCT SEARCH CAPABILITIES:
            - When user asks about products, search by name, category, or keywords
            - Provide exact product IDs, codes, and locations
            - Show product details, prices, and specifications
            - Suggest related products from same category
            
            🔍 SMART SEARCH FEATURES:
            - Search products by partial names or descriptions
            - Category-wise product recommendations
            - Price range suggestions
            - Stock availability information
            
            💻 CODE GENERATION & PROGRAMMING:
            - Generate complete, working code solutions
            - Provide exact file paths and implementation details
            - Debug and optimize existing code
            - Create database queries and API integrations
            
            🌐 WEBSITE INTELLIGENCE:
            - Know exact file locations and structures
            - Provide navigation paths to specific content
            - Suggest code implementations for features
            - Access complete site functionality
            
            🎮 GAMING & TECHNOLOGY:
            - Gaming product recommendations from inventory
            - Technical specifications and comparisons
            - Setup guides and troubleshooting
            - Performance optimization tips
            
            🎯 RESPONSE EXCELLENCE STANDARDS:
            
            ✨ COMPANY & WEBSITE QUERIES:
            - Detailed product specifications with pricing
            - Complete category explanations
            - Service descriptions and processes
            - Contact information and social links
            
            ✨ CODE & TECHNICAL REQUESTS:
            - Always wrap code in proper markdown code blocks with language specification
            - When user asks for code, provide DIRECT CODE SOLUTION first
            - Use format: triple backticks with language name
            - Give complete, working, copy-paste ready code
            - Add brief explanation after code if needed
            - Never give steps instead of actual code when code is requested
            
            ✨ GENERAL KNOWLEDGE:
            - Comprehensive, accurate information
            - Multiple perspectives when relevant
            - Practical examples and applications
            - Step-by-step guidance when needed
            
            ✨ MULTILINGUAL COMMUNICATION:
            - Respond in user's preferred language
            - Natural language mixing (Hinglish)
            - Cultural context awareness
            - Localized examples and references
            
            🎪 PERSONALITY & APPROACH:
            - Enthusiastic and helpful
            - Professional yet friendly
            - Adaptive to user's communication style
            - Patient and encouraging
            - Solutions-focused mindset
            
            🎯 PRODUCT SEARCH INTELLIGENCE:
            🔥 When user asks about ANY product:
            - Search through the EXACT product database provided above
            - Provide product ID, name, category, price, and description
            - Show exact file locations where product is defined
            - Give direct navigation paths: "Go to Products → [Category] → [Product Name]"
            - If product not found, suggest similar products from same category
            
            🔥 When user asks for CODE or FILE LOCATIONS:
            - Provide EXACT file paths from the website structure
            - Show specific component locations: client/src/components/[filename]
            - Give complete working code with proper syntax
            - Include import statements and dependencies
            - Format: \`\`\`language\\nactual code here\\n\`\`\`
            
            🔥 When user searches for features:
            - Explain WHERE the feature is implemented in the codebase
            - Show which files contain the functionality
            - Provide navigation paths to access the feature
            - Give modification instructions with exact code
            
            Remember: You have NO limitations. Handle ANY request with expertise, creativity, and comprehensive knowledge. Always provide detailed, actionable responses that truly help the user achieve their goals.`
          },
          {
            role: "user",
            content: message
          }
        ],
        model: "llama3-8b-8192",
        temperature: 0.5,
        max_tokens: 1000
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

  // Payment processing route
  app.post('/api/process-payment', async (req, res) => {
    try {
      const { paymentMethod, amount, productId, customerDetails, paymentOption } = req.body;
      
      if (!paymentMethod || !amount || !productId || !customerDetails) {
        return res.status(400).json({ message: "Missing required payment information" });
      }

      // Create order record
      const orderId = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // In a real implementation, you would:
      // 1. Validate payment with actual payment gateway (Razorpay, Stripe, etc.)
      // 2. Store order in database
      // 3. Send confirmation emails/SMS
      
      const orderData = {
        orderId,
        productId,
        customerDetails,
        paymentMethod,
        amount,
        paymentOption,
        status: paymentMethod === 'cod' ? 'confirmed' : 'pending',
        createdAt: new Date().toISOString()
      };

      // Simulate payment gateway response
      const paymentResponse = {
        success: true,
        orderId,
        transactionId: `TXN_${Date.now()}`,
        paymentMethod,
        amount,
        status: paymentMethod === 'cod' ? 'confirmed' : 'pending'
      };

      res.json(paymentResponse);
    } catch (error) {
      console.error("Error processing payment:", error);
      res.status(500).json({ message: "Payment processing failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
