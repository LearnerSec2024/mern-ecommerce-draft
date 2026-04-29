import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();

const categoryColours = {
  'Fruits & Vegetables': {
    bg: '#D1FAE5',
    accent: '#10B981',
    emoji: '🥭',
  },
  Electronics: {
    bg: '#DBEAFE',
    accent: '#2563EB',
    emoji: '🎧',
  },
  Clothing: {
    bg: '#FCE7F3',
    accent: '#DB2777',
    emoji: '👟',
  },
  'Home & Kitchen': {
    bg: '#FEF3C7',
    accent: '#D97706',
    emoji: '🏠',
  },
  'Beauty & Personal Care': {
    bg: '#F3E8FF',
    accent: '#9333EA',
    emoji: '✨',
  },
  'Sports & Outdoors': {
    bg: '#DCFCE7',
    accent: '#16A34A',
    emoji: '🏕️',
  },
  'Books & Stationery': {
    bg: '#E0E7FF',
    accent: '#4F46E5',
    emoji: '📚',
  },
  'Toys & Games': {
    bg: '#FFE4E6',
    accent: '#E11D48',
    emoji: '🧩',
  },
};

const imageFor = (name, category) => {
  const colours = categoryColours[category] || {
    bg: '#E5E7EB',
    accent: '#374151',
    emoji: '🛒',
  };

  const safeName = name.replace(/&/g, 'and').replace(/</g, '').replace(/>/g, '');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="520" viewBox="0 0 800 520">
      <rect width="800" height="520" rx="36" fill="${colours.bg}"/>
      <circle cx="650" cy="95" r="95" fill="${colours.accent}" opacity="0.18"/>
      <circle cx="120" cy="430" r="120" fill="${colours.accent}" opacity="0.14"/>
      <rect x="76" y="74" width="648" height="372" rx="32" fill="white" opacity="0.82"/>
      <text x="400" y="205" text-anchor="middle" font-size="92" font-family="Arial, sans-serif">${colours.emoji}</text>
      <text x="400" y="292" text-anchor="middle" font-size="34" font-weight="800" fill="#111827" font-family="Arial, sans-serif">${safeName}</text>
      <text x="400" y="342" text-anchor="middle" font-size="22" font-weight="700" fill="${colours.accent}" font-family="Arial, sans-serif">${category}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const catalogue = {
  'Fruits & Vegetables': {
    brand: 'Fresh Market',
    items: [
      ['Organic Banana Bunch', 4.5, 50],
      ['Avocado Pack', 8.99, 35],
      ['Red Apple Bag', 6.5, 48],
      ['Baby Spinach Box', 5.25, 42],
      ['Cherry Tomato Punnet', 4.99, 55],
      ['Carrot Bunch', 3.75, 60],
      ['Blueberry Tub', 7.99, 30],
      ['Broccoli Crown', 3.99, 44],
      ['Mango Twin Pack', 6.99, 38],
      ['Green Grapes Bag', 7.49, 36],
      ['Sweet Corn Pack', 5.49, 45],
      ['Cucumber Trio', 4.25, 54],
      ['Lettuce Head', 3.49, 58],
      ['Orange Net Bag', 6.25, 43],
      ['Potato Bag', 5.99, 62],
      ['Strawberry Punnet', 8.49, 29],
    ],
  },
  Electronics: {
    brand: 'TechNova',
    items: [
      ['Wireless Headphones', 129.99, 20],
      ['Smart Watch', 199.0, 15],
      ['Bluetooth Speaker', 79.99, 26],
      ['USB-C Fast Charger', 29.99, 70],
      ['Wireless Mouse', 34.99, 45],
      ['Mechanical Keyboard', 119.99, 18],
      ['Laptop Stand', 49.99, 32],
      ['Webcam HD', 59.99, 24],
      ['Portable Power Bank', 44.99, 37],
      ['USB-C Hub', 54.99, 28],
      ['Noise Cancelling Earbuds', 149.99, 22],
      ['Smart Home Plug', 24.99, 51],
      ['Tablet Sleeve', 21.99, 49],
      ['Gaming Mouse Pad', 18.99, 67],
      ['Phone Tripod', 27.99, 42],
      ['Mini Projector', 249.99, 11],
    ],
  },
  Clothing: {
    brand: 'Urban Basics',
    items: [
      ['Cotton Hoodie', 59.99, 40],
      ['Classic T-Shirt', 24.99, 80],
      ['Denim Jacket', 89.99, 22],
      ['Running Shorts', 34.99, 38],
      ['Puffer Vest', 79.99, 19],
      ['Crew Socks Pack', 14.99, 90],
      ['Chino Pants', 64.99, 31],
      ['Beanie Hat', 19.99, 52],
      ['Linen Shirt', 49.99, 33],
      ['Relaxed Joggers', 54.99, 41],
      ['Rain Jacket', 94.99, 17],
      ['Canvas Sneakers', 69.99, 26],
      ['Summer Dress', 74.99, 24],
      ['Workout Tee', 29.99, 57],
      ['Wool Scarf', 27.99, 46],
      ['Everyday Belt', 22.99, 63],
    ],
  },
  'Home & Kitchen': {
    brand: 'Casa',
    items: [
      ['Ceramic Coffee Mug', 14.99, 60],
      ['Bamboo Chopping Board', 24.99, 36],
      ['Stainless Water Bottle', 29.99, 48],
      ['Non-stick Fry Pan', 44.99, 24],
      ['Kitchen Towel Set', 18.99, 75],
      ['Glass Storage Jars', 32.99, 33],
      ['Scented Candle', 21.99, 41],
      ['Desk Lamp', 39.99, 28],
      ['Cotton Cushion Cover', 16.99, 50],
      ['Serving Bowl Set', 34.99, 29],
      ['Cutlery Organiser', 19.99, 53],
      ['Reusable Food Wraps', 13.99, 64],
      ['Spice Jar Rack', 28.99, 27],
      ['Table Runner', 23.99, 45],
      ['Laundry Basket', 31.99, 34],
      ['Wall Clock', 42.99, 21],
    ],
  },
  'Beauty & Personal Care': {
    brand: 'GlowCo',
    items: [
      ['Hydrating Face Cream', 22.99, 46],
      ['Vitamin C Serum', 29.99, 34],
      ['Aloe Body Lotion', 16.99, 58],
      ['Gentle Cleanser', 18.99, 44],
      ['Shampoo Bar', 12.99, 62],
      ['Conditioner Bar', 13.99, 57],
      ['Lip Balm Trio', 9.99, 84],
      ['Hand Cream', 8.99, 73],
      ['Clay Face Mask', 17.99, 31],
      ['Rose Toner', 15.99, 39],
      ['Body Wash', 11.99, 66],
      ['Hair Brush', 14.99, 48],
      ['Travel Toiletry Bag', 19.99, 36],
      ['Cuticle Oil', 7.99, 79],
      ['SPF Day Cream', 24.99, 42],
      ['Bath Soak', 13.49, 55],
    ],
  },
  'Sports & Outdoors': {
    brand: 'ActivePro',
    items: [
      ['Yoga Mat', 39.99, 37],
      ['Resistance Bands', 19.99, 56],
      ['Running Bottle Belt', 27.99, 29],
      ['Camping Lantern', 34.99, 25],
      ['Hiking Backpack', 69.99, 21],
      ['Skipping Rope', 12.99, 68],
      ['Foam Roller', 24.99, 39],
      ['Sports Towel', 15.99, 64],
      ['Insulated Cooler Bag', 38.99, 23],
      ['Fitness Gloves', 17.99, 44],
      ['Trail Cap', 21.99, 52],
      ['Picnic Blanket', 36.99, 30],
      ['Bike Bottle Holder', 11.99, 61],
      ['Ankle Weights', 26.99, 33],
      ['Mini First Aid Kit', 18.49, 47],
      ['Waterproof Dry Bag', 32.99, 28],
    ],
  },
  'Books & Stationery': {
    brand: 'PaperTrail',
    items: [
      ['Weekly Planner', 18.99, 50],
      ['Notebook Set', 14.99, 72],
      ['Gel Pen Pack', 9.99, 88],
      ['Desk Organiser', 19.99, 34],
      ['Sticky Notes Bundle', 7.99, 95],
      ['Mechanical Pencil Set', 11.99, 63],
      ['Book Light', 13.99, 47],
      ['Document Folder', 10.99, 59],
      ['Sketch Pad', 16.99, 41],
      ['Highlighter Set', 8.99, 82],
      ['Index Card Pack', 6.99, 91],
      ['Clipboard Folder', 12.99, 54],
      ['Desk Calendar', 15.99, 38],
      ['Binder Clips Tin', 5.99, 87],
      ['Journal Notebook', 21.99, 32],
      ['Marker Pack', 10.49, 69],
    ],
  },
  'Toys & Games': {
    brand: 'PlayBox',
    items: [
      ['Wooden Puzzle', 24.99, 28],
      ['Building Blocks Set', 39.99, 26],
      ['Family Card Game', 16.99, 44],
      ['Remote Control Car', 49.99, 18],
      ['Art Kit', 29.99, 31],
      ['Board Game Classic', 34.99, 22],
      ['Plush Koala', 19.99, 40],
      ['Science Experiment Kit', 42.99, 16],
      ['Memory Match Game', 12.99, 52],
      ['Kids Puzzle Book', 9.99, 63],
      ['Magnetic Tiles', 54.99, 20],
      ['Toy Train Set', 46.99, 19],
      ['Bubble Wand Pack', 7.99, 74],
      ['Mini Soccer Ball', 14.99, 48],
      ['Craft Bead Kit', 18.99, 36],
      ['Dinosaur Figure Set', 22.99, 33],
    ],
  },
};

const products = Object.entries(catalogue).flatMap(([category, details]) =>
  details.items.map(([name, price, stock], index) => ({
    name,
    description: `${name} from ${details.brand}. A practical ${category.toLowerCase()} item for everyday shopping and ecommerce automation practice.`,
    price,
    category,
    brand: details.brand,
    image: imageFor(name, category),
    stock,
    rating: Number((4.1 + (index % 8) * 0.1).toFixed(1)),
    numReviews: 10 + index * 4,
  })),
);

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
      role: 'admin',
    });

    await Product.insertMany(products);

    console.log(`Seed complete. Inserted ${products.length} products.`);
    console.log('Admin login: admin@example.com / Admin123!');

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
