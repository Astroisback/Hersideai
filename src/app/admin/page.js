"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Trash2, Users, Briefcase, AlertTriangle, CheckCircle, XCircle, ShieldAlert, Package } from "lucide-react";

export default function AdminPage() {
    const [customers, setCustomers] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [selectedSellers, setSelectedSellers] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        setLoading(true);
        try {
            // Fetch customers
            const customersSnapshot = await getDocs(collection(db, "customers"));
            const customersData = customersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCustomers(customersData);

            // Fetch sellers
            const sellersSnapshot = await getDocs(collection(db, "sellers"));
            const sellersData = sellersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setSellers(sellersData);

            // Fetch products
            const productsSnapshot = await getDocs(collection(db, "products"));
            const productsData = productsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(productsData);
        } catch (error) {
            console.error("Error fetching accounts:", error);
            showMessage("error", "Failed to load accounts");
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: "", text: "" }), 5000);
    };

    const handleDeleteCustomer = async (customerId, customerName) => {
        if (!confirm(`Are you sure you want to delete customer "${customerName}"? This action cannot be undone.`)) {
            return;
        }

        setDeleteLoading(true);
        try {
            await deleteDoc(doc(db, "customers", customerId));
            setCustomers(customers.filter(c => c.id !== customerId));
            showMessage("success", `Customer "${customerName}" deleted successfully`);
        } catch (error) {
            console.error("Error deleting customer:", error);
            showMessage("error", "Failed to delete customer");
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDeleteSeller = async (sellerId, sellerName) => {
        if (!confirm(`Are you sure you want to delete seller "${sellerName}"? This action cannot be undone.`)) {
            return;
        }

        setDeleteLoading(true);
        try {
            await deleteDoc(doc(db, "sellers", sellerId));
            setSellers(sellers.filter(s => s.id !== sellerId));
            showMessage("success", `Seller "${sellerName}" deleted successfully`);
        } catch (error) {
            console.error("Error deleting seller:", error);
            showMessage("error", "Failed to delete seller");
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleVerifySeller = async (sellerId, currentStatus) => {
        const newStatus = !currentStatus;
        try {
            await updateDoc(doc(db, "sellers", sellerId), {
                isVerified: newStatus
            });
            setSellers(sellers.map(s => s.id === sellerId ? { ...s, isVerified: newStatus } : s));
            showMessage("success", `Seller ${newStatus ? "verified" : "unverified"} successfully`);
        } catch (error) {
            console.error("Error verifying seller:", error);
            showMessage("error", "Failed to update verification status");
        }
    };

    const handleBulkDeleteCustomers = async () => {
        if (selectedCustomers.length === 0) {
            showMessage("error", "No customers selected");
            return;
        }

        if (!confirm(`Are you sure you want to delete ${selectedCustomers.length} customer(s)? This action cannot be undone.`)) {
            return;
        }

        setDeleteLoading(true);
        try {
            await Promise.all(
                selectedCustomers.map(id => deleteDoc(doc(db, "customers", id)))
            );
            setCustomers(customers.filter(c => !selectedCustomers.includes(c.id)));
            setSelectedCustomers([]);
            showMessage("success", `${selectedCustomers.length} customer(s) deleted successfully`);
        } catch (error) {
            console.error("Error bulk deleting customers:", error);
            showMessage("error", "Failed to delete some customers");
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleBulkDeleteSellers = async () => {
        if (selectedSellers.length === 0) {
            showMessage("error", "No sellers selected");
            return;
        }

        if (!confirm(`Are you sure you want to delete ${selectedSellers.length} seller(s)? This action cannot be undone.`)) {
            return;
        }

        setDeleteLoading(true);
        try {
            await Promise.all(
                selectedSellers.map(id => deleteDoc(doc(db, "sellers", id)))
            );
            setSellers(sellers.filter(s => !selectedSellers.includes(s.id)));
            setSelectedSellers([]);
            showMessage("success", `${selectedSellers.length} seller(s) deleted successfully`);
        } catch (error) {
            console.error("Error bulk deleting sellers:", error);
            showMessage("error", "Failed to delete some sellers");
        } finally {
            setDeleteLoading(false);
        }
    };

    const toggleCustomerSelection = (customerId) => {
        setSelectedCustomers(prev =>
            prev.includes(customerId)
                ? prev.filter(id => id !== customerId)
                : [...prev, customerId]
        );
    };

    const toggleSellerSelection = (sellerId) => {
        setSelectedSellers(prev =>
            prev.includes(sellerId)
                ? prev.filter(id => id !== sellerId)
                : [...prev, sellerId]
        );
    };

    const toggleAllCustomers = () => {
        if (selectedCustomers.length === customers.length) {
            setSelectedCustomers([]);
        } else {
            setSelectedCustomers(customers.map(c => c.id));
        }
    };

    const toggleAllSellers = () => {
        if (selectedSellers.length === sellers.length) {
            setSelectedSellers([]);
        } else {
            setSelectedSellers(sellers.map(s => s.id));
        }
    };

    const handleDeleteProduct = async (productId, productName) => {
        if (!confirm(`Are you sure you want to delete product "${productName}"? This action cannot be undone.`)) {
            return;
        }

        setDeleteLoading(true);
        try {
            await deleteDoc(doc(db, "products", productId));
            setProducts(products.filter(p => p.id !== productId));
            showMessage("success", `Product "${productName}" deleted successfully`);
        } catch (error) {
            console.error("Error deleting product:", error);
            showMessage("error", "Failed to delete product");
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleBulkDeleteProducts = async () => {
        if (selectedProducts.length === 0) {
            showMessage("error", "No products selected");
            return;
        }

        if (!confirm(`Are you sure you want to delete ${selectedProducts.length} product(s)? This action cannot be undone.`)) {
            return;
        }

        setDeleteLoading(true);
        try {
            await Promise.all(
                selectedProducts.map(id => deleteDoc(doc(db, "products", id)))
            );
            setProducts(products.filter(p => !selectedProducts.includes(p.id)));
            setSelectedProducts([]);
            showMessage("success", `${selectedProducts.length} product(s) deleted successfully`);
        } catch (error) {
            console.error("Error bulk deleting products:", error);
            showMessage("error", "Failed to delete some products");
        } finally {
            setDeleteLoading(false);
        }
    };

    const toggleProductSelection = (productId) => {
        setSelectedProducts(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const toggleAllProducts = () => {
        if (selectedProducts.length === products.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(products.map(p => p.id));
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return "N/A";
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading accounts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4 md:p-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center">
                            <ShieldAlert size={24} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                            Admin Dashboard
                        </h1>
                    </div>
                    <p className="text-gray-600 text-sm">Manage customer and seller accounts</p>

                    {/* Warning Banner */}
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                        <AlertTriangle size={20} className="text-red-600 shrink-0 mt-0.5" />
                        <div className="text-sm text-red-800">
                            <strong>Warning:</strong> Deleting accounts is permanent and cannot be undone. Use with caution.
                        </div>
                    </div>
                </div>
            </div>

            {/* Message Display */}
            {message.text && (
                <div className="max-w-7xl mx-auto mb-6">
                    <div className={`rounded-xl p-4 flex items-center gap-3 ${message.type === "success"
                        ? "bg-green-50 border border-green-200 text-green-800"
                        : "bg-red-50 border border-red-200 text-red-800"
                        }`}>
                        {message.type === "success" ? (
                            <CheckCircle size={20} className="shrink-0" />
                        ) : (
                            <XCircle size={20} className="shrink-0" />
                        )}
                        <span className="font-medium">{message.text}</span>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Total Customers</p>
                            <p className="text-4xl font-bold text-pink-600">{customers.length}</p>
                        </div>
                        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center">
                            <Users size={32} className="text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Total Sellers</p>
                            <p className="text-4xl font-bold text-purple-600">{sellers.length}</p>
                        </div>
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                            <Briefcase size={32} className="text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Total Products</p>
                            <p className="text-4xl font-bold text-blue-600">{products.length}</p>
                        </div>
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                            <Package size={32} className="text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Customers Section */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Users size={24} className="text-pink-600" />
                            Customer Accounts ({customers.length})
                        </h2>
                        {selectedCustomers.length > 0 && (
                            <button
                                onClick={handleBulkDeleteCustomers}
                                disabled={deleteLoading}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                <Trash2 size={18} />
                                Delete Selected ({selectedCustomers.length})
                            </button>
                        )}
                    </div>

                    {customers.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No customer accounts found</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left p-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedCustomers.length === customers.length}
                                                onChange={toggleAllCustomers}
                                                className="w-4 h-4 accent-pink-600"
                                            />
                                        </th>
                                        <th className="text-left p-3 font-bold text-gray-700">Username</th>
                                        <th className="text-left p-3 font-bold text-gray-700">Name</th>
                                        <th className="text-left p-3 font-bold text-gray-700">Phone</th>
                                        <th className="text-left p-3 font-bold text-gray-700">Created</th>
                                        <th className="text-left p-3 font-bold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.map((customer) => (
                                        <tr key={customer.id} className="border-b border-gray-100 hover:bg-pink-50/50 transition-colors">
                                            <td className="p-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCustomers.includes(customer.id)}
                                                    onChange={() => toggleCustomerSelection(customer.id)}
                                                    className="w-4 h-4 accent-pink-600"
                                                />
                                            </td>
                                            <td className="p-3 font-medium text-gray-800">{customer.username}</td>
                                            <td className="p-3 text-gray-700">{customer.name}</td>
                                            <td className="p-3 text-gray-700">{customer.phone}</td>
                                            <td className="p-3 text-gray-600 text-sm">{formatDate(customer.createdAt)}</td>
                                            <td className="p-3">
                                                <button
                                                    onClick={() => handleDeleteCustomer(customer.id, customer.name)}
                                                    disabled={deleteLoading}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
                                                >
                                                    <Trash2 size={14} />
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Sellers Section */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Briefcase size={24} className="text-purple-600" />
                            Seller Accounts ({sellers.length})
                        </h2>
                        {selectedSellers.length > 0 && (
                            <button
                                onClick={handleBulkDeleteSellers}
                                disabled={deleteLoading}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                <Trash2 size={18} />
                                Delete Selected ({selectedSellers.length})
                            </button>
                        )}
                    </div>

                    {sellers.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No seller accounts found</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left p-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedSellers.length === sellers.length}
                                                onChange={toggleAllSellers}
                                                className="w-4 h-4 accent-purple-600"
                                            />
                                        </th>
                                        <th className="text-left p-3 font-bold text-gray-700">Username</th>
                                        <th className="text-left p-3 font-bold text-gray-700">Business Name</th>
                                        <th className="text-left p-3 font-bold text-gray-700">Category</th>
                                        <th className="text-left p-3 font-bold text-gray-700">Phone</th>
                                        <th className="text-left p-3 font-bold text-gray-700">Created</th>
                                        <th className="text-left p-3 font-bold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sellers.map((seller) => (
                                        <tr key={seller.id} className="border-b border-gray-100 hover:bg-purple-50/50 transition-colors">
                                            <td className="p-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSellers.includes(seller.id)}
                                                    onChange={() => toggleSellerSelection(seller.id)}
                                                    className="w-4 h-4 accent-purple-600"
                                                />
                                            </td>
                                            <td className="p-3 font-medium text-gray-800">{seller.username}</td>
                                            <td className="p-3 text-gray-700">{seller.businessName || "N/A"}</td>
                                            <td className="p-3 text-gray-700">{seller.category || "N/A"}</td>
                                            <td className="p-3 text-gray-700">{seller.phone || "N/A"}</td>
                                            <td className="p-3 text-gray-600 text-sm">{formatDate(seller.createdAt)}</td>
                                            <td className="p-3">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleVerifySeller(seller.id, seller.isVerified)}
                                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-colors ${seller.isVerified
                                                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                            }`}
                                                    >
                                                        {seller.isVerified ? <CheckCircle size={14} /> : <ShieldAlert size={14} />}
                                                        {seller.isVerified ? "Verified" : "Verify"}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteSeller(seller.id, seller.businessName || seller.username)}
                                                        disabled={deleteLoading}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
                                                    >
                                                        <Trash2 size={14} />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Products Section */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Package size={24} className="text-blue-600" />
                            Product Listings ({products.length})
                        </h2>
                        {selectedProducts.length > 0 && (
                            <button
                                onClick={handleBulkDeleteProducts}
                                disabled={deleteLoading}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                <Trash2 size={18} />
                                Delete Selected ({selectedProducts.length})
                            </button>
                        )}
                    </div>

                    {products.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No products found</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left p-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedProducts.length === products.length}
                                                onChange={toggleAllProducts}
                                                className="w-4 h-4 accent-blue-600"
                                            />
                                        </th>
                                        <th className="text-left p-3 font-bold text-gray-700">Product Name</th>
                                        <th className="text-left p-3 font-bold text-gray-700">Price</th>
                                        <th className="text-left p-3 font-bold text-gray-700">Category</th>
                                        <th className="text-left p-3 font-bold text-gray-700">Stock</th>
                                        <th className="text-left p-3 font-bold text-gray-700">Created</th>
                                        <th className="text-left p-3 font-bold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                                            <td className="p-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProducts.includes(product.id)}
                                                    onChange={() => toggleProductSelection(product.id)}
                                                    className="w-4 h-4 accent-blue-600"
                                                />
                                            </td>
                                            <td className="p-3 font-medium text-gray-800">{product.name}</td>
                                            <td className="p-3 text-gray-700">₹{product.price}</td>
                                            <td className="p-3 text-gray-700">{product.category || "N/A"}</td>
                                            <td className="p-3 text-gray-700">{product.stock || "N/A"}</td>
                                            <td className="p-3 text-gray-600 text-sm">{formatDate(product.createdAt)}</td>
                                            <td className="p-3">
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id, product.name)}
                                                    disabled={deleteLoading}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
                                                >
                                                    <Trash2 size={14} />
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
