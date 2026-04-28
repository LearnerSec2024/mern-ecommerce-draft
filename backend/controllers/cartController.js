import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [], totalAmount: 0 });
  return cart;
};

const getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const qty = Number(quantity);

    if (!productId || qty < 1) {
      res.status(400);
      throw new Error('Product ID and a valid quantity are required');
    }

    const product = await Product.findOne({ _id: productId, isActive: true });
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    if (product.stock < qty) {
      res.status(400);
      throw new Error('Not enough stock available');
    }

    const cart = await getOrCreateCart(req.user._id);
    const existingItem = cart.items.find((item) => item.product.toString() === productId);

    if (existingItem) {
      const newQuantity = existingItem.quantity + qty;
      if (product.stock < newQuantity) {
        res.status(400);
        throw new Error('Not enough stock available for this quantity');
      }
      existingItem.quantity = newQuantity;
      existingItem.price = product.price;
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: qty
      });
    }

    cart.recalculateTotal();
    await cart.save();

    res.status(201).json(cart);
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const qty = Number(quantity);

    if (qty < 1) {
      res.status(400);
      throw new Error('Quantity must be at least 1');
    }

    const product = await Product.findOne({ _id: req.params.productId, isActive: true });
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    if (product.stock < qty) {
      res.status(400);
      throw new Error('Not enough stock available');
    }

    const cart = await getOrCreateCart(req.user._id);
    const item = cart.items.find((cartItem) => cartItem.product.toString() === req.params.productId);

    if (!item) {
      res.status(404);
      throw new Error('Cart item not found');
    }

    item.quantity = qty;
    item.price = product.price;
    cart.recalculateTotal();
    await cart.save();

    res.json(cart);
  } catch (error) {
    next(error);
  }
};

const removeCartItem = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId);
    cart.recalculateTotal();
    await cart.save();

    res.json(cart);
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.json(cart);
  } catch (error) {
    next(error);
  }
};

export { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
