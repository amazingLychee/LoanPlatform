import { createContext, useState, useEffect } from 'react';
import { api, setAuthToken } from '../services/api';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem('token');
            const storedUser = JSON.parse(localStorage.getItem('user'));

            if (token) {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decodedToken.exp < currentTime) {
                    console.log("❌ Token expired, logging out...");
                    logout();
                    return;
                }

                setAuthToken(token);
                if (storedUser) {
                    setUser(storedUser);
                    setIsAdmin(storedUser.role === 'admin');
                    setLoading(false);
                }
                api.get('/users/profile')
                        .then(res => {
                            console.log("✅ Fetched User:", res.data);
                            setUser(res.data);
                            setIsAdmin(res.data.role === 'admin');
                            localStorage.setItem('user', JSON.stringify(res.data));
                            setLoading(false);
                        })
                        .catch(() => {
                            setAuthToken(null);
                            setUser(null);
                            setIsAdmin(false);
                        });
            }
        }
    }, []);

    useEffect(() => {
        if (user) {
            setIsAdmin(user.role === 'admin');
        }
    }, [user]);

    const register = async (name, email, password) => {
        try {
            const res = await api.post('/users/register', { name, email, password });

            localStorage.setItem('token', res.data.token);
            setAuthToken(res.data.token);
            setUser(res.data.user);
            setIsAdmin(res.data.user.role === 'admin');

            console.log("✅ Registration Successful:", res.data.user);

            router.push('/'); // ✅ 注册成功后跳转主页
        } catch (err) {
            console.error("❌ Registration Error:", err);
            throw err;
        }
    };

    const login = async (email, password) => {
        try {
            const res = await api.post('/users/login', { email, password });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            setAuthToken(res.data.token);
            setUser(res.data.user);
            setIsAdmin(res.data.user.role === 'admin');

            console.log("✅ Login Successful:", res.data.user);

            if (res.data.user.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/');
            }

        } catch (err) {
            console.error("❌ Login Error:", err);
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem("user");
        setAuthToken(null);
        setUser(null);
        setUser(null);
        setIsAdmin(false);
        setLoading(true);

        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAdmin, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
