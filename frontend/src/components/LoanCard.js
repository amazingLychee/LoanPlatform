import Link from 'next/link';
import { useContext } from 'react';
import { FavoriteContext } from '../context/FavoriteContext';

export default function LoanCard({ product}) {
    const { favoriteLoans, addFavorite, removeFavorite } = useContext(FavoriteContext);
    const isFavorite = favoriteLoans.has(product._id);


    const toggleFavorite = async () => {
        try {
            if (isFavorite) {
                removeFavorite(product._id);
            } else {
                addFavorite(product._id);
            }
        } catch (err) {
            console.error("Error toggling favorite", err);
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-300 mt-4 mx-4 flex flex-col justify-between h-64">

            <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">{product.bank} - {product.name}</h3>
                <div className="text-2xl">
                    <button onClick={toggleFavorite} className="text-2xl">
                        {isFavorite ? "❤️" : "🤍"}
                    </button>
                </div>
            </div>

            <div className="flex justify-between">

            <div className="text-gray-600 flex flex-col gap-1">
                <p>💰 Loan Amount: <span className="text-blue-600">${product.minAmount} - ${product.maxAmount}</span></p>
                <p>📅 Loan Term: <span className="text-blue-600">{product.loanTerm} months</span></p>
                <p>📈 Interest Rate: <span className="text-blue-600">{product.baseInterestRate}%</span></p>
                <p>🛠 Processing Fee: <span className="text-blue-600">${product.processingFee}</span></p>
                <p>💳 Minimum Credit Score: <span className="text-blue-600">{product.minCreditScore}+</span></p>
                <p>💵 Minimum Income: <span className="text-blue-600">${product.minIncome}</span></p>
            </div>

            <div className="self-end">
                <Link href={`/product/${product._id}`}>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                        View Details
                    </button>
                </Link>
            </div>
            </div>

        </div>
    );
}
