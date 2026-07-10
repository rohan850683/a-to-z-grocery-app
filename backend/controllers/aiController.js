const Product = require('../models/Product');

// POST /api/ai/chat  { message }
// A lightweight rule-based assistant that understands grocery-related intents.
// Swap the `generateReply` body for an LLM API call (e.g. Anthropic/OpenAI) in production.
const chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }
    const reply = await generateReply(message.toLowerCase());
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

async function generateReply(text) {
  // Greeting
  if (/\b(hi|hello|hey)\b/.test(text)) {
    return "Hi! I'm Zippy, your A to Z shopping assistant. Ask me about products, offers, healthy food ideas, or your order!";
  }

  // Offers
  if (text.includes('offer') || text.includes('discount') || text.includes('deal')) {
    const deals = await Product.find({ discountPrice: { $exists: true, $ne: null } })
      .sort({ createdAt: -1 })
      .limit(5);
    if (deals.length) {
      const list = deals
        .map((p) => `${p.name} — ₹${p.discountPrice} (was ₹${p.price})`)
        .join(', ');
      return `Here are some great deals right now: ${list}. Check the Offers page for more!`;
    }
    return 'Check our Offers page in the navbar for the latest deals!';
  }

  // Healthy food ideas
  if (text.includes('healthy') || text.includes('diet') || text.includes('nutrition')) {
    return 'For a healthy grocery basket, try: fresh spinach, oats, greek yogurt, almonds, seasonal fruits, and olive oil. Want me to find any of these in our store?';
  }

  // Category / product search
  const categories = ['veg', 'non-veg', 'cake', 'cold drinks', 'chocolate', 'ice cream', 'groceries', 'pet food'];
  const foundCategory = categories.find((c) => text.includes(c));
  if (foundCategory) {
    const key = foundCategory.replace(' ', '-');
    const products = await Product.find({ category: key }).limit(5);
    if (products.length) {
      const list = products.map((p) => p.name).join(', ');
      return `Here are some ${foundCategory} products we have: ${list}. Visit the ${foundCategory} category page to see all of them!`;
    }
  }

  // Direct product name search
  const words = text.split(/\s+/).filter((w) => w.length > 2);
  if (words.length) {
    const found = await Product.findOne({
      $or: words.map((w) => ({ name: { $regex: w, $options: 'i' } })),
    });
    if (found) {
      return `${found.name} is available for ₹${found.discountPrice || found.price}, rated ${found.rating}★, delivered in ${found.deliveryTime}. Want to add it to your cart?`;
    }
  }

  // Order / delivery
  if (text.includes('order') || text.includes('delivery') || text.includes('track')) {
    return 'You can check your order history and status anytime on your Profile page under "Order History".';
  }

  // Fallback
  return "I can help you find products, share offers, or suggest healthy options. Try asking things like 'show me offers' or 'suggest healthy snacks'!";
}

module.exports = { chat };
