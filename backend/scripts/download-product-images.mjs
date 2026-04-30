import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';
import mongoose from 'mongoose';

import Product from '../models/Product.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const backendDir = resolve(__dirname, '..');
const projectRoot = resolve(backendDir, '..');

dotenv.config({ path: path.join(backendDir, '.env') });

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mern_ecommerce';

const PUBLIC_PRODUCTS_DIR = path.join(projectRoot, 'frontend', 'public', 'images', 'products');

if (!PEXELS_API_KEY) {
  console.error('PEXELS_API_KEY is missing. Add it to backend/.env');
  process.exit(1);
}

const slugify = (value) =>
  value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const categorySearchHints = {
  'Fruits & Vegetables': 'fresh produce grocery',
  Electronics: 'consumer electronics product',
  Clothing: 'fashion clothing product',
  'Home & Kitchen': 'home kitchen product',
  'Beauty & Personal Care': 'beauty skincare product',
  'Sports & Outdoors': 'sports outdoor gear product',
  'Books & Stationery': 'stationery desk product',
  'Toys & Games': 'toy game product'
};

const wait = (ms) => new Promise((resolveWait) => setTimeout(resolveWait, ms));

const searchPexels = async (query) => {
  const url = new URL('https://api.pexels.com/v1/search');

  url.searchParams.set('query', query);
  url.searchParams.set('per_page', '12');
  url.searchParams.set('orientation', 'landscape');

  const response = await fetch(url, {
    headers: {
      Authorization: PEXELS_API_KEY
    }
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Pexels search failed for "${query}": ${response.status} ${body}`);
  }

  return response.json();
};

const downloadImage = async (imageUrl, outputPath) => {
  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new Error(`Image download failed: ${response.status} ${imageUrl}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, buffer);
};

const chooseUniquePhoto = (photos, usedPhotoIds) => {
  return photos.find((photo) => !usedPhotoIds.has(photo.id)) || photos[0];
};

const main = async () => {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);

  const products = await Product.find({}).sort({ category: 1, name: 1 });

  console.log(`Found ${products.length} products.`);

  if (products.length === 0) {
    console.log('No products found. Run npm run start:seed first.');
    await mongoose.disconnect();
    return;
  }

  const usedPhotoIds = new Set();

  for (const product of products) {
    const categorySlug = slugify(product.category);
    const productSlug = slugify(product.name);

    const localRelativePath = `/images/products/${categorySlug}/${productSlug}.jpg`;
    const localFilePath = path.join(PUBLIC_PRODUCTS_DIR, categorySlug, `${productSlug}.jpg`);

    try {
      await fs.access(localFilePath);

      product.image = localRelativePath;
      await product.save();

      console.log(`Already exists, linked: ${product.name}`);
      continue;
    } catch {
      // Image file does not exist yet, so download it.
    }

    const categoryHint = categorySearchHints[product.category] || product.category;
    const query = `${product.name} ${categoryHint}`;

    console.log(`Searching image for: ${product.name}`);

    let searchResult = await searchPexels(query);

    if (!searchResult.photos?.length) {
      console.log(`No exact result for "${query}", trying category fallback...`);
      searchResult = await searchPexels(categoryHint);
    }

    if (!searchResult.photos?.length) {
      console.log(`No image found for ${product.name}. Skipping.`);
      continue;
    }

    const photo = chooseUniquePhoto(searchResult.photos, usedPhotoIds);

    usedPhotoIds.add(photo.id);

    const imageUrl = photo.src?.large || photo.src?.medium || photo.src?.original;

    if (!imageUrl) {
      console.log(`No downloadable image URL for ${product.name}. Skipping.`);
      continue;
    }

    await downloadImage(imageUrl, localFilePath);

    product.image = localRelativePath;
    await product.save();

    console.log(`Downloaded and linked: ${product.name} -> ${localRelativePath}`);

    await wait(300);
  }

  await mongoose.disconnect();

  console.log('Product image download complete.');
};

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
