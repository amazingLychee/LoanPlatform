const Loan = require('../models/LoanProduct');

exports.getLoans = async (req, res) => {
    try {
        const loans = await Loan.find();
        console.log(loans)
        res.json(loans);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getLoanById = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id);
        if (!loan) return res.status(404).json({ message: "Loan not found" });
        res.json(loan);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};