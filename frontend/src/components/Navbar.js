import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function Navbar() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { user, logout } = useContext(AuthContext);
    const router = useRouter();

    console.log("🛠 Navbar user:", user);

    const handleLogout = () => {
        logout();
        router.push('/login'); // ✅ 登出后跳转到登录页
    };



    // 📌 3. 处理点击事件，关闭下拉菜单
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="bg-white shadow-md fixed w-full top-0 left-0 flex justify-between items-center p-4">
            <h1 className="text-2xl font-bold text-blue-600">LoanBridge</h1>

            {!user ? (
                <Link href="/login">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                        Login
                    </button>
                </Link>
            ) : (
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200"
                    >
                        <span>Welcome, {user.name}</span>
                        <span>🔽</span>
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md border border-gray-300">
                            <Link href="/favorites">
                                <p className="px-4 py-2 hover:bg-gray-100 cursor-pointer">❤️ My Favorites</p>
                            </Link>
                            <Link href="/applications">
                                <p className="px-4 py-2 hover:bg-gray-100 cursor-pointer">📤 My Application</p>
                            </Link>
                            <p
                                onClick={handleLogout}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                            >
                                🚪 Logout
                            </p>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}
