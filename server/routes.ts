import { Express, Request, Response } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertOrderSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express) {
  // Products
  app.get("/api/products", async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get("/api/products/category/:category", async (req, res) => {
    const products = await storage.getProductsByCategory(req.params.category);
    res.json(products);
  });

  app.get("/api/products/:id", async (req, res) => {
    const product = await storage.getProduct(parseInt(req.params.id));
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(product);
  });

  // Orders
  app.post("/api/orders", async (req, res) => {
    try {
      const order = insertOrderSchema.parse(req.body);
      const created = await storage.createOrder(order);
      res.status(201).json(created);
    } catch (error) {
      res.status(400).json({ message: "Invalid order data" });
    }
  });

  app.get("/api/orders", async (req, res) => {
    const userId = parseInt(req.query.userId as string);
    if (!userId) {
      res.status(400).json({ message: "userId is required" });
      return;
    }
    const orders = await storage.getOrders(userId);
    res.json(orders);
  });

  app.get("/api/orders/:id", async (req, res) => {
    const order = await storage.getOrder(parseInt(req.params.id));
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.json(order);
  });

  // Users
  app.post("/api/users", async (req, res) => {
    try {
      const user = insertUserSchema.parse(req.body);
      const created = await storage.createUser(user);
      res.status(201).json(created);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
