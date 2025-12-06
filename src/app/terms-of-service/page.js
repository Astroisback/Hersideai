"use client";
import Link from "next/link";
import { FileText, Users, Store, AlertCircle, Scale } from "lucide-react";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <Link href="/" className="text-pink-600 hover:text-pink-700 text-sm font-medium mb-4 inline-block">
                        ← Back to Home
                    </Link>
                    <div className="flex items-center gap-3 mb-4">
                        <Scale className="text-pink-600" size={40} />
                        <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
                    </div>
                    <p className="text-gray-600 text-sm">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 prose prose-pink max-w-none">
                    <section className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="text-pink-600" size={24} />
                            <h2 className="text-2xl font-bold text-gray-900 m-0">Agreement to Terms</h2>
                        </div>
                        <p className="text-gray-700">
                            By accessing and using this platform, you agree to be bound by these Terms of Service and all applicable
                            laws and regulations. If you do not agree with any of these terms, you are prohibited from using this platform.
                        </p>
                    </section>

                    <section className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="text-pink-600" size={24} />
                            <h2 className="text-2xl font-bold text-gray-900 m-0">User Accounts</h2>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mt-4">Registration</h3>
                        <ul className="text-gray-700 space-y-2">
                            <li>You must provide accurate and complete information during registration</li>
                            <li>You are responsible for maintaining the security of your account</li>
                            <li>You must be at least 18 years old to create an account</li>
                            <li>One person or entity may maintain only one account</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-900 mt-4">Account Termination</h3>
                        <p className="text-gray-700">
                            We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.
                        </p>
                    </section>

                    <section className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Store className="text-pink-600" size={24} />
                            <h2 className="text-2xl font-bold text-gray-900 m-0">Seller Obligations</h2>
                        </div>
                        <p className="text-gray-700">As a seller, you agree to:</p>
                        <ul className="text-gray-700 space-y-2">
                            <li>Provide accurate product/service descriptions and pricing</li>
                            <li>Fulfill orders in a timely manner as described</li>
                            <li>Maintain good communication with customers</li>
                            <li>Comply with all applicable laws and regulations</li>
                            <li>Pay applicable fees and commissions</li>
                            <li>Handle customer complaints professionally</li>
                            <li>Not engage in fraudulent or deceptive practices</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer Responsibilities</h2>
                        <p className="text-gray-700">As a customer, you agree to:</p>
                        <ul className="text-gray-700 space-y-2">
                            <li>Provide accurate delivery and payment information</li>
                            <li>Use the platform only for lawful purposes</li>
                            <li>Not engage in fraudulent activities</li>
                            <li>Treat sellers with respect and professionalism</li>
                            <li>Review and follow return/refund policies</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Payments and Fees</h2>
                        <h3 className="text-lg font-semibold text-gray-900 mt-4">For Customers</h3>
                        <ul className="text-gray-700 space-y-2">
                            <li>Prices are as displayed at the time of purchase</li>
                            <li>Payment must be made through the platform's payment system</li>
                            <li>You are responsible for any applicable taxes</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-900 mt-4">For Sellers</h3>
                        <ul className="text-gray-700 space-y-2">
                            <li>Platform fees and commissions apply as per subscription plan</li>
                            <li>Payouts are processed according to the payment schedule</li>
                            <li>Sellers are responsible for applicable taxes on their earnings</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertCircle className="text-pink-600" size={24} />
                            <h2 className="text-2xl font-bold text-gray-900 m-0">Prohibited Activities</h2>
                        </div>
                        <p className="text-gray-700">Users may not:</p>
                        <ul className="text-gray-700 space-y-2">
                            <li>Violate any laws or regulations</li>
                            <li>Infringe on intellectual property rights</li>
                            <li>Engage in fraudulent activities or scams</li>
                            <li>Post offensive, harmful, or inappropriate content</li>
                            <li>Attempt to manipulate reviews or ratings</li>
                            <li>Circumvent platform fees or commissions</li>
                            <li>Harass, threaten, or abuse other users</li>
                            <li>Use automated systems to access the platform</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
                        <p className="text-gray-700">
                            All content on this platform, including text, graphics, logos, and software, is the property of
                            the platform or its content suppliers and is protected by intellectual property laws.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
                        <p className="text-gray-700">
                            The platform acts as an intermediary between buyers and sellers. We are not responsible for:
                        </p>
                        <ul className="text-gray-700 space-y-2">
                            <li>Quality, safety, or legality of items advertised</li>
                            <li>Accuracy of seller listings</li>
                            <li>Ability of sellers to complete transactions</li>
                            <li>Ability of buyers to pay for transactions</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Dispute Resolution</h2>
                        <p className="text-gray-700">
                            Any disputes arising from use of this platform shall be resolved through good faith negotiation.
                            If resolution cannot be reached, disputes will be subject to the jurisdiction of courts in [Your Location].
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
                        <p className="text-gray-700">
                            We reserve the right to modify these terms at any time. Continued use of the platform after changes
                            constitutes acceptance of the modified terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
                        <p className="text-gray-700">
                            For questions about these Terms of Service, please contact us at:
                        </p>
                        <div className="bg-gray-50 p-4 rounded-xl mt-4">
                            <p className="text-gray-700 m-0">Email: legal@yourplatform.com</p>
                            <p className="text-gray-700 m-0">Phone: +91 1234567890</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
