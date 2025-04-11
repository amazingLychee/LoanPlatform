import { useEffect, useState, useContext } from 'react';
import { api } from '../services/api';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import {useRouter} from "next/router";

export default function Applications() {
    const { user } = useContext(AuthContext);
    const [applications, setApplications] = useState([]);
    const router = useRouter();

    useEffect(() => {
        if (!user) return; // ✅ 确保 user 存在
        console.log("🛠 Fetching applications for user:", user._id);

        if (user) {
            api.get('/applications/my-applications')
                .then(res => setApplications(res.data))
                .catch(err => console.error("Error fetching applications:", err));
        }
    }, [user]);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white">
            <Navbar />
            <h1 className="text-2xl font-bold mt-8 pt-20">My Loan Applications</h1>

            {applications.length === 0 ? (
                <p className="mt-4 text-gray-600">You haven't applied for any loans yet.</p>
            ) : (
                <table className="mt-4 w-full border-collapse border border-gray-300">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">Bank</th>
                        <th className="border p-2">Loan Amount</th>
                        <th className="border p-2">Term</th>
                        <th className="border p-2">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {applications.map(app => (
                        <tr key={app._id} className="border">
                            <td className="border p-2">{app.loanId.bank}</td>
                            <td className="border p-2">${app.loanAmount}</td>
                            <td className="border p-2">{app.loanTerm} months</td>
                            <td className={`border p-2 ${app.status === 'pending' ? 'text-yellow-500' : app.status === 'approved' ? 'text-green-500' : 'text-red-500'}`}>
                                {app.status.toUpperCase()}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
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
