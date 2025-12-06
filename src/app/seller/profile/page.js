"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, ShieldCheck, Store, Crown, Languages, Trash2, Edit, MessageSquare } from "lucide-react";
import Link from "next/link";
import { deleteSellerAccount } from "@/utils/accountDeletion";
import ProfilePictureUpload from "@/components/shared/ProfilePictureUpload";
import dynamic from "next/dynamic";

const AddressPicker = dynamic(() => import("@/components/shared/AddressPicker"), {
    ssr: false,
    loading: () => <div className="h-[300px] bg-gray-100 rounded-xl flex items-center justify-center">Loading Map...</div>
});

export default function SellerProfile() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [sellerData, setSellerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [language, setLanguage] = useState("en");
    const [profileEditData, setProfileEditData] = useState({});

    useEffect(() => {
        if (!user || user.role !== "seller") {
            router.push("/seller");
            return;
        }

        // Real-time listener for seller data
        const unsubscribe = onSnapshot(doc(db, "sellers", user.id), (docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = { id: docSnapshot.id, ...docSnapshot.data() };
                setSellerData(data);
                setLoading(false);
            } else {
                router.push("/seller");
            }
        });

        return () => unsubscribe();
    }, [user, router]);

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

    const handleDeleteAccount = async () => {
        if (!confirm("Are you sure? This will permanently delete your seller account and all linked data including products, services, reviews, chats, orders, and analytics. This action cannot be undone.")) {
            return;
        }

        try {
            await deleteSellerAccount(sellerData.id);
            logout("/");
            alert("Your account and all associated data has been permanently deleted.");
        } catch (error) {
            console.error("Error deleting account:", error);
            alert("Failed to delete account. Please try again.");
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return "N/A";
        try {
            return new Date(timestamp.toDate()).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
            });
        } catch {
            return "N/A";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/seller/dashboard" className="text-gray-600 hover:text-gray-900">
                            <ArrowLeft size={24} />
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
                    </div>
                    <button
                        onClick={() => setLanguage(prev => prev === "en" ? "hi" : "en")}
                        className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-pink-600 transition-colors"
                    >
                        <Languages size={20} />
                        <span className="text-sm font-medium">{language === "en" ? "EN" : "HI"}</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="relative mb-4">
                            {sellerData?.profilePicture ? (
                                <img
                                    src={sellerData.profilePicture}
                                    alt={sellerData.name}
                                    className="w-32 h-32 rounded-full object-cover border-4 border-pink-100"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-pink-100">
                                    <User size={48} className="text-gray-400" />
                                </div>
                            )}
                            {sellerData?.isVerified && (
                                <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-2">
                                    <ShieldCheck size={20} className="text-white" />
                                </div>
                            )}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">{sellerData?.name}</h2>
                        <p className="text-gray-600 mb-2">{sellerData?.businessName}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar size={16} />
                            Joined {formatDate(sellerData?.createdAt)}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleEditProfile}
                                className="flex items-center gap-2 px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
                            >
                                <Edit size={18} />
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <User className="text-pink-600" size={20} />
                        Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                <Mail size={14} />
                                Email
                            </div>
                            <p className="font-medium text-gray-900">{sellerData?.email || "Not set"}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                <Phone size={14} />
                                Phone
                            </div>
                            <p className="font-medium text-gray-900">{sellerData?.phone || "Not set"}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                <MessageSquare size={14} />
                                WhatsApp
                            </div>
                            <p className="font-medium text-gray-900">{sellerData?.whatsapp || "Not set"}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                <User size={14} />
                                Gender
                            </div>
                            <p className="font-medium text-gray-900 capitalize">{sellerData?.gender || "Not set"}</p>
                        </div>
                    </div>
                </div>

                {/* Business Information */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Store className="text-pink-600" size={20} />
                        Business Information
                    </h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-xs text-gray-500 mb-1">Business Name</p>
                                <p className="font-medium text-gray-900">{sellerData?.businessName || "Not set"}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-xs text-gray-500 mb-1">Display Name</p>
                                <p className="font-medium text-gray-900">{sellerData?.displayName || "Not set"}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-xs text-gray-500 mb-1">Category</p>
                                <p className="font-medium text-gray-900 capitalize">{sellerData?.category || "Not set"}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-xs text-gray-500 mb-1">Business Type</p>
                                <p className="font-medium text-gray-900 capitalize">{sellerData?.businessType || "Not set"}</p>
                            </div>
                        </div>
                        {sellerData?.description && (
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-xs text-gray-500 mb-1">Description</p>
                                <p className="text-gray-700">{sellerData.description}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Address */}
                {sellerData?.address && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <MapPin className="text-pink-600" size={20} />
                            Business Address
                        </h3>
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <p className="text-gray-700 mb-2">{sellerData.address}</p>
                            {(sellerData.city || sellerData.state || sellerData.pincode) && (
                                <p className="text-sm text-gray-600">
                                    {[sellerData.city, sellerData.state, sellerData.pincode].filter(Boolean).join(", ")}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Account Information */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Crown className="text-pink-600" size={20} />
                        Account Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <p className="text-xs text-gray-500 mb-1">Subscription Plan</p>
                            <p className="font-medium text-gray-900 capitalize flex items-center gap-2">
                                {sellerData?.subscriptionPlan === "premium" && <Crown size={16} className="text-yellow-500" />}
                                {sellerData?.subscriptionPlan || "Free"}
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <p className="text-xs text-gray-500 mb-1">Store Status</p>
                            <p className="font-medium text-gray-900 capitalize">{sellerData?.storeStatus || "Live"}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <p className="text-xs text-gray-500 mb-1">Verification</p>
                            <p className="font-medium text-gray-900 flex items-center gap-2">
                                {sellerData?.isVerified ? (
                                    <>
                                        <ShieldCheck size={16} className="text-green-500" />
                                        Verified
                                    </>
                                ) : (
                                    "Not Verified"
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-6">
                    <h3 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Deleting your account is permanent. All your products, orders, messages, and business data will be wiped out immediately.
                    </p>
                    <button
                        onClick={handleDeleteAccount}
                        className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2 border border-red-200"
                    >
                        <Trash2 size={20} />
                        Delete Account Permanently
                    </button>
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
