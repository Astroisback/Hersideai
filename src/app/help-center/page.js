"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, HelpCircle, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { helpCenterData } from "@/data/helpCenterData";

// Accordion Component
function FAQAccordion({ faq }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-200 rounded-xl mb-3 overflow-hidden hover:border-pink-300 transition-colors">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors text-left"
            >
                <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                {isOpen ? (
                    <ChevronUp className="text-pink-600 flex-shrink-0" size={20} />
                ) : (
                    <ChevronDown className="text-gray-400 flex-shrink-0" size={20} />
                )}
            </button>

            {isOpen && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed mb-4">{faq.answer}</p>
                    {faq.links && faq.links.length > 0 && (
                        <div className="flex flex-wrap gap-3">
                            {faq.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url}
                                    className="inline-flex items-center gap-1 text-sm text-pink-600 hover:text-pink-700 font-medium"
                                >
                                    {link.text}
                                    <ExternalLink size={14} />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function HelpCenter() {
    const [searchQuery, setSearchQuery] = useState("");

    // Filter FAQs based on search
    const filterFAQs = (faqs) => {
        if (!searchQuery) return faqs;
        return faqs.filter(faq =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const filteredCustomerFAQs = filterFAQs(helpCenterData.forCustomers);
    const filteredSellerFAQs = filterFAQs(helpCenterData.forSellers);
    const filteredAccountFAQs = filterFAQs(helpCenterData.commonTopics.accountProfile);
    const filteredOrdersFAQs = filterFAQs(helpCenterData.commonTopics.ordersPayments);
    const filteredTechFAQs = filterFAQs(helpCenterData.commonTopics.technicalSupport);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <Link href="/" className="text-pink-600 hover:text-pink-700 text-sm font-medium mb-4 inline-block">
                        ← Back to Home
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
                    <p className="text-gray-600 text-lg">Find instant answers to your questions</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Search Bar */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="relative">
                        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search for help... (e.g., 'how to track order', 'payment methods')"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                        />
                    </div>
                    {searchQuery && (
                        <p className="text-sm text-gray-500 mt-2">
                            Found {filteredCustomerFAQs.length + filteredSellerFAQs.length + filteredAccountFAQs.length + filteredOrdersFAQs.length + filteredTechFAQs.length} results
                        </p>
                    )}
                </div>

                {/* For Customers */}
                {filteredCustomerFAQs.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                                <HelpCircle className="text-pink-600" size={20} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">For Customers</h2>
                        </div>
                        <div className="space-y-0">
                            {filteredCustomerFAQs.map(faq => (
                                <FAQAccordion key={faq.id} faq={faq} />
                            ))}
                        </div>
                    </div>
                )}

                {/* For Sellers */}
                {filteredSellerFAQs.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <HelpCircle className="text-purple-600" size={20} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">For Sellers</h2>
                        </div>
                        <div className="space-y-0">
                            {filteredSellerFAQs.map(faq => (
                                <FAQAccordion key={faq.id} faq={faq} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Common Topics */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Common Topics</h2>

                    {/* Account & Profile */}
                    {filteredAccountFAQs.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account & Profile</h3>
                            <div className="space-y-0">
                                {filteredAccountFAQs.map(faq => (
                                    <FAQAccordion key={faq.id} faq={faq} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Orders & Payments */}
                    {filteredOrdersFAQs.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders & Payments</h3>
                            <div className="space-y-0">
                                {filteredOrdersFAQs.map(faq => (
                                    <FAQAccordion key={faq.id} faq={faq} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Technical Support */}
                    {filteredTechFAQs.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Support</h3>
                            <div className="space-y-0">
                                {filteredTechFAQs.map(faq => (
                                    <FAQAccordion key={faq.id} faq={faq} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* No Results */}
                {searchQuery && (filteredCustomerFAQs.length + filteredSellerFAQs.length + filteredAccountFAQs.length + filteredOrdersFAQs.length + filteredTechFAQs.length) === 0 && (
                    <div className="text-center py-12">
                        <HelpCircle size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                        <p className="text-gray-600 mb-6">Try different keywords or browse categories below</p>
                        <button
                            onClick={() => setSearchQuery("")}
                            className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                        >
                            Clear Search
                        </button>
                    </div>
                )}

                {/* Contact Support */}
                <div className="mt-12 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl p-8 text-white text-center">
                    <HelpCircle size={48} className="mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Still need help?</h2>
                    <p className="mb-6 text-pink-100">Our support team is here to assist you</p>
                    <Link href="/contact" className="inline-block bg-white text-pink-600 px-8 py-3 rounded-xl font-bold hover:bg-pink-50 transition-colors">
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
}
