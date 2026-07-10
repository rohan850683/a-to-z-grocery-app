const Contact = require('../models/Contact');

// POST /api/contact
const submitContact = async (req, res) => {
  try {
    const { name, email, phone, address, message } = req.body;
    if (!name || !email || !phone || !address || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const contact = await Contact.create({ name, email, phone, address, message });
    res.status(201).json({ message: 'Thank you! We received your message.', contact });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { submitContact };
