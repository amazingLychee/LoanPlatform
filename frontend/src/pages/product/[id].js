import { useRouter } from 'next/router';
import { useState, useEffect, useContext } from 'react';
import { api } from '../../services/api';
import Link from 'next/link';
import Navbar from '../../components/Navbar'; // ✅ Import Navbar Component
import { FavoriteContext } from '../../context/FavoriteContext';

export default function LoanDetails() {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState(null);
    const [loanAmount, setLoanAmount] = useState('');
    const [loanTerm, setLoanTerm] = useState('');
    const [monthlyPayment, setMonthlyPayment] = useState(null);
    const { favoriteLoans, addFavorite, removeFavorite } = useContext(FavoriteContext);
    const isFavorite = favoriteLoans.has(id);

    useEffect(() => {
        if (id) {
            api.get(`/loans/${id}`)
                .then(res => setProduct(res.data))
                .catch(err => console.error("Error fetching loan details:", err));
        }
    }, [id]);

    const calculatePayment = () => {
        if (!loanAmount || !loanTerm) {
            alert("Please enter both Loan Amount and Loan Term.");
            return;
        }

        const P = parseFloat(loanAmount);
        const r = parseFloat(product.baseInterestRate) / 100 / 12;
        const n = parseInt(loanTerm) * 12;

        if (r === 0) {
            setMonthlyPayment(P / n);
        } else {
            const M = P * (r * (1 + r) ** n) / ((1 + r) ** n - 1);
            setMonthlyPayment(M.toFixed(2));
        }
    };

    const toggleFavorite = () => {
        if (isFavorite) {
            removeFavorite(id);
        } else {
            addFavorite(id);
        }
    };

    if (!product) return <p>Loading...</p>;

    return (
        <div className="max-w-lg mx-auto p-6 bg-white">
            {/* ✅ Navbar Component */}
            <Navbar />

            <div className="pt-20">
                {/* 🔙 Back + Favorite Button */}
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={() => router.back()}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                    >
                        ← Back
                    </button>

                    <button onClick={toggleFavorite} className="text-2xl">
                        {isFavorite ? '❤️' : '🤍'}
                    </button>
                </div>

                {/* Loan Details */}
                <h1 className="text-2xl font-bold">{product.bank} - {product.name}</h1>
                <p className="text-gray-600 mt-2">{product.description}</p>

                <div className="mt-4">
                    <p>💰 Loan Amount: ${product.minAmount} - ${product.maxAmount}</p>
                    <p>📅 Loan Term: {product.loanTerm} months</p>
                    <p>📈 Interest Rate: {product.baseInterestRate}%</p>
                    <p>💳 Minimum Credit Score: {product.minCreditScore}+</p>
                    <p>💵 Minimum Income: ${product.minIncome}</p>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold">Calculate Monthly Payment</h3>
                    <div className="flex flex-col gap-3 mt-2">
                        <input
                            type="number"
                            placeholder="Enter Loan Amount"
                            className="border p-2 rounded"
                            value={loanAmount}
                            onChange={(e) => setLoanAmount(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Enter Loan Term (years)"
                            className="border p-2 rounded"
                            value={loanTerm}
                            onChange={(e) => setLoanTerm(e.target.value)}
                        />
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                            onClick={calculatePayment}
                        >
                            Calculate Monthly Payment
                        </button>
                    </div>

                    {/* 📌 Display Monthly Payment Result */}
                    {monthlyPayment && (
                        <p className="mt-4 text-green-600 text-lg">
                            🏦 Estimated Monthly Payment: <strong>${monthlyPayment}</strong>
                        </p>
                    )}
                </div>

                {/* 📌 Apply Now Button */}
                <div className="mt-6 text-center">
                    <Link href={`/apply/${product._id}`}>
                        <button className="bg-green-500 text-white px-6 py-3 rounded-md text-lg hover:bg-green-600 transition">
                            Apply Now
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
