"use client";
import Link from "next/link";
import { Shield, Lock, Eye, Cookie, FileText } from "lucide-react";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <Link href="/" className="text-pink-600 hover:text-pink-700 text-sm font-medium mb-4 inline-block">
                        ← Back to Home
                    </Link>
                    <div className="flex items-center gap-3 mb-4">
                        <Lock className="text-pink-600" size={40} />
                        <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
                    </div>
                    <p className="text-gray-600 text-sm">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 prose prose-pink max-w-none">
                    <section className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="text-pink-600" size={24} />
                            <h2 className="text-2xl font-bold text-gray-900 m-0">Introduction</h2>
                        </div>
                        <p className="text-gray-700">
                            This Privacy Policy describes how we collect, use, and protect your personal information when you use our platform.
                            By using our services, you agree to the collection and use of information in accordance with this policy.
                        </p>
                    </section>

                    <section className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Eye className="text-pink-600" size={24} />
                            <h2 className="text-2xl font-bold text-gray-900 m-0">Information We Collect</h2>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mt-4">Personal Information</h3>
                        <ul className="text-gray-700 space-y-2">
                            <li>Name, email address, and phone number</li>
                            <li>Profile information and preferences</li>
                            <li>Business information (for sellers)</li>
                            <li>Payment and billing information</li>
                            <li>Delivery addresses</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-900 mt-4">Usage Information</h3>
                        <ul className="text-gray-700 space-y-2">
                            <li>Device information and IP address</li>
                            <li>Browser type and operating system</li>
                            <li>Pages visited and time spent on the platform</li>
                            <li>Search queries and interactions</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Shield className="text-pink-600" size={24} />
                            <h2 className="text-2xl font-bold text-gray-900 m-0">How We Use Your Information</h2>
                        </div>
                        <p className="text-gray-700">We use the collected information for:</p>
                        <ul className="text-gray-700 space-y-2">
                            <li>Providing and maintaining our services</li>
                            <li>Processing transactions and orders</li>
                            <li>Communication regarding orders and services</li>
                            <li>Customer support and assistance</li>
                            <li>Platform improvement and analytics</li>
                            <li>Marketing and promotional communications (with consent)</li>
                            <li>Fraud prevention and security</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Cookie className="text-pink-600" size={24} />
                            <h2 className="text-2xl font-bold text-gray-900 m-0">Cookies and Tracking</h2>
                        </div>
                        <p className="text-gray-700">
                            We use cookies and similar tracking technologies to track activity on our platform and store certain information.
                            You can control cookies through your browser settings.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Sharing and Disclosure</h2>
                        <p className="text-gray-700">We may share your information with:</p>
                        <ul className="text-gray-700 space-y-2">
                            <li>Sellers (for order fulfillment)</li>
                            <li>Payment processors</li>
                            <li>Service providers (hosting, analytics, customer support)</li>
                            <li>Law enforcement (when required by law)</li>
                        </ul>
                        <p className="text-gray-700 mt-4">
                            We do not sell your personal information to third parties.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
                        <p className="text-gray-700">You have the right to:</p>
                        <ul className="text-gray-700 space-y-2">
                            <li>Access your personal data</li>
                            <li>Correct inaccurate information</li>
                            <li>Request deletion of your data</li>
                            <li>Object to data processing</li>
                            <li>Data portability</li>
                            <li>Withdraw consent</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
                        <p className="text-gray-700">
                            We implement appropriate technical and organizational measures to protect your personal information.
                            However, no method of transmission over the Internet is 100% secure.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
                        <p className="text-gray-700">
                            Our services are not intended for users under the age of 18. We do not knowingly collect
                            personal information from children.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
                        <p className="text-gray-700">
                            We may update our Privacy Policy from time to time. We will notify you of any changes by
                            posting the new Privacy Policy on this page and updating the "Last updated" date.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                        <p className="text-gray-700">
                            If you have questions about this Privacy Policy, please contact us at:
                        </p>
                        <div className="bg-gray-50 p-4 rounded-xl mt-4">
                            <p className="text-gray-700 m-0">Email: privacy@yourplatform.com</p>
                            <p className="text-gray-700 m-0">Phone: +91 1234567890</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
