import type { Express, RequestHandler } from "express";
import session from "express-session";
import MemoryStore from "memorystore";

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
    
    if (username === 'mohit' && password === '1') {
      (req.session as any).isAuthenticated = true;
      (req.session as any).user = { id: 'mohit', username: 'mohit' };
      res.json({ success: true, user: { username: 'mohit' } });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
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