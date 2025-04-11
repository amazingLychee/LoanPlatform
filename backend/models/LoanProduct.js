const mongoose = require('mongoose');

const LoanProductSchema = new mongoose.Schema({
    name: String,
    bank: String,
    baseInterestRate: Number,
    minIncome: Number,
    minCreditScore: Number
});

module.exports = mongoose.model('Loan', LoanProductSchema);
