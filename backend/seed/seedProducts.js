require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');

const img = (seed) => `https://picsum.photos/seed/${seed}/500/500`;

const products = [
  // Veg
  { name: 'Fresh Tomatoes (1kg)', category: 'veg', price: 60, discountPrice: 45, isTrending: true },
  { name: 'Organic Spinach (500g)', category: 'veg', price: 40, discountPrice: 32, isBestSeller: true },
  { name: 'Farm Fresh Carrots (1kg)', category: 'veg', price: 55, discountPrice: 42 },
  { name: 'Green Capsicum (500g)', category: 'veg', price: 48 },
  { name: 'Broccoli (250g)', category: 'veg', price: 65, discountPrice: 55 },
  { name: 'Onions (1kg)', category: 'veg', price: 35, isBestSeller: true },

  // Non-Veg
  { name: 'Chicken Breast (500g)', category: 'non-veg', price: 220, discountPrice: 199, isTrending: true },
  { name: 'Mutton Curry Cut (500g)', category: 'non-veg', price: 450, discountPrice: 420 },
  { name: 'Fresh Prawns (250g)', category: 'non-veg', price: 320 },
  { name: 'Farm Eggs (12 pcs)', category: 'non-veg', price: 90, discountPrice: 79, isBestSeller: true },
  { name: 'Fish Fillet (500g)', category: 'non-veg', price: 280, discountPrice: 250 },

  // Cake
  { name: 'Chocolate Truffle Cake (500g)', category: 'cake', price: 599, discountPrice: 499, isTrending: true },
  { name: 'Red Velvet Cake (500g)', category: 'cake', price: 649, discountPrice: 549 },
  { name: 'Black Forest Cake (1kg)', category: 'cake', price: 899, discountPrice: 749, isBestSeller: true },
  { name: 'Vanilla Birthday Cake (500g)', category: 'cake', price: 549 },
  { name: 'Butterscotch Cake (500g)', category: 'cake', price: 579, discountPrice: 499 },

  // Cold Drinks
  { name: 'Coca-Cola (750ml)', category: 'cold-drinks', price: 45, isBestSeller: true },
  { name: 'Pepsi (750ml)', category: 'cold-drinks', price: 45 },
  { name: 'Sprite (750ml)', category: 'cold-drinks', price: 45, discountPrice: 39 },
  { name: 'Fresh Orange Juice (1L)', category: 'cold-drinks', price: 120, discountPrice: 99, isTrending: true },
  { name: 'Mango Smoothie (500ml)', category: 'cold-drinks', price: 89 },
  { name: 'Sparkling Lemonade (500ml)', category: 'cold-drinks', price: 60 },

  // Chocolate
  { name: 'Dairy Milk Silk (150g)', category: 'chocolate', price: 180, discountPrice: 159, isBestSeller: true },
  { name: 'KitKat Pack (4x)', category: 'chocolate', price: 100, discountPrice: 89 },
  { name: 'Ferrero Rocher (16 pcs)', category: 'chocolate', price: 549, discountPrice: 499, isTrending: true },
  { name: 'Dark Chocolate Bar (100g)', category: 'chocolate', price: 150 },
  { name: 'Assorted Truffle Box', category: 'chocolate', price: 399, discountPrice: 349 },

  // Ice Cream
  { name: 'Vanilla Ice Cream Tub (1L)', category: 'ice-cream', price: 250, discountPrice: 210, isBestSeller: true },
  { name: 'Chocolate Chip Ice Cream (500ml)', category: 'ice-cream', price: 180 },
  { name: 'Butterscotch Ice Cream (500ml)', category: 'ice-cream', price: 175, discountPrice: 150 },
  { name: 'Mango Ice Cream (500ml)', category: 'ice-cream', price: 190, isTrending: true },
  { name: 'Cookies & Cream Tub (1L)', category: 'ice-cream', price: 260, discountPrice: 229 },

  // Groceries
  { name: 'Basmati Rice (5kg)', category: 'groceries', price: 520, discountPrice: 469, isBestSeller: true },
  { name: 'Toor Dal (1kg)', category: 'groceries', price: 145, discountPrice: 129 },
  { name: 'Sunflower Oil (1L)', category: 'groceries', price: 165 },
  { name: 'Atta Whole Wheat Flour (5kg)', category: 'groceries', price: 260, discountPrice: 235, isTrending: true },
  { name: 'Sugar (1kg)', category: 'groceries', price: 48 },
  { name: 'Salt (1kg)', category: 'groceries', price: 22 },

  // Pet Food
  { name: 'Dog Dry Food (3kg)', category: 'pet-food', price: 899, discountPrice: 799, isBestSeller: true },
  { name: 'Cat Wet Food Pouch (85g x6)', category: 'pet-food', price: 420, discountPrice: 379 },
  { name: 'Puppy Starter Food (1kg)', category: 'pet-food', price: 350, isTrending: true },
  { name: 'Bird Seed Mix (500g)', category: 'pet-food', price: 150 },
  { name: 'Pet Chew Treats Pack', category: 'pet-food', price: 220, discountPrice: 189 },
];

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const enrich = (p, i) => ({
  ...p,
  slug: slugify(p.name),
  // image: img(i + 1),
  // images: [img(i + 1), img(i + 100), img(i + 200)],
//   image: `/images/products/${slugify(p.name)}.jpeg`,
// images: [
//   `/images/products/${slugify(p.name)}.jpeg`,
// ],
image: `/images/products/${slugify(p.name)}.jpeg`,
images: [`/images/products/${slugify(p.name)}.jpeg`],
  rating: +(3.8 + Math.random() * 1.2).toFixed(1),
  ratingCount: Math.floor(50 + Math.random() * 900),
  companyName: 'A to Z Fresh',
  manufactureDate: '2026-06-01',
  expiryDate: '2026-12-01',
  ingredients: 'See packaging for full ingredient list. Sourced from trusted local suppliers.',
  description: `Premium quality ${p.name} delivered fresh to your doorstep. Handpicked and quality-checked by A to Z.`,
  quantityOptions: ['Standard', 'Large', 'Family Pack'],
  deliveryTime: `${8 + Math.floor(Math.random() * 20)} mins`,
  stock: 50 + Math.floor(Math.random() * 200),
  tags: [p.category, 'fresh', 'a to z'],
});

const run = async () => {
  await connectDB();
  await Product.deleteMany({});
  const docs = products.map(enrich);
  await Product.insertMany(docs);
  console.log(`Seeded ${docs.length} products.`);
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
