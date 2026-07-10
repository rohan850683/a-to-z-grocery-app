const Cart = require('../models/Cart');

// GET /api/cart
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    res.json({ cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/cart  { productId, quantity, selectedOption }
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, selectedOption } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const existingItem = cart.items.find(
      (i) => i.product.toString() === productId && i.selectedOption === selectedOption
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, selectedOption });
    }
    await cart.save();
    await cart.populate('items.product');
    res.json({ cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/cart/:productId  { quantity }
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    const item = cart.items.find((i) => i.product.toString() === req.params.productId);
    if (!item) return res.status(404).json({ message: 'Item not found in cart' });
    item.quantity = quantity;
    if (item.quantity <= 0) {
      cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    }
    await cart.save();
    await cart.populate('items.product');
    res.json({ cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/cart/:productId
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    await cart.save();
    await cart.populate('items.product');
    res.json({ cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
