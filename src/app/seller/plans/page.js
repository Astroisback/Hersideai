"use client";
import { useRouter } from "next/navigation";
import { Check, X, Crown, Zap } from "lucide-react";
import Link from "next/link";

export default function PlanSelectionPage() {
    const router = useRouter();

    const handleSelectPlan = (plan) => {
        router.push(`/seller/onboarding?plan=${plan}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex flex-col items-center justify-center p-4">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Choose Your Plan
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Start your journey as a woman entrepreneur. Select the plan that fits your business needs.
                </p>
            </div>

            {/* Plan Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl w-full mb-8">
                {/* FREE Plan */}
                <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 overflow-hidden hover:shadow-2xl transition-shadow">
                    <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 text-center">
                        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full mb-4">
                            <Zap className="text-gray-600" size={20} />
                            <span className="font-bold text-gray-900">FREE</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">₹0</h2>
                        <p className="text-gray-600">Forever Free</p>
                    </div>

                    <div className="p-8">
                        <h3 className="font-bold text-lg text-gray-900 mb-6">Perfect to get started</h3>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3">
                                <Check className="text-green-600 shrink-0 mt-1" size={20} />
                                <span className="text-gray-700">Up to <strong>₹10,000/month</strong> earnings limit</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="text-green-600 shrink-0 mt-1" size={20} />
                                <span className="text-gray-700">Add max <strong>5 products/services</strong></span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="text-green-600 shrink-0 mt-1" size={20} />
                                <span className="text-gray-700">Basic analytics (<strong>Orders</strong> tab only)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="text-green-600 shrink-0 mt-1" size={20} />
                                <span className="text-gray-700">Standard listing in search</span>
                            </li>
                            <li className="flex items-start gap-3 opacity-50">
                                <X className="text-red-500 shrink-0 mt-1" size={20} />
                                <span className="text-gray-500 line-through">No priority listing</span>
                            </li>
                            <li className="flex items-start gap-3 opacity-50">
                                <X className="text-red-500 shrink-0 mt-1" size={20} />
                                <span className="text-gray-500 line-through">Cannot run promotions</span>
                            </li>
                            <li className="flex items-start gap-3 opacity-50">
                                <X className="text-red-500 shrink-0 mt-1" size={20} />
                                <span className="text-gray-500 line-through">No Reviews & Messages tabs</span>
                            </li>
                        </ul>

                        <button
                            onClick={() => handleSelectPlan("free")}
                            className="w-full py-4 bg-gray-800 text-white rounded-xl font-bold text-lg hover:bg-gray-900 transition-colors shadow-lg"
                        >
                            Start Free
                        </button>
                    </div>
                </div>

                {/* PREMIUM Plan */}
                <div className="bg-white rounded-3xl shadow-2xl border-2 border-pink-500 overflow-hidden relative transform md:scale-105 hover:shadow-3xl transition-all">
                    {/* Popular Badge */}
                    <div className="absolute top-6 right-6 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                        RECOMMENDED
                    </div>

                    <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-6 text-center text-white">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                            <Crown className="text-yellow-300" size={20} />
                            <span className="font-bold">PREMIUM</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-2">₹499</h2>
                        <p className="text-pink-100">per year</p>
                    </div>

                    <div className="p-8">
                        <h3 className="font-bold text-lg text-gray-900 mb-6">Grow your business faster</h3>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3">
                                <Check className="text-green-600 shrink-0 mt-1" size={20} />
                                <span className="text-gray-700"><strong>No earning limits</strong></span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="text-green-600 shrink-0 mt-1" size={20} />
                                <span className="text-gray-700">Add <strong>unlimited products/services</strong></span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="text-green-600 shrink-0 mt-1" size={20} />
                                <span className="text-gray-700"><strong>Priority search listing</strong> (top positions)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="text-green-600 shrink-0 mt-1" size={20} />
                                <span className="text-gray-700">
                                    <strong>Full analytics</strong>:
                                    <div className="ml-6 mt-1 text-sm text-gray-600">
                                        • Revenue reports<br />
                                        • Customer reviews<br />
                                        • Direct messaging
                                    </div>
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="text-green-600 shrink-0 mt-1" size={20} />
                                <span className="text-gray-700">Custom Store Page <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Coming Soon</span></span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="text-green-600 shrink-0 mt-1" size={20} />
                                <span className="text-gray-700">Run promotions <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Coming Soon</span></span>
                            </li>
                        </ul>

                        <button
                            onClick={() => handleSelectPlan("premium")}
                            className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-pink-700 hover:to-purple-700 transition-all shadow-xl shadow-pink-200"
                        >
                            Start Premium
                        </button>

                        <p className="text-center text-xs text-gray-500 mt-4">
                            7-day money-back guarantee
                        </p>
                    </div>
                </div>
            </div>

            {/* Back to Login */}
            <div className="text-center">
                <p className="text-gray-600">
                    Already have an account?{" "}
                    <Link href="/seller/login" className="text-pink-600 font-medium hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>

            {/* Features Comparison Table (Optional) */}
            <div className="mt-16 max-w-4xl w-full bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Feature Comparison</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Feature</th>
                                <th className="text-center py-4 px-4 font-semibold text-gray-700">FREE</th>
                                <th className="text-center py-4 px-4 font-semibold text-pink-600">PREMIUM</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr>
                                <td className="py-4 px-4 text-gray-700">Monthly Earnings Limit</td>
                                <td className="text-center py-4 px-4">₹10,000</td>
                                <td className="text-center py-4 px-4 text-green-600 font-semibold">Unlimited</td>
                            </tr>
                            <tr>
                                <td className="py-4 px-4 text-gray-700">Products/Services</td>
                                <td className="text-center py-4 px-4">5 max</td>
                                <td className="text-center py-4 px-4 text-green-600 font-semibold">Unlimited</td>
                            </tr>
                            <tr>
                                <td className="py-4 px-4 text-gray-700">Dashboard Tabs</td>
                                <td className="text-center py-4 px-4">Orders only</td>
                                <td className="text-center py-4 px-4 text-green-600 font-semibold">All tabs</td>
                            </tr>
                            <tr>
                                <td className="py-4 px-4 text-gray-700">Search Priority</td>
                                <td className="text-center py-4 px-4">Standard</td>
                                <td className="text-center py-4 px-4 text-green-600 font-semibold">Top positions</td>
                            </tr>
                            <tr>
                                <td className="py-4 px-4 text-gray-700">Customer Reviews</td>
                                <td className="text-center py-4 px-4"><X className="inline text-red-500" size={20} /></td>
                                <td className="text-center py-4 px-4"><Check className="inline text-green-600" size={20} /></td>
                            </tr>
                            <tr>
                                <td className="py-4 px-4 text-gray-700">Direct Messaging</td>
                                <td className="text-center py-4 px-4"><X className="inline text-red-500" size={20} /></td>
                                <td className="text-center py-4 px-4"><Check className="inline text-green-600" size={20} /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
