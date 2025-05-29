import type { Express, RequestHandler } from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import { storage } from "./storage";

declare module 'express-session' {
  interface SessionData {
    isAuthenticated?: boolean;
    user?: { id: string; username: string };
  }
}

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const MemoryStoreSession = MemoryStore(session);

  return session({
    store: new MemoryStoreSession({
      checkPeriod: sessionTtl, // prune expired entries every 24h
    }),
    secret: process.env.SESSION_SECRET || "default-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.use(getSession());

  // Simple login endpoint
  app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
      // Check if user exists in database by username
      const user = await storage.getUserByUsername ? await storage.getUserByUsername(username) : await storage.getUser(username);
      
      console.log('Login attempt:', { username, password, user: user ? { id: user.id, username: user.username, hasPassword: !!user.password } : 'not found' });
      
      if (user && user.password === password) {
        (req.session as any).isAuthenticated = true;
        (req.session as any).user = { id: user.id, username: user.username, role: user.role };
        res.json({ success: true, user: { username: user.username, role: user.role } });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  // Get current user
  app.get('/api/auth/user', async (req, res) => {
    if ((req.session as any).isAuthenticated) {
      res.json((req.session as any).user);
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  });

  // Logout endpoint
  app.post('/api/logout', async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ message: "Could not log out" });
      } else {
        res.json({ success: true });
      }
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  if ((req.session as any).isAuthenticated) {
    (req as any).user = (req.session as any).user;
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};