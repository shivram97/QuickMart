import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  // Products
  app.get("/api/products", async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get("/api/products/category/:category", async (req, res) => {
    const products = await storage.getProductsByCategory(req.params.category);
    res.json(products);
  });

  // Auth
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      req.session.userId = user.id;
      res.json({ id: user.id, username: user.username });
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await storage.getUserByUsername(username);
    
    if (user && user.password === password) {
      req.session.userId = user.id;
      res.json({ id: user.id, username: user.username });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // Orders
  app.post("/api/orders", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const orderSchema = z.object({
      total: z.number(),
      items: z.array(z.object({
        productId: z.number(),
        quantity: z.number(),
        price: z.number()
      }))
    });

    try {
      const { total, items } = orderSchema.parse(req.body);
      const order = await storage.createOrder(req.session.userId, total);
      
      for (const item of items) {
        await storage.addOrderItem(
          order.id,
          item.productId,
          item.quantity,
          item.price
        );
      }

      res.json(order);
    } catch (error) {
      res.status(400).json({ error: "Invalid order data" });
    }
  });

  app.get("/api/orders", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const orders = await storage.getOrdersByUser(req.session.userId);
    res.json(orders);
  });

  return httpServer;
}
