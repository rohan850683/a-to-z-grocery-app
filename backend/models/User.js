const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 1 },
    avatar: { type: String, default: '' },
    role: {
  type: String,
  enum: ['user', 'admin'],
  default: 'user',
},
resetPasswordToken: {
  type: String,
  default: null,
},
resetPasswordExpire: {
  type: Date,
  default: null,
},
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function () {
  // const { _id, name, email, phone, address, age, avatar, createdAt } = this;
  const {
  _id,
  name,
  email,
  phone,
  address,
  age,
  avatar,
  role,
  createdAt,
} = this;
  // return { id: _id, name, email, phone, address, age, avatar, createdAt };
  return {
  id: _id,
  name,
  email,
  phone,
  address,
  age,
  avatar,
  role,
  createdAt,
};
};

module.exports = mongoose.model('User', userSchema);
