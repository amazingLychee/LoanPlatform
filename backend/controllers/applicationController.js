const LoanApplication = require('../models/LoanApplication');

exports.submitApplication = async (req, res) => {
    try {
        console.log("✅ Received Application Data:", req.body);
        console.log("✅ Authenticated User:", req.user);

        const { loanId, loanAmount, loanTerm } = req.body;

        if (!loanId || !loanAmount || !loanTerm) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        const application = new LoanApplication({
            userId: req.user.id,
            loanId,
            loanAmount,
            loanTerm,
            status: 'pending',
        });

        await application.save();
        console.log("✅ Application Saved:", application);
        res.status(201).json(application);
    } catch (err) {
        console.error("❌ Error creating application:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getUserApplications = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({ message: "❌ Bad Request: User ID is missing" });
        }
        const applications = await LoanApplication.find({ userId: req.user.id }).populate('loanId');
        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: "Error fetching applications" });
    }
};

exports.getAllApplications = async (req, res) => {
    try {
        const applications = await LoanApplication.find().populate('userId').populate('loanId');
        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: "Error fetching applications" });
    }
};

exports.updateApplicationStatus = async (req, res) => {
    try {
        console.log("🔍 Received Request to Update:", req.params.id);

        const { status } = req.body;
        await LoanApplication.findByIdAndUpdate(req.params.id, { status });
        res.json({ message: "Application status updated" });
    } catch (err) {
        res.status(500).json({ message: "Error updating application status" });
    }
};