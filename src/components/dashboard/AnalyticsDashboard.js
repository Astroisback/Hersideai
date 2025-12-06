"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { BarChart, TrendingUp, Package, ShoppingBag, DollarSign, Calendar, Briefcase, CheckCircle, XCircle } from "lucide-react";
import { translations } from "@/utils/translations";

export default function AnalyticsDashboard({ sellerId, language = "en" }) {
    const [loading, setLoading] = useState(true);
    const [sellerType, setSellerType] = useState("seller"); // 'seller' or 'service'
    const [metrics, setMetrics] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        topProducts: [],
        dailySales: [],
        // Service specific
        totalBookings: 0,
        approvedBookings: 0,
        declinedBookings: 0,
        topServices: []
    });

    const t = translations[language];

    useEffect(() => {
        if (!sellerId) return;

        const fetchSellerTypeAndData = async () => {
            try {
                // Fetch seller type first
                const sellerDoc = await getDoc(doc(db, "sellers", sellerId));
                let type = "seller";
                if (sellerDoc.exists()) {
                    type = sellerDoc.data().businessType || "seller";
                }
                setSellerType(type);

                if (type === "service") {
                    await fetchServiceAnalytics();
                } else {
                    await fetchProductAnalytics();
                }
            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSellerTypeAndData();
    }, [sellerId]);

    const fetchProductAnalytics = async () => {
        const q = query(collection(db, "orders"), where("sellerId", "==", sellerId));
        const querySnapshot = await getDocs(q);
        const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        processProductAnalytics(orders);
    };

    const fetchServiceAnalytics = async () => {
        const q = query(collection(db, "bookings"), where("sellerId", "==", sellerId));
        const querySnapshot = await getDocs(q);
        const bookings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        processServiceAnalytics(bookings);
    };

    const processProductAnalytics = (orders) => {
        const completedOrders = orders.filter(o => o.status === "completed");
        const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const totalOrders = orders.length;
        const averageOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

        const productSales = {};
        completedOrders.forEach(order => {
            order.items?.forEach(item => {
                if (!productSales[item.name]) {
                    productSales[item.name] = { name: item.name, quantity: 0, revenue: 0 };
                }
                productSales[item.name].quantity += item.quantity;
                productSales[item.name].revenue += (item.price * item.quantity);
            });
        });

        const topProducts = Object.values(productSales).sort((a, b) => b.quantity - a.quantity).slice(0, 5);
        const dailySales = calculateDailySales(completedOrders, "totalAmount");

        setMetrics(prev => ({ ...prev, totalRevenue, totalOrders, averageOrderValue, topProducts, dailySales }));
    };

    const processServiceAnalytics = (bookings) => {
        const approvedBookings = bookings.filter(b => b.status === "approved" || b.status === "completed");
        const declinedBookings = bookings.filter(b => b.status === "declined" || b.status === "busy");

        // Revenue from approved/completed bookings
        const totalRevenue = approvedBookings.reduce((sum, booking) => sum + (Number(booking.serviceFee) || 0), 0);
        const totalBookings = bookings.length;
        const averageOrderValue = approvedBookings.length > 0 ? totalRevenue / approvedBookings.length : 0;

        // Top Services
        const serviceStats = {};
        approvedBookings.forEach(booking => {
            const name = booking.serviceName || "Unknown Service";
            if (!serviceStats[name]) {
                serviceStats[name] = { name: name, count: 0, revenue: 0 };
            }
            serviceStats[name].count += 1;
            serviceStats[name].revenue += (Number(booking.serviceFee) || 0);
        });

        const topServices = Object.values(serviceStats).sort((a, b) => b.count - a.count).slice(0, 5);
        const dailySales = calculateDailySales(approvedBookings, "serviceFee");

        setMetrics(prev => ({
            ...prev,
            totalRevenue,
            totalBookings,
            approvedBookings: approvedBookings.length,
            declinedBookings: declinedBookings.length,
            averageOrderValue,
            topServices,
            dailySales
        }));
    };

    const calculateDailySales = (items, amountField) => {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        const salesByDate = {};
        last7Days.forEach(date => salesByDate[date] = 0);

        items.forEach(item => {
            // Check both createdAt and timestamp fields
            const timestamp = item.createdAt || item.timestamp;
            if (timestamp?.toDate) {
                const date = timestamp.toDate().toISOString().split('T')[0];
                if (salesByDate[date] !== undefined) {
                    salesByDate[date] += (Number(item[amountField]) || 0);
                }
            }
        });

        return last7Days.map(date => ({
            date: new Date(date).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'short' }),
            amount: salesByDate[date]
        }));
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">{t?.loading || "Loading..."}</div>;
    }

    const maxSales = Math.max(...metrics.dailySales.map(d => d.amount), 100);
    const isService = sellerType === "service";

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                            <DollarSign size={20} />
                        </div>
                        <p className="text-sm text-gray-500 font-medium">{t?.totalRevenue || "Total Earnings"}</p>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">₹{metrics.totalRevenue.toLocaleString()}</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            {isService ? <Calendar size={20} /> : <ShoppingBag size={20} />}
                        </div>
                        <p className="text-sm text-gray-500 font-medium">{isService ? "Total Bookings" : (t?.totalOrders || "Total Orders")}</p>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{isService ? metrics.totalBookings : metrics.totalOrders}</h3>
                    {isService && (
                        <div className="flex gap-2 mt-1 text-xs">
                            <span className="text-green-600 flex items-center gap-0.5"><CheckCircle size={10} /> {metrics.approvedBookings} Approved</span>
                            <span className="text-red-500 flex items-center gap-0.5"><XCircle size={10} /> {metrics.declinedBookings} Declined</span>
                        </div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                            <TrendingUp size={20} />
                        </div>
                        <p className="text-sm text-gray-500 font-medium">{isService ? "Avg. Booking Value" : (t?.avgOrderValue || "Avg. Order Value")}</p>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">₹{Math.round(metrics.averageOrderValue).toLocaleString()}</h3>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Sales Chart */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <BarChart size={20} className="text-pink-600" />
                        {isService ? "Earnings Trend (Last 7 Days)" : (t?.salesTrend || "Sales Trend (Last 7 Days)")}
                    </h3>

                    <div className="h-64 flex items-end justify-between gap-2">
                        {metrics.dailySales.map((day, index) => (
                            <div key={index} className="flex flex-col items-center gap-2 flex-1 group">
                                <div className="relative w-full flex justify-center">
                                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                                        ₹{day.amount}
                                    </div>
                                    <div
                                        className="w-full max-w-[40px] bg-pink-100 hover:bg-pink-500 transition-all duration-300 rounded-t-lg"
                                        style={{ height: `${(day.amount / maxSales) * 200}px`, minHeight: '4px' }}
                                    ></div>
                                </div>
                                <span className="text-xs text-gray-500 font-medium">{day.date}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Products / Services */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        {isService ? <Briefcase size={20} className="text-purple-600" /> : <Package size={20} className="text-purple-600" />}
                        {isService ? "Most Booked Services" : (t?.topProducts || "Top Selling Products")}
                    </h3>

                    {(isService ? metrics.topServices : metrics.topProducts).length > 0 ? (
                        <div className="space-y-4">
                            {(isService ? metrics.topServices : metrics.topProducts).map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 font-bold text-sm">
                                            #{index + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">{item.name}</p>
                                            <p className="text-xs text-gray-500">
                                                {isService ? `${item.count} bookings` : `${item.quantity} ${t?.sold || "sold"}`}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-gray-900">₹{item.revenue.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-48 flex flex-col items-center justify-center text-gray-400">
                            {isService ? <Briefcase size={32} className="mb-2 opacity-20" /> : <Package size={32} className="mb-2 opacity-20" />}
                            <p className="text-sm">{t?.noData || "No data yet"}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
