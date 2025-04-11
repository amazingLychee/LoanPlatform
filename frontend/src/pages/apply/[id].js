import { useRouter } from 'next/router';
import { useState, useEffect, useContext } from 'react';
import { api } from '../../services/api';
import AuthContext from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

export default function Apply() {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState(null);
    const [loanAmount, setLoanAmount] = useState('');
    const [loanTerm, setLoanTerm] = useState('');
    const [message, setMessage] = useState('');


    useEffect(() => {
        if (id) {
            api.get(`/loans/${id}`)
                .then(res => setProduct(res.data))
                .catch(err => console.error("Error fetching loan details:", err));
        }
    }, [id]);

    const handleApply = async () => {
        if (!loanAmount || !loanTerm) {
            setMessage("❌ Please enter loan amount and term.");
            return;
        }

        try {
            console.log("📤 Sending Loan Application Request:", {
                loanId: id,
                loanAmount,
                loanTerm,
            });

            const res = await api.post('/applications', {
                loanId: id,
                loanAmount,
                loanTerm,
            });

            console.log("✅ Application Submitted:", res.data);
            setMessage("✅ Loan application submitted successfully!");

            setTimeout(() => router.push('/'), 3000);
        } catch (err) {
            setMessage("❌ Failed to submit application.");
        }
    };

    if (!product) return <p>Loading...</p>;

    return (
        <div className="max-w-lg mx-auto p-6 bg-white">
            <Navbar />

            <div className="pt-20">
                <h1 className="text-2xl font-bold">{product.bank} - {product.name}</h1>
                <p className="text-gray-600 mt-2">{product.description}</p>

                <div className="mt-4">
                    <p>💰 Loan Amount: ${product.minAmount} - ${product.maxAmount}</p>
                    <p>📅 Loan Term: {product.loanTerm} months</p>
                    <p>📈 Interest Rate: {product.baseInterestRate}%</p>
                </div>

                {/* Loan Application Form */}
                <div className="mt-6">
                    <h3 className="text-lg font-semibold">Apply for Loan</h3>

                    <input
                        type="number"
                        placeholder="Enter Loan Amount"
                        className="border p-2 rounded w-full mt-2"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                    />

                    <input
                        type="number"
                        placeholder="Enter Loan Term (months)"
                        className="border p-2 rounded w-full mt-2"
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(e.target.value)}
                    />

                    <button
                        className="w-full mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
                        onClick={handleApply}
                    >
                        Submit Application
                    </button>

                    {message && <p className="mt-4 text-center">{message}</p>}
                </div>
            </div>

            <button
                onClick={() => router.back()}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition my-8"
            >
                ← Back
            </button>
        </div>
    );
}
