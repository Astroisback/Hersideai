"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, where, updateDoc } from "firebase/firestore";
import { Plus, Trash2, Briefcase, Check, Clock, X, Calendar, Star, Users } from "lucide-react";

const SERVICE_PRESETS = [
    "Mehndi Artist",
    "Home Tutor",
    "Yoga Trainer",
    "Cooking Classes",
    "Tailoring / Stitching",
    "Babysitting",
    "Beauty Services"
];

export default function ServiceManager({ sellerId }) {
    const [services, setServices] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(true);
    const [serviceStats, setServiceStats] = useState({});

    // Form State
    const [selectedPreset, setSelectedPreset] = useState("");
    const [customName, setCustomName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");

    // Time Slots State
    const [timeSlots, setTimeSlots] = useState([]);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    useEffect(() => {
        if (!sellerId) return;

        // Fetch Services
        const qServices = query(collection(db, "services"), where("sellerId", "==", sellerId));
        const unsubServices = onSnapshot(qServices, (snapshot) => {
            setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });

        // Fetch Bookings for Stats
        const qBookings = query(collection(db, "bookings"), where("sellerId", "==", sellerId));
        const unsubBookings = onSnapshot(qBookings, (snapshot) => {
            const bookings = snapshot.docs.map(doc => doc.data());
            updateStats(bookings, null);
        });

        // Fetch Reviews for Stats
        const qReviews = query(collection(db, "reviews"), where("sellerId", "==", sellerId));
        const unsubReviews = onSnapshot(qReviews, (snapshot) => {
            const reviews = snapshot.docs.map(doc => doc.data());
            updateStats(null, reviews);
        });

        return () => {
            unsubServices();
            unsubBookings();
            unsubReviews();
        };
    }, [sellerId]);

    const updateStats = (bookings, reviews) => {
        setServiceStats(prev => {
            const newStats = { ...prev };

            if (bookings) {
                // Reset booking counts first if needed, but here we just re-calc
                // We need to iterate over all services eventually, but here we just aggregate by serviceId
                const bookingCounts = {};
                bookings.forEach(b => {
                    if (b.serviceId) {
                        bookingCounts[b.serviceId] = (bookingCounts[b.serviceId] || 0) + 1;
                    }
                });
                // Merge into existing stats
                Object.keys(bookingCounts).forEach(sId => {
                    newStats[sId] = { ...newStats[sId], bookingCount: bookingCounts[sId] };
                });
            }

            if (reviews) {
                const reviewData = {};
                reviews.forEach(r => {
                    if (r.serviceId) {
                        if (!reviewData[r.serviceId]) reviewData[r.serviceId] = { sum: 0, count: 0 };
                        reviewData[r.serviceId].sum += (r.rating || 0);
                        reviewData[r.serviceId].count += 1;
                    }
                });

                Object.keys(reviewData).forEach(sId => {
                    const { sum, count } = reviewData[sId];
                    newStats[sId] = {
                        ...newStats[sId],
                        rating: (sum / count).toFixed(1),
                        reviewCount: count
                    };
                });
            }

            return newStats;
        });
    };

    const handleAddSlot = () => {
        if (startTime && endTime) {
            // Basic validation
            if (startTime >= endTime) {
                alert("End time must be after start time");
                return;
            }
            setTimeSlots([...timeSlots, { startTime, endTime }]);
            setStartTime("");
            setEndTime("");
        }
    };

    const removeSlot = (index) => {
        setTimeSlots(timeSlots.filter((_, i) => i !== index));
    };

    const handleAddService = async (e) => {
        e.preventDefault();
        const name = selectedPreset === "Custom" ? customName : selectedPreset;

        if (!name || !price) return;

        if (timeSlots.length === 0) {
            alert("Please add at least one time slot");
            return;
        }

        try {
            await addDoc(collection(db, "services"), {
                sellerId,
                name,
                description,
                price: Number(price),
                timeSlots,
                isActive: true,
                createdAt: new Date()
            });
            setIsAdding(false);
            resetForm();
        } catch (error) {
            console.error("Error adding service:", error);
            alert("Failed to add service");
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Delete this service?")) {
            try {
                await deleteDoc(doc(db, "services", id));
            } catch (error) {
                console.error("Error deleting service:", error);
            }
        }
    };

    const toggleServiceStatus = async (service) => {
        try {
            await updateDoc(doc(db, "services", service.id), {
                isActive: !service.isActive
            });
        } catch (error) {
            console.error("Error updating service status:", error);
        }
    };

    const resetForm = () => {
        setSelectedPreset("");
        setCustomName("");
        setDescription("");
        setPrice("");
        setTimeSlots([]);
        setStartTime("");
        setEndTime("");
    };

    if (loading) return <div className="text-center py-8 text-gray-500">Loading services...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">My Services</h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-pink-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-pink-700 transition-colors"
                >
                    <Plus size={18} />
                    Add Service
                </button>
            </div>

            {isAdding && (
                <div className="bg-white p-6 rounded-xl border border-pink-100 shadow-lg animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-bold text-gray-800 mb-4">Add New Service</h3>
                    <form onSubmit={handleAddService} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                                <select
                                    value={selectedPreset}
                                    onChange={(e) => setSelectedPreset(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-pink-500"
                                    required
                                >
                                    <option value="">Select a service...</option>
                                    {SERVICE_PRESETS.map(s => <option key={s} value={s}>{s}</option>)}
                                    <option value="Custom">Add Custom Service</option>
                                </select>
                            </div>

                            {selectedPreset === "Custom" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                                    <input
                                        type="text"
                                        value={customName}
                                        onChange={(e) => setCustomName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-pink-500"
                                        placeholder="e.g. Advanced Math Tutoring"
                                        required
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Service Fee (₹)</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="e.g. 500"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-pink-500 min-h-[80px]"
                                placeholder="Briefly describe what you offer..."
                            />
                        </div>

                        {/* Time Slots Section */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Availability Time Slots</label>

                            <div className="flex flex-wrap gap-2 mb-3">
                                {timeSlots.map((slot, index) => (
                                    <div key={index} className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm shadow-sm">
                                        <Clock size={14} className="text-gray-400" />
                                        <span>{slot.startTime} - {slot.endTime}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeSlot(index)}
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                {timeSlots.length === 0 && (
                                    <p className="text-sm text-gray-400 italic">No slots added yet</p>
                                )}
                            </div>

                            <div className="flex gap-2 items-end">
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Start Time</label>
                                    <input
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-pink-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">End Time</label>
                                    <input
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-pink-500"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddSlot}
                                    className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors mb-[1px]"
                                >
                                    Add Slot
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                className="flex-1 bg-pink-600 text-white py-2 rounded-lg font-medium hover:bg-pink-700"
                            >
                                Save Service
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg font-medium hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
                {services.map((service) => {
                    const stats = serviceStats[service.id] || {};
                    return (
                        <div key={service.id} className={`bg-white p-4 rounded-xl border shadow-sm flex flex-col gap-3 group transition-all ${service.isActive ? 'border-gray-100 hover:border-pink-200' : 'border-gray-200 opacity-75 bg-gray-50'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Briefcase size={16} className={service.isActive ? "text-pink-500" : "text-gray-400"} />
                                        <h4 className="font-bold text-gray-800">{service.name}</h4>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">{service.description || "No description"}</p>
                                    <span className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                                        ₹{service.price}
                                    </span>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => toggleServiceStatus(service)}
                                        className={`p-1.5 rounded-lg transition-colors ${service.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-200'}`}
                                        title={service.isActive ? "Mark as Inactive" : "Mark as Active"}
                                    >
                                        <Check size={18} className={service.isActive ? "opacity-100" : "opacity-50"} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(service.id)}
                                        className="text-gray-300 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 rounded-lg"
                                        title="Delete Service"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Mini Analytics */}
                            <div className="flex items-center gap-4 py-2 border-t border-b border-gray-50 text-sm">
                                <div className="flex items-center gap-1.5 text-gray-600">
                                    <Users size={14} className="text-blue-500" />
                                    <span>{stats.bookingCount || 0} Bookings</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-600">
                                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                    <span>{stats.rating || "New"} ({stats.reviewCount || 0})</span>
                                </div>
                            </div>

                            {/* Time Slots Display */}
                            {service.timeSlots && service.timeSlots.length > 0 && (
                                <div className="pt-1">
                                    <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                                        <Clock size={12} />
                                        Available Slots
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {service.timeSlots.map((slot, idx) => (
                                            <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">
                                                {slot.startTime} - {slot.endTime}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {services.length === 0 && !isAdding && (
                    <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-500">No services added yet.</p>
                        <button onClick={() => setIsAdding(true)} className="text-pink-600 font-medium hover:underline mt-2">
                            Add your first service
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
