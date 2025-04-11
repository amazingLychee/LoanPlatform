module.exports = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    console.log("✅ Admin Access Granted:", req.user.name);
    next();
};
