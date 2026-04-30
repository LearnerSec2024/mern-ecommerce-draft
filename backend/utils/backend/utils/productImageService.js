import fs from 'node:fs/promises';
import path from 'node:path';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const backendDir = resolve(__dirname, '..');
const projectRoot = resolve(backendDir, '..');

const PUBLIC_PRODUCTS_DIR = path.join(projectRoot, 'frontend', 'public', 'images', 'products');

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

const searchPexels = async (query) => {
  if (!process.env.PEXELS_API_KEY) {
    throw new Error('PEXELS_API_KEY is missing from backend/.env');
  }

  const url = new URL('https://api.pexels.com/v1/search');

  url.searchParams.set('query', query);
  url.searchParams.set('per_page', '8');
  url.searchParams.set('orientation', 'landscape');

  const response = await fetch(url, {
    headers: {
      Authorization: process.env.PEXELS_API_KEY
    }
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Pexels search failed: ${response.status} ${body}`);
  }

  return response.json();
};

const downloadImage = async (imageUrl, outputPath) => {
  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new Error(`Image download failed: ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, buffer);
};

const downloadProductImage = async ({ name, category }) => {
  if (!name || !category) {
    throw new Error('Product name and category are required to auto-download image');
  }

  const categorySlug = slugify(category);
  const productSlug = slugify(name);

  const localRelativePath = `/images/products/${categorySlug}/${productSlug}.jpg`;
  const localFilePath = path.join(PUBLIC_PRODUCTS_DIR, categorySlug, `${productSlug}.jpg`);

  try {
    await fs.access(localFilePath);
    return localRelativePath;
  } catch {
    // Image does not exist yet, so continue and download it.
  }

  const categoryHint = categorySearchHints[category] || category;
  const query = `${name} ${categoryHint}`;

  let searchResult = await searchPexels(query);

  if (!searchResult.photos?.length) {
    searchResult = await searchPexels(categoryHint);
  }

  const photo = searchResult.photos?.[0];

  if (!photo) {
    throw new Error(`No image found for ${name}`);
  }

  const imageUrl = photo.src?.large || photo.src?.medium || photo.src?.original;

  if (!imageUrl) {
    throw new Error(`No downloadable image URL found for ${name}`);
  }

  await downloadImage(imageUrl, localFilePath);

  return localRelativePath;
};

export { downloadProductImage };
