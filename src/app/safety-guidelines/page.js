"use client";
import Link from "next/link";
import { Shield, AlertTriangle, CheckCircle, Users, Store } from "lucide-react";

export default function SafetyGuidelines() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <Link href="/" className="text-pink-600 hover:text-pink-700 text-sm font-medium mb-4 inline-block">
                        ← Back to Home
                    </Link>
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="text-pink-600" size={40} />
                        <h1 className="text-4xl font-bold text-gray-900">Safety Guidelines</h1>
                    </div>
                    <p className="text-gray-600 text-lg">Your safety is our priority. Follow these guidelines to ensure a secure experience.</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* For Customers */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Users className="text-pink-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-900">For Customers</h2>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <CheckCircle size={20} className="text-green-500" />
                                Verify Seller Information
                            </h3>
                            <p className="text-gray-700 ml-7">Always check seller ratings, reviews, and verification status before making a purchase. Look for verified badges.</p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <CheckCircle size={20} className="text-green-500" />
                                Use Platform Payments
                            </h3>
                            <p className="text-gray-700 ml-7">Always use the platform's payment system. Never transfer money directly to sellers outside the platform.</p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <CheckCircle size={20} className="text-green-500" />
                                Protect Personal Information
                            </h3>
                            <p className="text-gray-700 ml-7">Don't share sensitive personal information like bank details, passwords, or ID documents through messages.</p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <CheckCircle size={20} className="text-green-500" />
                                Report Suspicious Activity
                            </h3>
                            <p className="text-gray-700 ml-7">If you notice anything suspicious, report it immediately through our platform.</p>
                        </div>
                    </div>
                </div>

                {/* For Sellers */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Store className="text-pink-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-900">For Sellers</h2>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <CheckCircle size={20} className="text-green-500" />
                                Provide Accurate Information
                            </h3>
                            <p className="text-gray-700 ml-7">Ensure all product/service descriptions, prices, and images are accurate and up-to-date.</p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <CheckCircle size={20} className="text-green-500" />
                                Deliver as Promised
                            </h3>
                            <p className="text-gray-700 ml-7">Always fulfill orders as described and within the promised timeframe.</p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <CheckCircle size={20} className="text-green-500" />
                                Maintain Professional Communication
                            </h3>
                            <p className="text-gray-700 ml-7">Respond to customers promptly and professionally. Keep all communication within the platform.</p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <CheckCircle size={20} className="text-green-500" />
                                Comply with Platform Policies
                            </h3>
                            <p className="text-gray-700 ml-7">Follow all platform guidelines, terms of service, and legal requirements.</p>
                        </div>
                    </div>
                </div>

                {/* Warning Signs */}
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <AlertTriangle className="text-red-600" size={28} />
                        <h2 className="text-2xl font-bold text-red-900">Red Flags to Watch Out For</h2>
                    </div>

                    <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            <span>Requests to communicate or pay outside the platform</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            <span>Deals that seem too good to be true</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            <span>Pressure to make immediate decisions without time to think</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            <span>Sellers/buyers with no reviews or verification</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            <span>Requests for personal or financial information via messages</span>
                        </li>
                    </ul>
                </div>

                {/* Report Issues */}
                <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl p-8 text-white text-center">
                    <Shield size={48} className="mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Report Safety Concerns</h2>
                    <p className="mb-6 text-pink-100">If you encounter any safety issues, please report them immediately</p>
                    <Link href="/contact" className="inline-block bg-white text-pink-600 px-8 py-3 rounded-xl font-bold hover:bg-pink-50 transition-colors">
                        Report an Issue
                    </Link>
                </div>
            </div>
        </div>
    );
}
