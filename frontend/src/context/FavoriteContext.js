import {createContext, useState, useEffect, useContext} from 'react';
import { api } from '../services/api';
import AuthContext from './AuthContext';

export const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
    const [favoriteLoans, setFavoriteLoans] = useState(new Set());
    const { user } = useContext(AuthContext);

    const fetchFavorites = () => {
        if (!user) return;
        console.log("📡 Fetching favorites for user:", user._id);
        api.get('/users/favorites')
            .then(res => {
                const favoriteIds = new Set(res.data.map(loan => loan._id));
                setFavoriteLoans(favoriteIds);
            })
            .catch(() => setFavoriteLoans(new Set()));
    };

    useEffect(() => {
        fetchFavorites();
    }, [user]);

    const addFavorite = async (loanId) => {
        try {
            await api.post('/users/favorites/add', { loanId });
            setFavoriteLoans(prev => new Set(prev).add(loanId));
        } catch (err) {
            console.error("Error adding favorite", err);
        }
    };

    const removeFavorite = async (loanId) => {
        try {
            await api.post('/users/favorites/remove', { loanId });
            setFavoriteLoans(prev => {
                const newFavorites = new Set(prev);
                newFavorites.delete(loanId);
                return newFavorites;
            });
        } catch (err) {
            console.error("Error removing favorite", err);
        }
    };

    return (
        <FavoriteContext.Provider value={{ favoriteLoans, addFavorite, removeFavorite }}>
            {children}
        </FavoriteContext.Provider>
    );
};
