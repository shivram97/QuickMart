import { 
  User, InsertUser, Product, InsertProduct, 
  Order, InsertOrder, OrderItem 
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Orders
  getOrders(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private currentId: { users: number; products: number; orders: number; };

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.currentId = { users: 1, products: 1, orders: 1 };

    // Add sample products
    const sampleProducts: InsertProduct[] = [
      {
        name: "Fresh Organic Bananas",
        description: "Sweet and nutritious organic bananas, perfect for snacking",
        price: 299,
        imageUrl: "https://images.unsplash.com/photo-1607977027972-e2aae2b5b1e0",
        category: "Fruits",
        stock: 100
      },
      {
        name: "Fresh Tomatoes",
        description: "Ripe and juicy tomatoes perfect for salads and cooking",
        price: 199,
        imageUrl: "https://images.unsplash.com/photo-1606237906294-ae86d103d715",
        category: "Vegetables",
        stock: 150
      },
      {
        name: "Whole Grain Bread",
        description: "Freshly baked whole grain bread",
        price: 399,
        imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff",
        category: "Bakery",
        stock: 50
      }
    ];

    sampleProducts.forEach(product => this.createProduct(product));
  }

  // User Methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Product Methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category === category
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentId.products++;
    const product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  // Order Methods
  async getOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId
    );
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentId.orders++;
    const order = { ...insertOrder, id, createdAt: new Date() };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const order = await this.getOrder(id);
    if (!order) throw new Error("Order not found");
    
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
}

export const storage = new MemStorage();
