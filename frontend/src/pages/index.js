import { useState, useEffect } from 'react';
import { api } from '../services/api';
import LoanCard from '../components/LoanCard';
import Navbar from "../components/Navbar";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [favoriteLoans, setFavoriteLoans] = useState(new Set()); // ✅ 存储收藏的贷款 ID


    useEffect(() => {
        api.get('/loans')
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));

        const token = localStorage.getItem('token');
        if (token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            api.get('/users/favorites')
                .then(res => {
                    const favoriteIds = new Set(res.data.map(loan => loan._id));
                    setFavoriteLoans(favoriteIds);
                })
                .catch(err => console.error("Error fetching favorites:", err));
        }
    }, []);

    return (
        <div>
            {/* ✅ 顶部导航栏 */}
            <Navbar />


            {/* ✅ 给内容添加 `pt-20`，避免被导航栏遮挡 */}
            <div className="pt-20">
                {products.length === 0 ? (
                    <p>No products available</p>
                ) : (
                    products.map(product => (
                        <LoanCard
                            key={product._id}
                            product={product}
                            initialFavorite={favoriteLoans.has(product._id)}
                        />                    ))
                )}
            </div>
        </div>
    );
}
