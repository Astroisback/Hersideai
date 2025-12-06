"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Filter, Star, MapPin, ChevronDown, ShoppingBag, Package, User, Home, ShoppingCart, Heart, ShieldCheck } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove, getDoc, setDoc } from "firebase/firestore";

function ExplorePageContent() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get("category") || "All";

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: initialCategory,
        priceRange: "all",
        rating: "all",
        verifiedOnly: false,
    });

    const [wishlist, setWishlist] = useState([]);

    const [sellerVerificationMap, setSellerVerificationMap] = useState({});

    useEffect(() => {
        fetchServices();
        fetchSellers();
        const customerId = localStorage.getItem("customerId");
        if (customerId) {
            fetchWishlist(customerId);
        }
    }, []);

    const fetchSellers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "sellers"));
            const map = {};
            querySnapshot.forEach(doc => {
                map[doc.id] = doc.data().isVerified || false;
            });
            setSellerVerificationMap(map);
        } catch (error) {
            console.error("Error fetching sellers:", error);
        }
    };

    // ... fetchWishlist ...

    // ... toggleWishlist ...

    // ... fetchServices ...

    const filteredServices = services.filter((service) => {
        // Verified Only Filter
        if (filters.verifiedOnly) {
            const isVerified = sellerVerificationMap[service.sellerId];
            if (!isVerified) return false;
        }

        if (filters.category !== "All") {
            if (filters.category === "Others") {
                if (service.category && service.category !== "Others") {
                    return false;
                }
                return true;
            } else if (service.category !== filters.category) {
                if (service.category) {
                    return service.category === filters.category;
                }
                return false;
            }
        }

        if (filters.priceRange !== "all") {
            const price = parseInt(service.price);
            if (filters.priceRange === "low" && price > 500) return false;
            if (filters.priceRange === "medium" && (price <= 500 || price > 2000)) return false;
            if (filters.priceRange === "high" && price <= 2000) return false;
        }

        if (filters.rating === "4plus") {
            return true;
        }

        return true;
    });

    const categories = ["All", "Beauty Services", "Homemade Food", "Tailoring", "Small Shops", "Handicrafts", "Others"];

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <header className="bg-white p-4 shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-4 mb-4">
                    <Link href="/customer" className="text-gray-600">
                        <ChevronDown className="rotate-90" size={24} />
                    </Link>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border-none focus:ring-2 focus:ring-pink-500 outline-none"
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    </div>
                    <button className="p-2 bg-gray-100 rounded-lg text-gray-600">
                        <Filter size={20} />
                    </button>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <button
                        onClick={() => setFilters({ ...filters, verifiedOnly: !filters.verifiedOnly })}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${filters.verifiedOnly
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        <ShieldCheck size={14} />
                        Verified
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilters({ ...filters, category: cat })}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filters.category === cat
                                ? "bg-pink-600 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </header>

            <main className="p-4">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredServices.map((service) => (
                            <Link
                                href={`/customer/service/${service.id}`}
                                key={service.id}
                                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4"
                            >
                                <div className="w-24 h-24 bg-gray-200 rounded-lg shrink-0 overflow-hidden relative">
                                    <button
                                        onClick={(e) => toggleWishlist(e, service)}
                                        className="absolute top-1 right-1 p-1 bg-white/80 rounded-full z-10"
                                    >
                                        <Heart
                                            size={14}
                                            className={wishlist.some(item => item.id === service.id) ? "fill-red-500 text-red-500" : "text-gray-500"}
                                        />
                                    </button>
                                    {service.image ? (
                                        <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-1">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-gray-800 line-clamp-1">{service.name}</h3>
                                        <div className="flex items-center gap-1 text-xs font-bold text-gray-800 bg-yellow-100 px-1.5 py-0.5 rounded">
                                            <Star size={10} className="text-yellow-600 fill-yellow-600" />
                                            4.5
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 line-clamp-2 mt-1 mb-2">{service.description}</p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="font-bold text-pink-600">₹{service.price}</span>
                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                            <MapPin size={12} /> 2.5 km
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {filteredServices.length === 0 && (
                            <div className="text-center py-10 text-gray-500">
                                No services found. Try changing filters.
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-3 z-20">
                <Link href="/customer" className="flex flex-col items-center gap-1 text-gray-400 hover:text-pink-600">
                    <Home size={24} />
                    <span className="text-[10px] font-medium">Home</span>
                </Link>
                <Link href="/customer/explore" className="flex flex-col items-center gap-1 text-pink-600">
                    <Search size={24} />
                    <span className="text-[10px] font-medium">Explore</span>
                </Link>
                <Link href="/customer/cart" className="flex flex-col items-center gap-1 text-gray-400 hover:text-pink-600">
                    <ShoppingCart size={24} />
                    <span className="text-[10px] font-medium">Cart</span>
                </Link>
                <Link href="/customer/dashboard" className="flex flex-col items-center gap-1 text-gray-400 hover:text-pink-600">
                    <Package size={24} />
                    <span className="text-[10px] font-medium">Orders</span>
                </Link>
                <Link href="/customer/dashboard" className="flex flex-col items-center gap-1 text-gray-400 hover:text-pink-600">
                    <User size={24} />
                    <span className="text-[10px] font-medium">Account</span>
                </Link>
            </div>
        </div>
    );
}

export default function ExplorePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div></div>}>
            <ExplorePageContent />
        </Suspense>
    );
}
