const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 📌 用户注册
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // 检查用户是否已存在
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        // 加密密码
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 创建新用户
        user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "user"
        });

        await user.save();

        // 生成 JWT 令牌
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });

    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

// 📌 用户登录
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 查找用户
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        // 校验密码
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // 生成 JWT 令牌
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role:user.role }
        });

    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

// 📌 获取当前用户信息（需要身份验证）
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // 不返回密码
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

// 📌 添加收藏贷款
exports.addFavorite = async (req, res) => {
    const { loanId } = req.body;

    try {
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.favorites.includes(loanId)) {
            return res.status(400).json({ message: "Already in favorites" });
        }

        user.favorites.push(loanId);
        await user.save();

        res.json({ message: "Added to favorites", favorites: user.favorites });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

// 📌 获取收藏的贷款列表
exports.getFavorites = async (req, res) => {
    try {
        console.log("📌 Received user ID:", req.user?.id); // 🛠 打印 `req.user`

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: No user ID found" });
        }

        const user = await User.findById(req.user.id).populate('favorites');

        if (!user) {
            console.log("❌ User not found in database");
            return res.status(404).json({ message: "User not found" });
        }

        console.log("✅ Returning favorites:", user.favorites); // 🛠 确保 MongoDB 返回数据
        res.json(user.favorites);
    } catch (err) {
        console.error("❌ Error fetching favorites:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};


exports.removeFavorite = async (req, res) => {
    const { loanId } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.favorites = user.favorites.filter(id => id.toString() !== loanId);
        await user.save();

        res.json({ message: "Removed from favorites", favorites: user.favorites });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};