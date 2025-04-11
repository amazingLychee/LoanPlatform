const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    creditScore: Number,
    userType: { type: String, enum: ['New', 'VIP', 'Regular'], default: 'New' },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Loan' }],
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

module.exports = mongoose.model('User', UserSchema);
