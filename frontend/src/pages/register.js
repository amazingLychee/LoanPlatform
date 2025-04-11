import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AuthContext from '../context/AuthContext';

export default function Register() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            router.push('/');
        }
    }, []);

    const handleRegister = async () => {
        setError('');
        if (!name || !email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            await register(name, email, password);
        } catch (err) {
            console.error("❌ Registration Error:", err);

            setError(err.response?.data?.message || "Registration failed.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center text-blue-600">Register</h2>

                {error && <p className="text-red-500 text-center mt-2">{error}</p>}

                <div className="mt-4">
                    <label className="block text-gray-700">Full Name</label>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        className="w-full p-2 mt-2 border rounded-md"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="mt-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full p-2 mt-2 border rounded-md"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mt-4">
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        className="w-full p-2 mt-2 border rounded-md"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    onClick={handleRegister}
                    className="w-full mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
                >
                    Register
                </button>

                <p className="text-center mt-4 text-gray-600">
                    Already have an account?
                    <Link href="/login">
                        <span className="text-blue-600 cursor-pointer"> Login</span>
                    </Link>
                </p>
            </div>
        </div>
    );
}
