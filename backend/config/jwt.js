const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) return res.status(401).json({message: "No token, authorization denied"});

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized, user not found" });
        }
        console.log("✅ Authenticated User:", req.user);
        next();
    } catch (err) {
        res.status(401).json({message: "Invalid token"});
    }
};
