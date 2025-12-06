"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { ArrowLeft, ShoppingBag, Star, MapPin, Store, Minus, Plus, ShoppingCart, Loader } from "lucide-react";
import Link from "next/link";

export default function ProductDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const [product, setProduct] = useState(null);
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        if (id) {
            fetchProductAndSeller();
        }
    }, [id]);

    const fetchProductAndSeller = async () => {
        setLoading(true);
        try {
            // 1. Fetch Product
            const productRef = doc(db, "products", id);
            const productSnap = await getDoc(productRef);

            if (productSnap.exists()) {
                const productData = { id: productSnap.id, ...productSnap.data() };
                setProduct(productData);

                // 2. Fetch Seller
                if (productData.sellerId) {
                    const sellerRef = doc(db, "sellers", productData.sellerId);
                    const sellerSnap = await getDoc(sellerRef);
                    if (sellerSnap.exists()) {
                        setSeller({ id: sellerSnap.id, ...sellerSnap.data() });
                    }
                }
            } else {
                console.error("Product not found");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        const customerId = localStorage.getItem("customerId");
        if (!customerId) {
            alert("Please login to add items to cart");
            router.push("/customer");
            return;
        }

        setAddingToCart(true);
        try {
            await addDoc(collection(db, `carts/${customerId}/items`), {
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.image || "",
                sellerId: product.sellerId,
                quantity: quantity,
                addedAt: new Date()
            });
            alert("Added to cart successfully!");
            router.push("/customer/cart");
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Failed to add to cart");
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader className="animate-spin text-pink-600" size={32} />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
                <p className="text-gray-500">Product not found</p>
                <Link href="/customer/explore" className="text-pink-600 font-bold hover:underline">
                    Back to Explore
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <header className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center gap-4">
                <button onClick={() => router.back()} className="text-gray-600 hover:text-pink-600 transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="font-bold text-lg text-gray-800 truncate">Product Details</h1>
            </header>

            <main className="max-w-4xl mx-auto p-4 md:p-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden grid md:grid-cols-2 gap-0 md:gap-8">
                    {/* Image Section */}
                    <div className="h-80 md:h-full bg-gray-100 relative group">
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <ShoppingBag size={64} />
                            </div>
                        )}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                            <span className="text-pink-600 font-bold">₹{product.price}</span>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="p-6 md:p-8 flex flex-col h-full">
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                            </div>

                            {seller && (
                                <Link href={`/shop/${seller.id}`} className="inline-flex items-center gap-2 text-sm text-gray-500 mb-6 hover:text-pink-600 transition-colors bg-gray-50 px-3 py-1.5 rounded-lg">
                                    <Store size={16} />
                                    <span>{seller.businessName}</span>
                                </Link>
                            )}

                            <div className="prose prose-sm text-gray-600 mb-8">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Description</h3>
                                <p className="leading-relaxed">{product.description || "No description available."}</p>
                            </div>

                            {/* Variants if any */}
                            {product.variants && product.variants.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Options</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {product.variants.map((variant, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-700 border border-gray-200">
                                                {variant.name} (+₹{variant.price})
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="border-t border-gray-100 pt-6 mt-auto">
                            <div className="flex items-center justify-between gap-4 mb-4">
                                <span className="font-medium text-gray-700">Quantity</span>
                                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-pink-600 disabled:opacity-50"
                                        disabled={quantity <= 1}
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="w-8 text-center font-bold text-gray-900">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-pink-600"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={addingToCart}
                                className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-pink-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {addingToCart ? (
                                    <>
                                        <Loader size={20} className="animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart size={20} />
                                        Add to Cart • ₹{product.price * quantity}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
