const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Sale = require('../models/Sale');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Seed] Connected to MongoDB Atlas...');

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Customer.deleteMany();
    await Sale.deleteMany();

    console.log('[Seed] Cleared existing collection data.');

    // 1. Create Users
    const admin = await User.create({
      name: 'Admin Demo User',
      email: 'admin@salesapp.com',
      password: 'admin123',
      role: 'Admin',
    });

    const salesUser = await User.create({
      name: 'Sales Agent Demo',
      email: 'sales@salesapp.com',
      password: 'sales123',
      role: 'Sales User',
    });

    console.log('[Seed] Created Admin & Sales Users.');

    // 2. Create Products
    const products = await Product.insertMany([
      {
        name: 'Wireless Noise-Canceling Headphones',
        category: 'Electronics',
        price: 199.99,
        status: 'In Stock',
        createdBy: admin._id,
      },
      {
        name: 'Ergonomic Standing Office Desk',
        category: 'Furniture',
        price: 449.00,
        status: 'In Stock',
        createdBy: admin._id,
      },
      {
        name: 'Ultra-Wide 34-Inch Gaming Monitor',
        category: 'Electronics',
        price: 599.50,
        status: 'In Stock',
        createdBy: admin._id,
      },
      {
        name: 'Mechanical RGB Keyboard',
        category: 'Accessories',
        price: 89.99,
        status: 'In Stock',
        createdBy: admin._id,
      },
      {
        name: 'Leather Executive Chair',
        category: 'Furniture',
        price: 249.00,
        status: 'Out of Stock',
        createdBy: admin._id,
      },
    ]);

    console.log('[Seed] Created 5 initial products.');

    // 3. Create Customers
    const customers = await Customer.insertMany([
      {
        name: 'Acme Corporation',
        email: 'billing@acme.com',
        phone: '+1 (555) 123-4567',
        status: 'Active',
        createdBy: admin._id,
      },
      {
        name: 'TechStart Innovations',
        email: 'orders@techstart.io',
        phone: '+1 (555) 987-6543',
        status: 'Active',
        createdBy: admin._id,
      },
      {
        name: 'Global Solutions Ltd',
        email: 'procurement@globalsolutions.com',
        phone: '+1 (555) 456-7890',
        status: 'Active',
        createdBy: admin._id,
      },
      {
        name: 'Apex Design Studio',
        email: 'contact@apexdesign.co',
        phone: '+1 (555) 321-7654',
        status: 'Active',
        createdBy: admin._id,
      },
    ]);

    console.log('[Seed] Created 4 initial customers.');

    // 4. Create Sales Orders
    await Sale.insertMany([
      {
        orderNumber: 'ORD-1001',
        customer: customers[0]._id,
        items: [
          {
            product: products[0]._id,
            name: products[0].name,
            price: products[0].price,
            quantity: 2,
            subtotal: products[0].price * 2,
          },
          {
            product: products[3]._id,
            name: products[3].name,
            price: products[3].price,
            quantity: 1,
            subtotal: products[3].price * 1,
          },
        ],
        totalAmount: products[0].price * 2 + products[3].price * 1,
        salesperson: admin._id,
        status: 'Completed',
      },
      {
        orderNumber: 'ORD-1002',
        customer: customers[1]._id,
        items: [
          {
            product: products[1]._id,
            name: products[1].name,
            price: products[1].price,
            quantity: 1,
            subtotal: products[1].price * 1,
          },
          {
            product: products[2]._id,
            name: products[2].name,
            price: products[2].price,
            quantity: 1,
            subtotal: products[2].price * 1,
          },
        ],
        totalAmount: products[1].price * 1 + products[2].price * 1,
        salesperson: salesUser._id,
        status: 'Completed',
      },
      {
        orderNumber: 'ORD-1003',
        customer: customers[2]._id,
        items: [
          {
            product: products[0]._id,
            name: products[0].name,
            price: products[0].price,
            quantity: 1,
            subtotal: products[0].price * 1,
          },
        ],
        totalAmount: products[0].price * 1,
        salesperson: salesUser._id,
        status: 'Pending',
      },
    ]);

    console.log('[Seed] Created initial sales orders and populated dashboard data.');
    console.log('[Seed] Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error]: ${error.message}`);
    process.exit(1);
  }
};

seedData();
