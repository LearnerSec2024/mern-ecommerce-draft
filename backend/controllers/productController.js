import { downloadProductImage } from '../utils/productImageService.js';
import Product from '../models/Product.js';
import slugify from '../utils/slugify.js';

const getProducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const { search, category, sort = 'newest' } = req.query;

    const query = { isActive: true };

    if (search) query.$text = { $search: search };
    if (category && category !== 'all') query.categorySlug = slugify(category);

    const sortMap = {
      newest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      name_asc: { name: 1 },
    };

    const [products, total, categories] = await Promise.all([
      Product.find(query)
        .sort(sortMap[sort] || sortMap.newest)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(query),
      Product.distinct('category', { isActive: true }),
    ]);

    res.json({
      products,
      categories,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true });

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    Object.assign(product, req.body);
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    product.isActive = false;
    await product.save();

    res.json({ message: 'Product archived' });
  } catch (error) {
    next(error);
  }
};
const generateProductImage = async (req, res, next) => {
  try {
    const { name, category } = req.body;

    if (!name || !category) {
      res.status(400);
      throw new Error('Product name and category are required');
    }

    const image = await downloadProductImage({ name, category });

    res.json({
      image,
      message: 'Product image downloaded successfully',
    });
  } catch (error) {
    next(error);
  }
};
export { getProducts, getProductById, createProduct, updateProduct, deleteProduct, generateProductImage };
