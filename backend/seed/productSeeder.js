import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();

const products = [
  {
    name: 'Organic Banana Bunch',
    description: 'Fresh organic bananas, perfect for snacks and smoothies.',
    price: 4.5,
    category: 'Fruits & Vegetables',
    brand: 'Fresh Market',
    image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=800',
    stock: 50,
    rating: 4.7,
    numReviews: 21
  },
  {
    name: 'Avocado Pack',
    description: 'Creamy avocados supplied in a convenient four pack.',
    price: 8.99,
    category: 'Fruits & Vegetables',
    brand: 'Fresh Market',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800',
    stock: 35,
    rating: 4.8,
    numReviews: 18
  },
  {
    name: 'Wireless Headphones',
    description: 'Noise-isolating wireless headphones with long battery life.',
    price: 129.99,
    category: 'Electronics',
    brand: 'SoundPro',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    stock: 20,
    rating: 4.5,
    numReviews: 44
  },
  {
    name: 'Smart Watch',
    description: 'Track workouts, notifications and sleep from your wrist.',
    price: 199.0,
    category: 'Electronics',
    brand: 'Pulse',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
    stock: 15,
    rating: 4.4,
    numReviews: 36
  },
  {
    name: 'Cotton Hoodie',
    description: 'Comfortable everyday hoodie with a relaxed fit.',
    price: 59.99,
    category: 'Clothing',
    brand: 'Urban Basics',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
    stock: 40,
    rating: 4.2,
    numReviews: 14
  },
  {
    name: 'Ceramic Coffee Mug',
    description: 'Minimal ceramic mug for home or office coffee rituals.',
    price: 14.99,
    category: 'Home & Kitchen',
    brand: 'Casa',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800',
    stock: 60,
    rating: 4.6,
    numReviews: 25
  }
];

const seed = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Cart.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'Admin123!',
      role: 'admin'
    });

    await Product.insertMany(products);

    console.log('Seed complete. Admin login: admin@example.com / Admin123!');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
