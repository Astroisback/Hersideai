"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { Store, Package, ShoppingBag, MapPin, LogOut, ChevronDown, Circle, MessageSquare, Star, Crown, Languages, BarChart, Briefcase, User, Trash2 } from "lucide-react";
import ProductList from "@/components/dashboard/ProductList";
import ServiceManager from "@/components/dashboard/ServiceManager";
import OrderList from "@/components/dashboard/OrderList";
import ChatList from "@/components/dashboard/ChatList";
import ChatWindow from "@/components/dashboard/ChatWindow";
import ReviewsList from "@/components/dashboard/ReviewsList";
import AnalyticsDashboard from "@/components/dashboard/AnalyticsDashboard";
import { translations } from "@/utils/translations";
import { getConditionalLabels } from "@/utils/serviceHelpers";
import { deleteSellerAccount } from "@/utils/accountDeletion";
import ProfilePictureUpload from "@/components/shared/ProfilePictureUpload";
import dynamic from "next/dynamic";

const AddressPicker = dynamic(() => import("@/components/shared/AddressPicker"), {
    ssr: false,
    loading: () => <div className="h-[300px] bg-gray-100 rounded-xl flex items-center justify-center">Loading Map...</div>
});

export default function SellerDashboard() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState("products");
    const [sellerData, setSellerData] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [storeStatus, setStoreStatus] = useState("live");
    const [selectedChat, setSelectedChat] = useState(null);
    const [language, setLanguage] = useState("en");
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [profileEditData, setProfileEditData] = useState({});

    const t = translations[language];

    // Get conditional labels based on business type
    const labels = getConditionalLabels(sellerData?.businessType || "seller", t);

    useEffect(() => {
        if (user?.id) {
            // Initial set
            setSellerData(user);

            // Real-time listener for subscription status changes
            const unsubscribe = onSnapshot(doc(db, "sellers", user.id), (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const newData = { id: docSnapshot.id, ...docSnapshot.data() };
                    setSellerData(newData);
                    setStoreStatus(newData.storeStatus || "live");

                    // Handle tab access based on new plan
                    const plan = newData.subscriptionPlan || "free";
                    if (plan === "free" && (activeTab === "reviews" || activeTab === "messages")) {
                        setActiveTab("products");
                    }
                }
            });

            return () => unsubscribe();
        }
    }, [user]);

    const toggleStoreStatus = async () => {
        const newStatus = storeStatus === "live" ? "offline" : "live";
        setStoreStatus(newStatus);
        if (sellerData?.id) {
            await updateDoc(doc(db, "sellers", sellerData.id), {
                storeStatus: newStatus
            });
        }
    };

    const toggleLanguage = () => {
        setLanguage(prev => prev === "en" ? "hi" : "en");
    };

    const handleDeleteAccount = async () => {
        if (!confirm("Are you sure? This will permanently delete your account, business profile, products, and all associated data. This action cannot be undone.")) {
            return;
        }

        try {
            await deleteSellerAccount(sellerData.id);
            logout("/"); // Redirect to homepage after deletion
            alert("Your account and all associated data has been permanently deleted.");
        } catch (error) {
            console.error("Error deleting account:", error);
            alert("Failed to delete account. Please try again.");
        }
    };

    const handleEditProfile = () => {
        setProfileEditData({
            name: sellerData?.name || "",
            email: sellerData?.email || "",
            phone: sellerData?.phone || "",
            whatsapp: sellerData?.whatsapp || "",
            gender: sellerData?.gender || "",
            profilePicture: sellerData?.profilePicture || null,
            displayName: sellerData?.displayName || "",
            businessName: sellerData?.businessName || "",
            description: sellerData?.description || "",
            address: sellerData?.address || "",
            location: sellerData?.location || null,
            city: sellerData?.city || "",
            state: sellerData?.state || "",
            pincode: sellerData?.pincode || "",
            category: sellerData?.category || ""
        });
        setShowEditProfile(true);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await updateDoc(doc(db, "sellers", sellerData.id), {
                name: profileEditData.name,
                email: profileEditData.email || null,
                phone: profileEditData.phone,
                whatsapp: profileEditData.whatsapp,
                gender: profileEditData.gender || null,
                profilePicture: profileEditData.profilePicture || null,
                displayName: profileEditData.displayName,
                businessName: profileEditData.businessName,
                description: profileEditData.description || null,
                address: profileEditData.address || null,
                location: profileEditData.location || null,
                city: profileEditData.city || null,
                state: profileEditData.state || null,
                pincode: profileEditData.pincode || null,
                category: profileEditData.category
            });
            alert("Profile updated successfully!");
            setShowEditProfile(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        }
    };

    const isPremium = sellerData?.subscriptionPlan === "premium";

    return (
        <div className="min-h-screen bg-gray-50 transition-colors duration-300">
            <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-20 transition-colors duration-300">
                <div className="flex items-center gap-2 text-pink-600">
                    <Store size={24} />
                    <span className="font-bold text-lg hidden md:block">{t.brandName}</span>
                </div>

                <div className="flex items-center gap-4">
                    {sellerData?.id && (
                        <a
                            href={`/shop/${sellerData.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-pink-600 hover:text-pink-700 hover:underline"
                        >
                            {t.viewShop}
                        </a>
                    )}

                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                        >
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-medium text-gray-800">{sellerData?.displayName || t.defaultSellerName}</p>
                                <div className="flex items-center gap-1">
                                    <p className="text-xs text-gray-500">{sellerData?.businessName}</p>
                                    {isPremium && (
                                        <Crown size={12} className="text-yellow-500" />
                                    )}
                                </div>
                            </div>
                            <div className="h-10 w-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold border border-pink-200">
                                {sellerData?.displayName?.[0] || "S"}
                            </div>
                            <ChevronDown size={16} className="text-gray-400" />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in duration-200 z-30">
                                <div className="px-4 py-2 border-b border-gray-50">
                                    <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-2">{t.storeStatus}</p>
                                    <button
                                        onClick={toggleStoreStatus}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${storeStatus === "live"
                                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                            }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <Circle size={10} fill="currentColor" />
                                            {storeStatus === "live" ? t.online : t.offline}
                                        </span>
                                        <span className="text-xs opacity-75">{t.change}</span>
                                    </button>
                                </div>

                                <div className="px-4 py-2 border-b border-gray-50">
                                    <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-2">{t.language}</p>
                                    <button
                                        onClick={toggleLanguage}
                                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-gray-50 text-gray-700 hover:bg-gray-100"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Languages size={16} />
                                            {language === "en" ? "English" : "हिंदी"}
                                        </span>
                                        <span className="text-xs opacity-75">{t.change}</span>
                                    </button>
                                </div>

                                <div className="py-1">
                                    <Link
                                        href="/seller/profile"
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <User size={16} />
                                        View Profile
                                    </Link>
                                    <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                        <LogOut size={16} />
                                        {t.logout}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto p-6">
                {/* Upgrade Banner for FREE plan */}
                {!isPremium && (
                    <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl p-6 mb-6 text-white shadow-xl">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                    <Crown size={24} className="text-yellow-300" />
                                    {t.upgradeToPremium}
                                </h3>
                                <p className="text-pink-100 text-sm">
                                    {t.premiumBenefits}
                                </p>
                            </div>
                            <button
                                onClick={() => router.push("/seller/upgrade")}
                                className="bg-white text-pink-600 px-6 py-3 rounded-xl font-bold hover:bg-pink-50 transition-colors whitespace-nowrap shadow-lg"
                            >
                                {t.upgradeNow}
                            </button>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-4 mb-8 overflow-x-auto scrollbar-hide pb-2">
                    <button
                        onClick={() => setActiveTab("products")}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === "products"
                            ? "bg-pink-600 text-white shadow-lg shadow-pink-200"
                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                            }`}
                    >
                        {labels.isServiceMode ? <Briefcase size={20} /> : <Package size={20} />}
                        {labels.myProductsOrServices}
                        {!isPremium && sellerData?.productCount !== undefined && (
                            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                                {sellerData.productCount}/5
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === "orders"
                            ? "bg-pink-600 text-white shadow-lg shadow-pink-200"
                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                            }`}
                    >
                        <ShoppingBag size={20} />
                        {labels.ordersOrBookings}
                    </button>

                    {/* Only show Reviews and Messages for PREMIUM users */}
                    {isPremium && (
                        <>
                            <button
                                onClick={() => setActiveTab("reviews")}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === "reviews"
                                    ? "bg-pink-600 text-white shadow-lg shadow-pink-200"
                                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                                    }`}
                            >
                                <Star size={20} />
                                {t.reviews}
                            </button>
                            <button
                                onClick={() => setActiveTab("messages")}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === "messages"
                                    ? "bg-pink-600 text-white shadow-lg shadow-pink-200"
                                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                                    }`}
                            >
                                <MessageSquare size={20} />
                                {t.messages}
                            </button>
                            <button
                                onClick={() => setActiveTab("analytics")}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === "analytics"
                                    ? "bg-pink-600 text-white shadow-lg shadow-pink-200"
                                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                                    }`}
                            >
                                <BarChart size={20} />
                                {t.analytics}
                            </button>
                        </>
                    )}

                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === "profile"
                            ? "bg-pink-600 text-white shadow-lg shadow-pink-200"
                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                            }`}
                    >
                        <User size={20} />
                        Profile
                    </button>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {activeTab === "products" && (
                        labels.isServiceMode ? (
                            <ServiceManager sellerId={sellerData?.id} />
                        ) : (
                            <ProductList sellerId={sellerData?.id} subscriptionPlan={sellerData?.subscriptionPlan} />
                        )
                    )}
                    {activeTab === "orders" && (
                        <OrderList
                            sellerId={sellerData?.id}
                            subscriptionPlan={sellerData?.subscriptionPlan}
                            businessType={sellerData?.businessType || "seller"}
                        />
                    )}
                    {activeTab === "reviews" && isPremium && <ReviewsList sellerId={sellerData?.id} />}
                    {activeTab === "messages" && isPremium && (
                        <div className="grid md:grid-cols-3 gap-6 h-[600px]">
                            <div className="md:col-span-1 overflow-y-auto border-r border-gray-100 pr-4">
                                <ChatList userId={sellerData?.id} onSelectChat={setSelectedChat} />
                            </div>
                            <div className="md:col-span-2">
                                {selectedChat ? (
                                    <ChatWindow
                                        chatId={selectedChat.id}
                                        currentUserId={sellerData?.id}
                                        recipientName={selectedChat.customerName}
                                        onClose={() => setSelectedChat(null)}
                                    />
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-2xl border border-gray-100">
                                        <MessageSquare size={48} className="mb-4 opacity-20" />
                                        <p>{t.selectChat}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {activeTab === "analytics" && isPremium && <AnalyticsDashboard sellerId={sellerData?.id} language={language} />}

                    {activeTab === "profile" && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-2xl mx-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <User className="text-pink-600" />
                                    Profile Settings
                                </h2>
                                <button
                                    onClick={handleEditProfile}
                                    className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium"
                                >
                                    Edit Profile
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <p className="text-xs text-gray-500 mb-1">Display Name</p>
                                        <p className="font-medium text-gray-900">{sellerData?.displayName || "Not set"}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <p className="text-xs text-gray-500 mb-1">Business Name</p>
                                        <p className="font-medium text-gray-900">{sellerData?.businessName || "Not set"}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <p className="text-xs text-gray-500 mb-1">Phone</p>
                                        <p className="font-medium text-gray-900">{sellerData?.phone || "Not set"}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <p className="text-xs text-gray-500 mb-1">Email</p>
                                        <p className="font-medium text-gray-900">{sellerData?.email || "Not set"}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <p className="text-xs text-gray-500 mb-1">Gender</p>
                                        <p className="font-medium text-gray-900 capitalize">{sellerData?.gender || "Not set"}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <p className="text-xs text-gray-500 mb-1">Plan</p>
                                        <p className="font-medium text-gray-900 capitalize">{sellerData?.subscriptionPlan || "Free"}</p>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100">
                                    <h3 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Deleting your account is permanent. All your products, orders, messages, and business data will be wiped out immediately.
                                    </p>
                                    <button
                                        onClick={handleDeleteAccount}
                                        className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2 border border-red-100"
                                    >
                                        <Trash2 size={20} />
                                        Delete Account Permanently
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Profile Modal */}
            {showEditProfile && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
                                <button onClick={() => setShowEditProfile(false)} className="text-gray-400 hover:text-gray-600">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div className="flex flex-col items-center pb-4 border-b border-gray-100">
                                    <ProfilePictureUpload
                                        value={profileEditData.profilePicture}
                                        onChange={(pic) => setProfileEditData({ ...profileEditData, profilePicture: pic })}
                                    />
                                </div>

                                <div><h3 className="font-semibold text-gray-900 mb-3">Personal Information</h3></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input type="text" value={profileEditData.name || ""} onChange={(e) => setProfileEditData({ ...profileEditData, name: e.target.value })} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input type="email" value={profileEditData.email || ""} onChange={(e) => setProfileEditData({ ...profileEditData, email: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" placeholder="your@email.com" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input type="tel" value={profileEditData.phone || ""} onChange={(e) => setProfileEditData({ ...profileEditData, phone: e.target.value })} required maxLength={10} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                                        <input type="tel" value={profileEditData.whatsapp || ""} onChange={(e) => setProfileEditData({ ...profileEditData, whatsapp: e.target.value })} maxLength={10} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                        <select value={profileEditData.gender || ""} onChange={(e) => setProfileEditData({ ...profileEditData, gender: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none">
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                            <option value="prefer_not_to_say">Prefer not to say</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-4"><h3 className="font-semibold text-gray-900 mb-3">Business Information</h3></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                                        <input type="text" value={profileEditData.displayName || ""} onChange={(e) => setProfileEditData({ ...profileEditData, displayName: e.target.value })} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                                        <input type="text" value={profileEditData.businessName || ""} onChange={(e) => setProfileEditData({ ...profileEditData, businessName: e.target.value })} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea value={profileEditData.description || ""} onChange={(e) => setProfileEditData({ ...profileEditData, description: e.target.value })} rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none resize-none" placeholder="Tell customers about your business..." />
                                </div>

                                <div className="pt-4">
                                    <AddressPicker
                                        value={{
                                            location: profileEditData.location,
                                            fullAddress: profileEditData.address,
                                            city: profileEditData.city,
                                            state: profileEditData.state,
                                            pincode: profileEditData.pincode
                                        }}
                                        onChange={(addr) => setProfileEditData({
                                            ...profileEditData,
                                            address: addr.fullAddress,
                                            location: addr.location,
                                            city: addr.city,
                                            state: addr.state,
                                            pincode: addr.pincode
                                        })}
                                        label="Business Address"
                                    />
                                </div>

                                <button type="submit" className="w-full py-3 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 transition-colors">
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
