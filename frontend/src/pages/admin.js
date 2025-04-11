import { useEffect, useState, useContext } from 'react';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import AuthContext from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function AdminPanel() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const { user, isAdmin } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        console.log("🔍 Checking Admin Access:", { user, isAdmin });

        if (user) {
            setLoading(false); // ✅ 只有 `user` 载入后，才让 `AdminPanel` 渲染
            if (!isAdmin) {
                console.error("❌ Access Denied: Not an Admin");
                router.push('/login');
            }
        }
    }, [user, isAdmin]);

    useEffect(() => {
        if (!loading && isAdmin) {
            api.get('/admin/applications')
                .then(res => setApplications(res.data))
                .catch(err => console.error("Error fetching applications:", err));
        }
    }, [isAdmin, loading]);

    if (loading) {
        return <p className="text-center">🔄 Loading...</p>;
    }

    const updateStatus = async (id, status) => {
        try {
            await api.put(`admin/applications/${id}`, { status });
            setApplications(prev =>
                prev.map(app => (app._id === id ? { ...app, status } : app))
            );
        } catch (err) {
            console.error("Error updating application status:", err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white">
            <Navbar />
            <h1 className="text-2xl font-bold mt-8 pt-20">Admin Panel - Loan Applications</h1>

            {applications.length === 0 ? (
                <p className="mt-4 text-gray-600">No loan applications found.</p>
            ) : (
                <table className="mt-4 w-full border-collapse border border-gray-300">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">User</th>
                        <th className="border p-2">Bank</th>
                        <th className="border p-2">Loan Amount</th>
                        <th className="border p-2">Term</th>
                        <th className="border p-2">Status</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {applications.map(app => (
                        <tr key={app._id} className="border">
                            <td className="border p-2">{app.userId.name}</td>
                            <td className="border p-2">{app.loanId.bank}</td>
                            <td className="border p-2">${app.loanAmount}</td>
                            <td className="border p-2">{app.loanTerm} months</td>
                            <td className={`border p-2 ${app.status === 'pending' ? 'text-yellow-500' : app.status === 'approved' ? 'text-green-500' : 'text-red-500'}`}>
                                {app.status.toUpperCase()}
                            </td>
                            <td className="border p-2">
                                {app.status === 'pending' && (
                                    <>
                                        <button className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                                                onClick={() => updateStatus(app._id, 'approved')}>
                                            Approve
                                        </button>
                                        <button className="bg-red-500 text-white px-2 py-1 rounded"
                                                onClick={() => updateStatus(app._id, 'rejected')}>
                                            Reject
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
