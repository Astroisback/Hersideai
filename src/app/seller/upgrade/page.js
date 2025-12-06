"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { CreditCard, Smartphone, Building2, Wallet, ArrowLeft, Check, Crown } from "lucide-react";

export default function UpgradePage() {
    const router = useRouter();
    const [selectedMethod, setSelectedMethod] = useState("");
    const [amount, setAmount] = useState("499");
    const [transactionId, setTransactionId] = useState("");
    const [processing, setProcessing] = useState(false);

    const paymentMethods = [
        { id: "upi", name: "UPI", icon: Smartphone, desc: "Google Pay, PhonePe, Paytm" },
        { id: "card", name: "Card", icon: CreditCard, desc: "Credit/Debit Card" },
        { id: "netbanking", name: "Net Banking", icon: Building2, desc: "All major banks" },
        { id: "wallet", name: "Wallet", icon: Wallet, desc: "Paytm, PhonePe" },
    ];

    const handleUpgrade = async () => {
        if (!selectedMethod) {
            alert("Please select a payment method");
            return;
        }

        if (amount !== "499") {
            alert("Amount must be ₹499 for yearly subscription");
            return;
        }

        if (!transactionId.trim()) {
            alert("Please enter transaction ID");
            return;
        }

        setProcessing(true);

        try {
            // Get seller ID from localStorage
            const sellerData = JSON.parse(localStorage.getItem("seller_user") || "{}");

            if (!sellerData.id) {
                alert("Seller information not found. Please login again.");
                router.push("/seller/login");
                return;
            }

            // Update seller to premium in Firestore
            const sellerRef = doc(db, "sellers", sellerData.id);
            await updateDoc(sellerRef, {
                subscriptionPlan: "premium",
                upgradedAt: new Date(),
                paymentMethod: selectedMethod,
                transactionId: transactionId,
                subscriptionAmount: 499,
                subscriptionType: "yearly"
            });

            // Update localStorage
            const updatedSellerData = {
                ...sellerData,
                subscriptionPlan: "premium"
            };
            localStorage.setItem("seller_user", JSON.stringify(updatedSellerData));

            // Success message
            alert("🎉 Upgraded to PREMIUM successfully!\n\nYou now have access to:\n✓ Unlimited products\n✓ Unlimited earnings\n✓ Customer reviews\n✓ Direct messaging\n✓ Priority listings");

            // Redirect to dashboard
            router.push("/seller/dashboard");
        } catch (error) {
            console.error("Upgrade error:", error);
            alert("Failed to upgrade. Please try again or contact support.");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </button>

                {/* Header */}
                <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl p-8 text-white mb-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-3">
                        <Crown size={40} className="text-yellow-300" />
                        <div>
                            <h1 className="text-3xl font-bold">Upgrade to PREMIUM</h1>
                            <p className="text-pink-100">Unlock unlimited potential for your business</p>
                        </div>
                    </div>
                </div>

                {/* Pricing Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                    <div className="text-center pb-6 border-b border-gray-200">
                        <p className="text-gray-600 mb-2">PREMIUM Plan</p>
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-5xl font-bold text-pink-600">₹499</span>
                            <span className="text-gray-600">/year</span>
                        </div>
                        <p className="text-sm text-green-600 mt-2">Save ₹5,489/year compared to monthly!</p>
                    </div>

                    {/* Features */}
                    <div className="py-6 space-y-3">
                        <div className="flex items-center gap-3">
                            <Check className="text-green-600" size={20} />
                            <span className="text-gray-700">Unlimited products & services</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Check className="text-green-600" size={20} />
                            <span className="text-gray-700">No monthly earning limits</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Check className="text-green-600" size={20} />
                            <span className="text-gray-700">Access to customer reviews</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Check className="text-green-600" size={20} />
                            <span className="text-gray-700">Direct customer messaging</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Check className="text-green-600" size={20} />
                            <span className="text-gray-700">Priority search listings</span>
                        </div>
                    </div>
                </div>

                {/* Payment Form */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Details</h2>

                    {/* Payment Method Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Select Payment Method <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {paymentMethods.map((method) => {
                                const Icon = method.icon;
                                return (
                                    <button
                                        key={method.id}
                                        onClick={() => setSelectedMethod(method.id)}
                                        className={`p-4 rounded-xl border-2 transition-all ${selectedMethod === method.id
                                                ? "border-pink-600 bg-pink-50 ring-2 ring-pink-200"
                                                : "border-gray-200 hover:border-pink-300"
                                            }`}
                                    >
                                        <Icon size={24} className={selectedMethod === method.id ? "text-pink-600" : "text-gray-400"} />
                                        <p className={`font-medium mt-2 ${selectedMethod === method.id ? "text-pink-600" : "text-gray-800"}`}>
                                            {method.name}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">{method.desc}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Amount Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Amount <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-gray-900 font-bold text-lg"
                                readOnly
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Fixed amount for yearly subscription</p>
                    </div>

                    {/* Transaction ID */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Transaction ID / Reference Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            placeholder="Enter transaction ID after payment"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-gray-900"
                        />
                        <p className="text-xs text-gray-500 mt-1">Complete the payment via your selected method and enter the transaction ID here</p>
                    </div>

                    {/* Payment Instructions */}
                    {selectedMethod && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                            <p className="text-sm font-medium text-blue-800 mb-2">Payment Instructions:</p>
                            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                                <li>Complete the payment of ₹499 using {paymentMethods.find(m => m.id === selectedMethod)?.name}</li>
                                <li>Note down your transaction ID / reference number</li>
                                <li>Enter the transaction ID above</li>
                                <li>Click "Complete Upgrade" to activate PREMIUM</li>
                            </ol>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        onClick={handleUpgrade}
                        disabled={processing || !selectedMethod || !transactionId.trim()}
                        className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all shadow-lg ${processing || !selectedMethod || !transactionId.trim()
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 shadow-pink-200"
                            }`}
                    >
                        {processing ? "Processing..." : "Complete Upgrade"}
                    </button>

                    <p className="text-xs text-gray-500 text-center mt-4">
                        By upgrading, you agree to our Terms of Service and Premium Subscription Policy
                    </p>
                </div>
            </div>
        </div>
    );
}
