import { User, InsertUser, Product, Order, OrderItem } from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Products
  getProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;

  // Orders
  createOrder(userId: number, total: number): Promise<Order>;
  addOrderItem(orderId: number, productId: number, quantity: number, price: number): Promise<OrderItem>;
  getOrdersByUser(userId: number): Promise<Order[]>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  updateOrderStatus(orderId: number, status: string): Promise<Order>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private currentId: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.currentId = { users: 1, products: 1, orders: 1, orderItems: 1 };

    // Add sample products
    const sampleProducts: Product[] = [
      {
        id: this.currentId.products++,
        name: "Fresh Bananas",
        description: "Bundle of fresh yellow bananas",
        price: 299,
        image: "https://images.unsplash.com/photo-1607977027972-e2aae2b5b1e0",
        category: "Fruits",
        inStock: true
      },
      {
        id: this.currentId.products++,
        name: "Organic Vegetables",
        description: "Mixed organic vegetables",
        price: 499,
        image: "https://images.unsplash.com/photo-1581515286348-98549702050f",
        category: "Vegetables",
        inStock: true
      },
      // Add more sample products here
    ];

    sampleProducts.forEach(product => this.products.set(product.id, product));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.category.toLowerCase() === category.toLowerCase()
    );
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  // Order methods
  async createOrder(userId: number, total: number): Promise<Order> {
    const id = this.currentId.orders++;
    const order: Order = {
      id,
      userId,
      status: "pending",
      total,
      createdAt: new Date()
    };
    this.orders.set(id, order);
    return order;
  }

  async addOrderItem(orderId: number, productId: number, quantity: number, price: number): Promise<OrderItem> {
    const id = this.currentId.orderItems++;
    const orderItem: OrderItem = { id, orderId, productId, quantity, price };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(item => item.orderId === orderId);
  }

  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    const order = this.orders.get(orderId);
    if (!order) throw new Error("Order not found");
    
    const updatedOrder = { ...order, status };
    this.orders.set(orderId, updatedOrder);
    return updatedOrder;
  }
}

export const storage = new MemStorage();
