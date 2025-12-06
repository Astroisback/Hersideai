"use client";
import { useState, useEffect, Suspense } from "react";
import { ShoppingBag, MessageCircle, Heart, User, Package, LogOut, Search, MapPin, CreditCard, X, Plus, Trash2, Home, ShoppingCart, Check, Clock, CheckCircle, Truck, ChefHat, Calendar, XCircle, Star, PenTool } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc, getDoc, arrayRemove, onSnapshot, addDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ChatList from "@/components/dashboard/ChatList";
import ChatWindow from "@/components/dashboard/ChatWindow";
import { deleteCustomerAccount } from "@/utils/accountDeletion";
import ProfilePictureUpload from "@/components/shared/ProfilePictureUpload";
import dynamic from "next/dynamic";

const AddressPicker = dynamic(() => import("@/components/shared/AddressPicker"), {
    ssr: false,
    loading: () => <div className="h-[300px] bg-gray-100 rounded-xl flex items-center justify-center">Loading Map...</div>
});

function CustomerDashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState("orders");
    const [orders, setOrders] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [customerName, setCustomerName] = useState("");
    const [customerId, setCustomerId] = useState("");
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [profileData, setProfileData] = useState({
        name: "",
        phone: "",
        username: "",
        email: "",
        gender: "",
        profilePicture: null,
        address: "",
        location: null,
        city: "",
        state: "",
        pincode: ""
    });
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState({ label: "", address: "", latitude: null, longitude: null });
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [wishlist, setWishlist] = useState([]);
    const [trackingOrder, setTrackingOrder] = useState(null);
    const [selectedChat, setSelectedChat] = useState(null);

    // Review State
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);

    const [paymentMethods] = useState([
        { id: 1, name: "UPI", icon: "💳", enabled: true },
        { id: 2, name: "Cash on Delivery", icon: "💵", enabled: true },
        { id: 3, name: "Net Banking", icon: "🏦", enabled: true }
    ]);

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab) {
            setActiveTab(tab);
        }

        const chatId = searchParams.get("chatId");
        if (chatId && activeTab === "messages") {
            const fetchChat = async () => {
                try {
                    const chatDoc = await getDoc(doc(db, "chats", chatId));
                    if (chatDoc.exists()) {
                        setSelectedChat({ id: chatDoc.id, ...chatDoc.data() });
                    }
                } catch (e) {
                    console.error("Error fetching chat", e);
                }
            };
            fetchChat();
        }
    }, [searchParams]);

    useEffect(() => {
        const storedName = localStorage.getItem("customerName");
        const storedId = localStorage.getItem("customerId");
        if (storedName) setCustomerName(storedName);
        if (storedId) {
            setCustomerId(storedId);
            fetchCustomerData(storedId);
        }
    }, []);

    useEffect(() => {
        if (customerId) {
            // Fetch Orders
            const qOrders = query(collection(db, "orders"), where("customerId", "==", customerId));
            const unsubOrders = onSnapshot(qOrders, (snapshot) => {
                const ords = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setOrders(ords.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)));
                setLoading(false);
            });

            // Fetch Bookings
            const qBookings = query(collection(db, "bookings"), where("customerId", "==", customerId));
            const unsubBookings = onSnapshot(qBookings, (snapshot) => {
                const bks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setBookings(bks.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
            });

            return () => {
                unsubOrders();
                unsubBookings();
            };
        }
    }, [customerId]);

    const fetchCustomerData = async (id) => {
        try {
            const docRef = doc(db, "customers", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setProfileData({
                    name: data.name || "",
                    phone: data.phone || "",
                    username: data.username || ""
                });
                setAddresses(data.addresses || []);
                setWishlist(data.wishlist || []);
            }
        } catch (error) {
            console.error("Error fetching customer data:", error);
        }
    };

    const getStatusColor = (status) => {
        const s = status?.toLowerCase() || "pending";
        switch (s) {
            case "pending": return "bg-yellow-100 text-yellow-700";
            case "accepted":
            case "approved": return "bg-green-100 text-green-700";
            case "preparing": return "bg-purple-100 text-purple-700";
            case "ready": return "bg-orange-100 text-orange-700";
            case "completed": return "bg-blue-100 text-blue-700";
            case "declined":
            case "busy": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusIcon = (status) => {
        const s = status?.toLowerCase() || "pending";
        const iconClass = "w-4 h-4";
        switch (s) {
            case "pending": return <Clock className={iconClass} />;
            case "accepted":
            case "approved": return <Check className={iconClass} />;
            case "preparing": return <ChefHat className={iconClass} />;
            case "ready": return <Truck className={iconClass} />;
            case "completed": return <CheckCircle className={iconClass} />;
            case "declined":
            case "busy": return <XCircle className={iconClass} />;
            default: return <Clock className={iconClass} />;
        }
    };

    const getStatusSteps = () => {
        return [
            { key: "pending", label: "Pending" },
            { key: "accepted", label: "Accepted" },
            { key: "preparing", label: "Preparing" },
            { key: "ready", label: "Ready" },
            { key: "completed", label: "Completed" }
        ];
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const docRef = doc(db, "customers", customerId);
            await updateDoc(docRef, {
                name: profileData.name,
                phone: profileData.phone,
                email: profileData.email || null,
                gender: profileData.gender || null,
                profilePicture: profileData.profilePicture || null,
                address: profileData.address || null,
                location: profileData.location || null,
                city: profileData.city || null,
                state: profileData.state || null,
                pincode: profileData.pincode || null
            });
            localStorage.setItem("customerName", profileData.name);
            setCustomerName(profileData.name);
            alert("Profile updated successfully!");
            setShowEditProfile(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile");
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm("Are you sure? This will permanently delete your account and all associated data. This action cannot be undone.")) {
            return;
        }

        try {
            setLoading(true);
            await deleteCustomerAccount(customerId);

            // Clear local storage
            localStorage.removeItem("customerId");
            localStorage.removeItem("customerName");

            alert("Your account and all associated data has been permanently deleted.");
            router.push("/");
        } catch (error) {
            console.error("Error deleting account:", error);
            alert("Failed to delete account. Please try again.");
            setLoading(false);
        }
    };

    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await response.json();
                    setNewAddress({
                        ...newAddress,
                        address: data.display_name || `Lat: ${latitude}, Long: ${longitude}`,
                        latitude,
                        longitude
                    });
                } catch (error) {
                    console.error("Error fetching address:", error);
                    setNewAddress({
                        ...newAddress,
                        address: `Lat: ${latitude}, Long: ${longitude}`,
                        latitude,
                        longitude
                    });
                }
                setLoadingLocation(false);
            },
            (error) => {
                console.error("Error getting location:", error);
                alert("Failed to get your location. Please enter address manually.");
                setLoadingLocation(false);
            }
        );
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            const updatedAddresses = [...addresses, { ...newAddress, id: Date.now() }];
            const docRef = doc(db, "customers", customerId);
            await updateDoc(docRef, {
                addresses: updatedAddresses
            });
            setAddresses(updatedAddresses);
            setNewAddress({ label: "", address: "", latitude: null, longitude: null });
            setShowAddAddress(false);
            alert("Address added successfully!");
        } catch (error) {
            console.error("Error adding address:", error);
            alert("Failed to add address");
        }
    };

    const handleDeleteAddress = async (addressId) => {
        if (!confirm("Delete this address?")) return;
        try {
            const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
            const docRef = doc(db, "customers", customerId);
            await updateDoc(docRef, {
                addresses: updatedAddresses
            });
            setAddresses(updatedAddresses);
            alert("Address deleted successfully!");
        } catch (error) {
            console.error("Error deleting address:", error);
            alert("Failed to delete address");
        }
    };

    const handleRemoveFromWishlist = async (item) => {
        try {
            const docRef = doc(db, "customers", customerId);
            await updateDoc(docRef, {
                wishlist: arrayRemove(item)
            });
            setWishlist(wishlist.filter(w => w.id !== item.id));
        } catch (error) {
            console.error("Error removing from wishlist:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("customerId");
        localStorage.removeItem("customerName");
        router.push("/customer");
    };

    // Review Logic
    const openReviewModal = (booking) => {
        // Eligibility Check
        const isApprovedOrCompleted = booking.status === 'approved' || booking.status === 'completed';
        if (!isApprovedOrCompleted) {
            alert("You can only review completed or approved bookings.");
            return;
        }

        // Time Check
        const bookingDate = new Date(booking.selectedDate); // YYYY-MM-DD
        const endTimeParts = booking.selectedTimeSlot.split(' - ')[1].split(':');
        bookingDate.setHours(parseInt(endTimeParts[0]), parseInt(endTimeParts[1]));

        // If booking date/time is in the future, prevent review
        // Note: This is a simple check. For production, consider timezone handling carefully.
        // Assuming booking.selectedDate is YYYY-MM-DD
        const now = new Date();
        // We need to parse selectedDate properly.
        // Let's assume selectedDate is "2023-10-27"
        const [year, month, day] = booking.selectedDate.split('-').map(Number);
        const bookingEnd = new Date(year, month - 1, day);

        // Parse end time "10:00" -> hours, minutes
        // Time slot format "09:00 - 10:00"
        const endTimeString = booking.selectedTimeSlot.split(' - ')[1].trim();
        const [hours, minutes] = endTimeString.split(':').map(Number);
        bookingEnd.setHours(hours, minutes, 0, 0);

        if (now < bookingEnd) {
            alert(`You can review this service after ${bookingEnd.toLocaleString()}`);
            return;
        }

        setSelectedBookingForReview(booking);
        setReviewRating(5);
        setReviewComment("");
        setShowReviewModal(true);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!selectedBookingForReview) return;

        setSubmittingReview(true);
        try {
            await addDoc(collection(db, "reviews"), {
                sellerId: selectedBookingForReview.sellerId,
                serviceId: selectedBookingForReview.serviceId,
                serviceName: selectedBookingForReview.serviceName,
                bookingId: selectedBookingForReview.id,
                customerId: customerId,
                customerName: customerName,
                rating: reviewRating,
                comment: reviewComment,
                bookingDate: selectedBookingForReview.selectedDate,
                createdAt: new Date()
            });

            // Optionally update booking to mark as reviewed
            await updateDoc(doc(db, "bookings", selectedBookingForReview.id), {
                isReviewed: true
            });

            alert("Review submitted successfully!");
            setShowReviewModal(false);
            setSelectedBookingForReview(null);
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Failed to submit review");
        } finally {
            setSubmittingReview(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <header className="bg-white p-6 shadow-sm mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
                <p className="text-gray-500">Welcome back, {customerName || "Guest"}!</p>
            </header>

            <div className="flex overflow-x-auto bg-white border-b border-gray-200 px-4 scrollbar-hide">
                {["orders", "bookings", "messages", "wishlist", "profile"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-4 font-medium text-sm capitalize whitespace-nowrap border-b-2 transition-colors ${activeTab === tab
                            ? "border-pink-600 text-pink-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <main className="p-4">
                {activeTab === "orders" && (
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-10">Loading orders...</div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">No orders found.</div>
                        ) : (
                            orders.map((order) => (
                                <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-gray-800">Order #{order.id.slice(0, 8)}</h3>
                                            <p className="text-xs text-gray-500">
                                                {order.timestamp?.toDate ? order.timestamp.toDate().toLocaleString() : "Recent"}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            {order.status || "Pending"}
                                        </span>
                                    </div>

                                    {/* Order Items */}
                                    <div className="border-t border-b border-gray-100 py-3 mb-4 space-y-2">
                                        {order.items?.map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-sm">
                                                <Link
                                                    href={`/customer/service/${item.id}`}
                                                    className="text-gray-700 hover:text-pink-600 transition-colors hover:underline"
                                                >
                                                    {item.quantity || 1}x {item.name}
                                                </Link>
                                                <span className="text-gray-900 font-medium">₹{item.price * (item.quantity || 1)}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-100">
                                            <span>Total</span>
                                            <span>₹{order.totalAmount}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setTrackingOrder(order)}
                                            className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
                                        >
                                            Track Order
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === "bookings" && (
                    <div className="space-y-4">
                        {bookings.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
                                <p>No bookings found.</p>
                                <Link href="/customer/explore?type=services" className="text-pink-600 font-medium mt-2 inline-block">
                                    Browse Services
                                </Link>
                            </div>
                        ) : (
                            bookings.map((booking) => (
                                <div key={booking.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-gray-800">{booking.serviceName}</h3>
                                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                <Calendar size={12} />
                                                {booking.selectedDate} • {booking.selectedTimeSlot}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                                            {getStatusIcon(booking.status)}
                                            {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : "Pending"}
                                        </span>
                                    </div>

                                    <div className="border-t border-gray-100 py-3 mb-2 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Service Fee</span>
                                            <span className="text-gray-900 font-medium">₹{booking.serviceFee}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Location</span>
                                            <span className="text-gray-900 text-right max-w-[200px] truncate">{booking.location}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Payment</span>
                                            <span className="text-gray-900 capitalize">{booking.paymentMethod === "upi" ? "UPI / Online" : "Cash After Work"}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 mt-3">
                                        {!booking.isReviewed && (booking.status === 'approved' || booking.status === 'completed') && (
                                            <button
                                                onClick={() => openReviewModal(booking)}
                                                className="flex-1 py-2 bg-pink-50 text-pink-600 rounded-lg text-sm font-medium hover:bg-pink-100 flex items-center justify-center gap-2"
                                            >
                                                <Star size={16} />
                                                Write Review
                                            </button>
                                        )}
                                        {booking.isReviewed && (
                                            <div className="flex-1 py-2 bg-gray-50 text-gray-500 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                                                <Check size={16} />
                                                Reviewed
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === "messages" && (
                    <div className="grid md:grid-cols-3 gap-6 h-[600px]">
                        <div className={`md:col-span-1 overflow-y-auto border-r border-gray-100 pr-4 ${selectedChat ? 'hidden md:block' : 'block'}`}>
                            <ChatList userId={customerId} onSelectChat={setSelectedChat} />
                        </div>
                        <div className={`md:col-span-2 ${selectedChat ? 'block' : 'hidden md:block'}`}>
                            {selectedChat ? (
                                <ChatWindow
                                    chatId={selectedChat.id}
                                    currentUserId={customerId}
                                    recipientName={selectedChat.participants[0] === customerId ? selectedChat.participantNames?.[1] : selectedChat.participantNames?.[0] || "Seller"}
                                    onClose={() => setSelectedChat(null)}
                                />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-2xl border border-gray-100">
                                    <MessageCircle size={48} className="mb-4 opacity-20" />
                                    <p>Select a conversation to start chatting</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "wishlist" && (
                    <div className="space-y-4">
                        {wishlist.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                <Heart size={48} className="mx-auto mb-4 text-gray-300" />
                                <p>Your wishlist is empty.</p>
                                <Link href="/customer/explore" className="text-pink-600 font-medium mt-2 inline-block">
                                    Explore Services
                                </Link>
                            </div>
                        ) : (
                            wishlist.map((item) => (
                                <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-gray-800 line-clamp-1">{item.name}</h3>
                                            <button onClick={() => handleRemoveFromWishlist(item)} className="text-red-500 p-1">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <p className="text-pink-600 font-bold mt-1">₹{item.price}</p>
                                        <Link
                                            href={`/customer/service/${item.id}`}
                                            className="text-xs text-pink-600 hover:underline mt-2 inline-block"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === "profile" && (
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
                                <button onClick={() => setShowEditProfile(true)} className="text-pink-600 text-sm font-medium">
                                    Edit
                                </button>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-gray-500">Name</p>
                                    <p className="font-medium text-gray-900">{profileData.name || "Not set"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Phone</p>
                                    <p className="font-medium text-gray-900">{profileData.phone || "Not set"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Username</p>
                                    <p className="font-medium text-gray-900">{profileData.username || "Not set"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <MapPin size={20} className="text-gray-500" />
                                    <span className="text-gray-700 font-medium">Saved Addresses</span>
                                </div>
                                <button onClick={() => setShowAddAddress(true)} className="text-pink-600 text-sm font-medium">
                                    <Plus size={20} />
                                </button>
                            </div>
                            {addresses.length === 0 ? (
                                <div className="p-4 text-center text-gray-500 text-sm">No saved addresses</div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {addresses.map((addr) => (
                                        <div key={addr.id} className="p-4 flex items-start justify-between hover:bg-gray-50">
                                            <div>
                                                <h4 className="font-medium text-gray-800">{addr.label}</h4>
                                                <p className="text-sm text-gray-600 mt-1">{addr.address}</p>
                                            </div>
                                            <button onClick={() => handleDeleteAddress(addr.id)} className="text-red-500 hover:text-red-700">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                                <CreditCard size={20} className="text-gray-500" />
                                <span className="text-gray-700 font-medium">Payment Methods</span>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {paymentMethods.map((method) => (
                                    <div key={method.id} className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{method.icon}</span>
                                            <span className="text-gray-700 font-medium">{method.name}</span>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${method.enabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                            {method.enabled ? "Enabled" : "Disabled"}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div onClick={handleLogout} className="p-4 flex items-center justify-between cursor-pointer hover:bg-red-50 text-red-600">
                                <div className="flex items-center gap-3">
                                    <LogOut size={20} />
                                    <span className="font-medium">Log Out</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-3 z-20">
                <Link href="/customer" className="flex flex-col items-center gap-1 text-gray-400 hover:text-pink-600">
                    <Home size={24} />
                    <span className="text-[10px] font-medium">Home</span>
                </Link>
                <Link href="/customer/explore" className="flex flex-col items-center gap-1 text-gray-400 hover:text-pink-600">
                    <Search size={24} />
                    <span className="text-[10px] font-medium">Explore</span>
                </Link>
                <Link href="/customer/cart" className="flex flex-col items-center gap-1 text-gray-400 hover:text-pink-600">
                    <ShoppingCart size={24} />
                    <span className="text-[10px] font-medium">Cart</span>
                </Link>
                <button
                    onClick={() => setActiveTab("orders")}
                    className={`flex flex-col items-center gap-1 ${activeTab === "orders" || activeTab === "bookings" ? "text-pink-600" : "text-gray-400 hover:text-pink-600"}`}
                >
                    <Package size={24} />
                    <span className="text-[10px] font-medium">Orders</span>
                </button>
                <button
                    onClick={() => setActiveTab("profile")}
                    className={`flex flex-col items-center gap-1 ${activeTab === "profile" ? "text-pink-600" : "text-gray-400 hover:text-pink-600"}`}
                >
                    <User size={24} />
                    <span className="text-[10px] font-medium">Account</span>
                </button>
            </div>

            {/* Edit Profile Modal */}
            {showEditProfile && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
                                <button onClick={() => setShowEditProfile(false)} className="text-gray-400 hover:text-gray-600">
                                    <X size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                {/* Profile Picture */}
                                <div className="flex flex-col items-center pb-4 border-b border-gray-100">
                                    <ProfilePictureUpload
                                        value={profileData.profilePicture}
                                        onChange={(pic) => setProfileData({ ...profileData, profilePicture: pic })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={profileData.name}
                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={profileData.email || ""}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            required
                                            maxLength={10}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                        <select
                                            value={profileData.gender || ""}
                                            onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                            <option value="prefer_not_to_say">Prefer not to say</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                    <input
                                        type="text"
                                        value={profileData.username}
                                        disabled
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-500"
                                    />
                                </div>

                                {/* Address with Map */}
                                <div>
                                    <AddressPicker
                                        value={{
                                            location: profileData.location,
                                            fullAddress: profileData.address,
                                            city: profileData.city,
                                            state: profileData.state,
                                            pincode: profileData.pincode
                                        }}
                                        onChange={(addr) => setProfileData({
                                            ...profileData,
                                            address: addr.fullAddress,
                                            location: addr.location,
                                            city: addr.city,
                                            state: addr.state,
                                            pincode: addr.pincode
                                        })}
                                        label="Address"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 transition-colors"
                                >
                                    Save Changes
                                </button>

                                <div className="pt-4 border-t border-gray-100 mt-4">
                                    <button
                                        type="button"
                                        onClick={handleDeleteAccount}
                                        className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Trash2 size={20} />
                                        Delete Account
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Address Modal */}
            {showAddAddress && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Add Address</h2>
                                <button onClick={() => setShowAddAddress(false)} className="text-gray-400 hover:text-gray-600">
                                    <X size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleAddAddress} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Label (e.g., Home, Work)</label>
                                    <input
                                        type="text"
                                        value={newAddress.label}
                                        onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                                        placeholder="Home"
                                    />
                                </div>
                                <div>
                                    <AddressPicker
                                        value={{
                                            fullAddress: newAddress.address,
                                            lat: newAddress.latitude,
                                            lng: newAddress.longitude
                                        }}
                                        onChange={(addr) => setNewAddress({
                                            ...newAddress,
                                            address: addr.fullAddress,
                                            latitude: addr.location.lat,
                                            longitude: addr.location.lng,
                                            city: addr.city,
                                            state: addr.state,
                                            pincode: addr.pincode
                                        })}
                                        label="Full Address"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 transition-colors"
                                >
                                    Add Address
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Review Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Write a Review</h2>
                                <button onClick={() => setShowReviewModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <X size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmitReview} className="space-y-4">
                                <div className="flex flex-col items-center gap-2 mb-4">
                                    <p className="text-sm text-gray-500">How was your experience?</p>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setReviewRating(star)}
                                                className={`transition-transform hover:scale-110 ${star <= reviewRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                            >
                                                <Star size={32} className={star <= reviewRating ? "fill-current" : ""} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Comments</label>
                                    <textarea
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        required
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none resize-none"
                                        placeholder="Share your experience..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submittingReview}
                                    className="w-full py-3 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 transition-colors disabled:opacity-50"
                                >
                                    {submittingReview ? "Submitting..." : "Submit Review"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Order Tracking Modal */}
            {trackingOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Track Order</h2>
                                <button onClick={() => setTrackingOrder(null)} className="text-gray-400 hover:text-gray-600">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="mb-6">
                                <p className="text-sm text-gray-500">Order ID</p>
                                <p className="font-mono font-bold text-gray-900">#{trackingOrder.id.slice(0, 12)}</p>
                            </div>

                            {/* Order Items */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                                <div className="space-y-2 bg-gray-50 rounded-lg p-3">
                                    {trackingOrder.items?.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                            <span className="text-gray-700">{item.quantity || 1}x {item.name}</span>
                                            <span className="text-gray-900 font-medium">₹{item.price * (item.quantity || 1)}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
                                        <span>Total</span>
                                        <span>₹{trackingOrder.totalAmount}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Status Timeline */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Order Status</h3>
                                <div className="space-y-4">
                                    {getStatusSteps().map((step, idx) => {
                                        const currentStatusIndex = getStatusSteps().findIndex(s => s.key === (trackingOrder.status?.toLowerCase() || "pending"));
                                        const isActive = idx <= currentStatusIndex;
                                        const isCurrent = idx === currentStatusIndex;

                                        return (
                                            <div key={step.key} className="flex gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? "bg-pink-600 text-white" : "bg-gray-200 text-gray-400"
                                                        }`}>
                                                        {isActive ? (
                                                            isCurrent ? getStatusIcon(step.key) : <Check className="w-5 h-5" />
                                                        ) : (
                                                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                                        )}
                                                    </div>
                                                    {idx < getStatusSteps().length - 1 && (
                                                        <div className={`w-0.5 h-12 ${isActive ? "bg-pink-600" : "bg-gray-200"}`}></div>
                                                    )}
                                                </div>
                                                <div className={`flex-1 ${idx < getStatusSteps().length - 1 ? "pb-4" : ""}`}>
                                                    <p className={`font-medium ${isCurrent ? "text-pink-600" : isActive ? "text-gray-900" : "text-gray-400"}`}>
                                                        {step.label}
                                                    </p>
                                                    {isCurrent && (
                                                        <p className="text-xs text-gray-500 mt-1">Current status</p>
                                                    )}
                                                    {isActive && !isCurrent && (
                                                        <p className="text-xs text-gray-500 mt-1">Completed</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function CustomerDashboard() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div></div>}>
            <CustomerDashboardContent />
        </Suspense>
    );
}
