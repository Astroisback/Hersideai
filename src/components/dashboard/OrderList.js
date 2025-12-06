"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { ShoppingBag, Clock, CheckCircle, Truck, ChefHat, ChevronDown, ChevronUp, User, Phone, MapPin, Package, Calendar, XCircle, CheckSquare } from "lucide-react";
import { getConditionalLabels, getBookingStatusColor, getBookingStatusLabel } from "@/utils/serviceHelpers";
import { translations } from "@/utils/translations";

export default function OrderList({ sellerId, subscriptionPlan, businessType = "seller" }) {
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [monthlyEarnings, setMonthlyEarnings] = useState(0);

    // Default to English if not passed (can be enhanced to accept language prop)
    const language = "en";
    const t = translations[language];

    const labels = getConditionalLabels(businessType, t);
    const isServiceMode = labels.isServiceMode;

    useEffect(() => {
        if (!sellerId) return;

        // Query appropriate collection based on business type
        const collectionName = labels.orderCollectionName; // "orders" or "bookings"
        const q = query(collection(db, collectionName), where("sellerId", "==", sellerId));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ords = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Sort by date (newest first)
            // Handle different timestamp field names if necessary, or ensure consistency
            ords.sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : (a.timestamp?.toDate ? a.timestamp.toDate() : new Date(0));
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : (b.timestamp?.toDate ? b.timestamp.toDate() : new Date(0));
                return dateB - dateA;
            });

            setOrders(ords);

            // Calculate monthly earnings if FREE plan
            if (subscriptionPlan === "free") {
                calculateMonthlyEarnings(ords);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [sellerId, subscriptionPlan, labels.orderCollectionName]);

    const calculateMonthlyEarnings = (ordersList) => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const earnings = ordersList
            .filter(order => {
                // Only count completed/approved orders
                const completedStatus = isServiceMode ? "approved" : "completed";
                if (order.status !== completedStatus) return false;

                // Check if order is from current month
                const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : (order.timestamp?.toDate ? order.timestamp.toDate() : new Date(0));
                return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
            })
            .reduce((total, order) => total + (Number(order.totalAmount) || Number(order.serviceFee) || 0), 0);

        setMonthlyEarnings(earnings);
    };

    const updateStatus = async (orderId, newStatus) => {
        const collectionName = labels.orderCollectionName;
        await updateDoc(doc(db, collectionName, orderId), {
            status: newStatus,
            updatedAt: new Date()
        });
    };

    const getStatusColor = (status) => {
        if (isServiceMode) {
            return getBookingStatusColor(status);
        }

        switch (status) {
            case "pending": return "bg-yellow-100 text-yellow-800";
            case "accepted": return "bg-blue-100 text-blue-800";
            case "preparing": return "bg-purple-100 text-purple-800";
            case "ready": return "bg-orange-100 text-orange-800";
            case "completed": return "bg-green-100 text-green-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusIcon = (status) => {
        if (isServiceMode) {
            switch (status) {
                case "pending": return <Clock size={16} />;
                case "approved": return <CheckSquare size={16} />;
                case "declined": return <XCircle size={16} />;
                case "busy": return <XCircle size={16} />;
                default: return <Clock size={16} />;
            }
        }

        switch (status) {
            case "pending": return <Clock size={16} />;
            case "accepted": return <CheckCircle size={16} />;
            case "preparing": return <ChefHat size={16} />;
            case "ready": return <ShoppingBag size={16} />;
            case "completed": return <CheckCircle size={16} />;
            default: return <Clock size={16} />;
        }
    };

    const toggleExpand = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading {labels.ordersOrBookings.toLowerCase()}...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Recent {labels.ordersOrBookings} ({orders.length})</h2>
            </div>

            {/* Earnings Tracker for FREE plan */}
            {subscriptionPlan === "free" && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-800">Monthly Earnings (FREE Plan)</h3>
                        <span className={`text-2xl font-bold ${monthlyEarnings >= 10000 ? 'text-red-600' : monthlyEarnings >= 8000 ? 'text-orange-600' : 'text-green-600'}`}>
                            ₹{monthlyEarnings.toLocaleString()} / ₹10,000
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                        <div
                            className={`h-3 rounded-full transition-all ${monthlyEarnings >= 10000 ? 'bg-red-500' :
                                monthlyEarnings >= 8000 ? 'bg-orange-500' :
                                    'bg-green-500'
                                }`}
                            style={{ width: `${Math.min((monthlyEarnings / 10000) * 100, 100)}%` }}
                        />
                    </div>

                    {/* Warning Messages */}
                    {monthlyEarnings >= 10000 ? (
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-sm text-red-600 font-medium">
                                ⚠️ Monthly earning limit reached! Upgrade to PREMIUM for unlimited earnings.
                            </p>
                            <button
                                onClick={() => router.push("/seller/upgrade")}
                                className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-red-700 transition-colors"
                            >
                                Upgrade Now
                            </button>
                        </div>
                    ) : monthlyEarnings >= 8000 ? (
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-sm text-orange-600">
                                ⚠️ Approaching monthly limit (₹{(10000 - monthlyEarnings).toLocaleString()} remaining). Consider upgrading.
                            </p>
                            <button
                                onClick={() => router.push("/seller/upgrade")}
                                className="text-xs bg-orange-500 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-orange-600 transition-colors"
                            >
                                Upgrade
                            </button>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-600">
                            ₹{(10000 - monthlyEarnings).toLocaleString()} remaining this month. Resets on 1st of next month.
                        </p>
                    )}
                </div>
            )}

            {orders.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                        {isServiceMode ? <Calendar size={32} /> : <ShoppingBag size={32} />}
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No {labels.ordersOrBookings.toLowerCase()} yet</h3>
                    <p className="text-gray-500">New {labels.ordersOrBookings.toLowerCase()} will appear here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            {/* Order Header - Clickable */}
                            <div
                                onClick={() => toggleExpand(order.id)}
                                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-gray-800">#{order.id.slice(0, 8)}</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : (order.timestamp?.toDate ? order.timestamp.toDate().toLocaleString() : "Just now")}
                                        </p>
                                        <p className="text-sm text-gray-700 mt-1 flex items-center gap-1">
                                            <User size={14} />
                                            {order.customerName || "Customer"}
                                        </p>
                                    </div>
                                    <div className="text-right flex items-start gap-3">
                                        <div>
                                            <p className="font-bold text-lg text-gray-900">₹{order.totalAmount || order.serviceFee}</p>
                                            <p className="text-xs text-gray-500">
                                                {isServiceMode ? "Service Booking" : `${order.items?.length || 0} items`}
                                            </p>
                                        </div>
                                        <div className="text-gray-400 mt-1">
                                            {expandedOrder === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </div>
                                    </div>
                                </div>

                                {/* Collapsed View - Item Summary */}
                                {expandedOrder !== order.id && (
                                    <div className="flex gap-2 flex-wrap mt-2">
                                        {isServiceMode ? (
                                            <span className="text-xs bg-pink-50 text-pink-700 px-2 py-1 rounded border border-pink-100 flex items-center gap-1">
                                                <Calendar size={12} />
                                                {order.serviceName} • {order.selectedTimeSlot}
                                            </span>
                                        ) : (
                                            order.items?.slice(0, 3).map((item, idx) => (
                                                <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                    {item.quantity}x {item.name}
                                                </span>
                                            ))
                                        )}
                                        {!isServiceMode && order.items?.length > 3 && (
                                            <span className="text-xs text-gray-500">+{order.items.length - 3} more</span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Expanded View - Full Details */}
                            {expandedOrder === order.id && (
                                <div className="border-t border-gray-100 p-6 bg-gray-50">
                                    {/* Customer Details */}
                                    <div className="mb-6">
                                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                            <User size={18} />
                                            Customer Information
                                        </h3>
                                        <div className="bg-white p-4 rounded-lg space-y-2">
                                            <p className="text-sm text-gray-700">
                                                <span className="font-medium">Name:</span> {order.customerName || "Not provided"}
                                            </p>
                                            <p className="text-sm text-gray-700 flex items-center gap-1">
                                                <Package size={14} />
                                                <span className="font-medium">ID:</span> {order.id}
                                            </p>
                                            <p className="text-sm text-gray-700">
                                                <span className="font-medium">Payment:</span> {order.paymentMethod || "COD"}
                                            </p>
                                            {isServiceMode && order.location && (
                                                <p className="text-sm text-gray-700 flex items-start gap-1">
                                                    <MapPin size={14} className="mt-0.5" />
                                                    <span><span className="font-medium">Location:</span> {order.location}</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Items List / Service Details */}
                                    <div className="mb-6">
                                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                            {isServiceMode ? <Calendar size={18} /> : <ShoppingBag size={18} />}
                                            {isServiceMode ? "Service Details" : "Order Items"}
                                        </h3>

                                        {isServiceMode ? (
                                            <div className="bg-white p-4 rounded-lg border border-pink-100">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-bold text-gray-800 text-lg">{order.serviceName}</h4>
                                                        <div className="flex items-center gap-2 mt-2 text-gray-600">
                                                            <Calendar size={16} />
                                                            <span>{order.selectedDate?.toDate ? order.selectedDate.toDate().toLocaleDateString() : order.selectedDate}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1 text-gray-600">
                                                            <Clock size={16} />
                                                            <span>{order.selectedTimeSlot}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-500">Fee</p>
                                                        <p className="font-bold text-xl text-pink-600">₹{order.serviceFee}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {order.items?.map((item, idx) => (
                                                    <div key={idx} className="bg-white p-4 rounded-lg flex gap-4">
                                                        {/* Item Image */}
                                                        <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                                                            {item.image ? (
                                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                                    No Image
                                                                </div>
                                                            )}
                                                        </div>
                                                        {/* Item Details */}
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-gray-800">{item.name}</h4>
                                                            {item.description && (
                                                                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.description}</p>
                                                            )}
                                                            {item.category && (
                                                                <span className="inline-block text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded mt-2">
                                                                    {item.category}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {/* Pricing */}
                                                        <div className="text-right">
                                                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                                            <p className="text-sm text-gray-600">₹{item.price} each</p>
                                                            <p className="font-bold text-gray-900 mt-1">₹{item.price * item.quantity}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Pricing Summary */}
                                    <div className="mb-6">
                                        <div className="bg-white p-4 rounded-lg">
                                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                                <span>Subtotal</span>
                                                <span>₹{order.totalAmount || order.serviceFee}</span>
                                            </div>
                                            <div className="border-t pt-2 flex justify-between font-bold text-gray-900">
                                                <span>Total Amount</span>
                                                <span>₹{order.totalAmount || order.serviceFee}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Update Buttons */}
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-3">Update Status</h3>
                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                            {isServiceMode ? (
                                                // Service Mode Actions
                                                <>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            updateStatus(order.id, "approved");
                                                        }}
                                                        disabled={order.status === "approved"}
                                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${order.status === "approved"
                                                            ? "bg-green-600 text-white"
                                                            : "bg-white text-green-600 hover:bg-green-50 border border-green-200"
                                                            }`}
                                                    >
                                                        <CheckSquare size={16} />
                                                        Approve Booking
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            updateStatus(order.id, "declined");
                                                        }}
                                                        disabled={order.status === "declined"}
                                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${order.status === "declined"
                                                            ? "bg-red-600 text-white"
                                                            : "bg-white text-red-600 hover:bg-red-50 border border-red-200"
                                                            }`}
                                                    >
                                                        <XCircle size={16} />
                                                        Decline / Busy
                                                    </button>
                                                </>
                                            ) : (
                                                // Product Mode Actions
                                                ["pending", "accepted", "preparing", "ready", "completed"].map((status) => (
                                                    <button
                                                        key={status}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            updateStatus(order.id, status);
                                                        }}
                                                        disabled={order.status === status}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${order.status === status
                                                            ? "bg-gray-800 text-white"
                                                            : "bg-white text-gray-600 hover:bg-gray-200 border border-gray-300"
                                                            }`}
                                                    >
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
