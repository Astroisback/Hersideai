"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { Plus, Pencil, Trash2, Package, Crown, X, Check } from "lucide-react";
import ProductForm from "./ProductForm";

export default function ProductList({ sellerId, subscriptionPlan }) {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    useEffect(() => {
        if (!sellerId) return;

        const q = query(collection(db, "products"), where("sellerId", "==", sellerId));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const prods = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setProducts(prods);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [sellerId]);

    const handleDelete = async (id) => {
        if (!id || typeof id !== "string") {
            console.error("Invalid product ID for deletion:", id);
            alert("Error: Cannot delete product with invalid ID.");
            return;
        }
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteDoc(doc(db, "products", id));
            } catch (error) {
                console.error("Error deleting product:", error);
                alert("Failed to delete product.");
            }
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingProduct(null);
    };

    const handleAddProduct = () => {
        const plan = subscriptionPlan || "free";
        const productLimit = plan === "free" ? 5 : Infinity;

        if (products.length >= productLimit) {
            setShowUpgradeModal(true);
            return;
        }

        setIsFormOpen(true);
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading products...</div>;

    return (
        <div>
            {/* Upgrade Modal */}
            {showUpgradeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-6 text-white relative">
                            <button
                                onClick={() => setShowUpgradeModal(false)}
                                className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <div className="flex items-center gap-3 mb-2">
                                <Crown size={32} className="text-yellow-300" />
                                <h2 className="text-2xl font-bold">Upgrade to PREMIUM</h2>
                            </div>
                            <p className="text-pink-100">Unlock unlimited potential for your business!</p>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                                <p className="text-red-800 font-medium">
                                    🚫 Product Limit Reached
                                </p>
                                <p className="text-red-700 text-sm mt-1">
                                    You've reached the maximum of 5 products on the FREE plan. Upgrade to PREMIUM to add unlimited products!
                                </p>
                            </div>

                            {/* Plan Comparison */}
                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                                {/* FREE Plan */}
                                <div className="border-2 border-gray-300 rounded-xl p-4 bg-gray-50">
                                    <div className="text-center mb-4">
                                        <p className="text-sm text-gray-600 font-medium">CURRENT PLAN</p>
                                        <p className="text-2xl font-bold text-gray-900">FREE</p>
                                    </div>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <Check size={16} className="text-green-600 shrink-0 mt-0.5" />
                                            <span>Max 5 products</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check size={16} className="text-green-600 shrink-0 mt-0.5" />
                                            <span>₹10,000/month limit</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <X size={16} className="text-red-500 shrink-0 mt-0.5" />
                                            <span className="text-gray-500">No reviews access</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <X size={16} className="text-red-500 shrink-0 mt-0.5" />
                                            <span className="text-gray-500">No messaging</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* PREMIUM Plan */}
                                <div className="border-2 border-pink-500 rounded-xl p-4 bg-gradient-to-br from-pink-50 to-purple-50 relative">
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                                            RECOMMENDED
                                        </span>
                                    </div>
                                    <div className="text-center mb-4 mt-2">
                                        <p className="text-sm text-pink-600 font-medium">UPGRADE TO</p>
                                        <p className="text-2xl font-bold text-pink-600">PREMIUM</p>
                                        <p className="text-sm text-gray-600">₹499/year</p>
                                    </div>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <Check size={16} className="text-green-600 shrink-0 mt-0.5" />
                                            <span className="font-medium">Unlimited products</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check size={16} className="text-green-600 shrink-0 mt-0.5" />
                                            <span className="font-medium">No earning limits</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check size={16} className="text-green-600 shrink-0 mt-0.5" />
                                            <span className="font-medium">Customer reviews</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check size={16} className="text-green-600 shrink-0 mt-0.5" />
                                            <span className="font-medium">Direct messaging</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check size={16} className="text-green-600 shrink-0 mt-0.5" />
                                            <span className="font-medium">Priority listings</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowUpgradeModal(false)}
                                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Maybe Later
                                </button>
                                <button
                                    onClick={() => {
                                        setShowUpgradeModal(false);
                                        router.push("/seller/upgrade");
                                    }}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-bold hover:from-pink-700 hover:to-purple-700 transition-all shadow-lg shadow-pink-200"
                                >
                                    Upgrade Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Your Products ({products.length}{subscriptionPlan === "free" ? "/5" : ""})</h2>
                    {subscriptionPlan === "free" && products.length >= 5 && (
                        <p className="text-sm text-orange-600 mt-1">Product limit reached. Upgrade to add more!</p>
                    )}
                </div>
                <button
                    onClick={handleAddProduct}
                    className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-pink-200"
                >
                    <Plus size={18} />
                    Add Product
                </button>
            </div>

            {products.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4 text-pink-300">
                        <Package size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No products yet</h3>
                    <p className="text-gray-500 mb-6">Start adding products to your shop.</p>
                    {subscriptionPlan === "free" && (
                        <p className="text-sm text-gray-600 mb-4">FREE plan: Up to 5 products</p>
                    )}
                    <button
                        onClick={handleAddProduct}
                        className="text-pink-600 font-medium hover:underline"
                    >
                        Add your first product
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                            <div className="h-40 bg-gray-100 flex items-center justify-center text-gray-400">
                                {product.image ? (
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Package size={40} className="opacity-20" />
                                )}
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-semibold text-gray-800 truncate pr-2">{product.name}</h3>
                                    <span className="font-bold text-pink-600">₹{product.price}</span>
                                </div>
                                {product.caption && (
                                    <p className="text-xs text-gray-400 italic mb-2">{product.caption}</p>
                                )}
                                <p className="text-sm text-gray-500 line-clamp-2 mb-3 h-10">{product.description || "No description"}</p>

                                <div className="flex gap-2 pt-2 border-t border-gray-50">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="flex-1 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Pencil size={16} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="flex-1 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isFormOpen && (
                <ProductForm
                    isOpen={isFormOpen}
                    onClose={handleCloseForm}
                    productToEdit={editingProduct}
                    sellerId={sellerId}
                />
            )}
        </div>
    );
}
