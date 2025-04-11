import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { api } from '../services/api';
import LoanCard from '../components/LoanCard';
import Navbar from "../components/Navbar";
import AuthContext from "../context/AuthContext";

export default function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const router = useRouter();
    const { user, loading } = useContext(AuthContext);


    useEffect(() => {
        console.log("🚀 Checking user:", user);
        console.log("🔄 Loading state:", loading);
        if (loading) return;
        const token = localStorage.getItem('token');
        if (!user) {
            setTimeout(() => router.push('/login'), 300);
            return;
        }

        api.get('/users/favorites')
            .then(res => setFavorites(res.data))
            .catch(err => console.error("❌ Error fetching favorites:", err));
    }, [user, loading]);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Navbar />

            <h1 className="text-2xl font-bold mb-4 pt-20">❤️ My Favorites</h1>
            {favorites.length === 0 ? (
                <p>No favorites yet. Start exploring and save your favorite loans!</p>
            ) : (
                favorites.map(product => (
                    <LoanCard key={product._id} product={product} initialFavorite={true} />
                ))
            )}
            <button
                onClick={() => router.back()}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition my-8"
            >
                ← Back
            </button>
        </div>
    );
}
