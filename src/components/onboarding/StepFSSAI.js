"use client";
import { useState } from "react";
import { FileText, Shield, AlertCircle, CheckCircle } from "lucide-react";

export default function StepFSSAI({ data, updateData }) {
    const [error, setError] = useState("");

    const handleLicenseChange = (e) => {
        const value = e.target.value.replace(/\D/g, ""); // Remove non-digits

        if (value.length <= 14) {
            updateData({ fssaiLicenseNumber: value });

            if (value.length > 0 && value.length < 14) {
                setError(`License number must be exactly 14 digits (${value.length}/14)`);
            } else if (value.length === 14) {
                setError("");
            } else {
                setError("");
            }
        }
    };

    const isValid = data.fssaiLicenseNumber && data.fssaiLicenseNumber.length === 14;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="text-orange-600" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">FSSAI Verification Required</h2>
                <p className="text-gray-500 mt-2">
                    As a food seller, you need to provide your valid FSSAI license number
                </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                    <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
                    <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">Why is this needed?</p>
                        <p>FSSAI (Food Safety and Standards Authority of India) certification is mandatory for all food businesses in India to ensure food safety and quality standards.</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        FSSAI License Number <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                        <input
                            type="text"
                            value={data.fssaiLicenseNumber || ""}
                            onChange={handleLicenseChange}
                            placeholder="Enter 14-digit license number"
                            maxLength={14}
                            className={`w-full px-4 py-3 pl-12 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all text-gray-900 text-lg tracking-wider ${error
                                ? "border-red-300 bg-red-50"
                                : isValid
                                    ? "border-green-300 bg-green-50"
                                    : "border-gray-300"
                                }`}
                        />
                        <FileText className={`absolute left-4 top-3.5 ${error ? "text-red-400" : isValid ? "text-green-500" : "text-gray-400"
                            }`} size={20} />

                        {isValid && (
                            <CheckCircle className="absolute right-4 top-3.5 text-green-500" size={20} />
                        )}
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                            {data.fssaiLicenseNumber?.length || 0}/14 digits
                        </p>
                        {error && (
                            <p className="text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle size={14} />
                                {error}
                            </p>
                        )}
                        {isValid && (
                            <p className="text-xs text-green-600 flex items-center gap-1">
                                <CheckCircle size={14} />
                                Valid license number
                            </p>
                        )}
                    </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">FSSAI License Format:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Must be exactly 14 digits</li>
                        <li>• No spaces or special characters</li>
                        <li>• Example: 12345678901234</li>
                    </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={18} />
                        <div className="text-sm text-blue-800">
                            <p className="font-semibold mb-1">Don't have an FSSAI license?</p>
                            <p>You can apply for FSSAI registration at <a href="https://foscos.fssai.gov.in" target="_blank" rel="noopener noreferrer" className="underline font-medium">foscos.fssai.gov.in</a></p>
                        </div>
                    </div>
                </div>

                {!isValid && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="text-yellow-600 shrink-0 mt-0.5" size={18} />
                            <p className="text-sm text-yellow-800">
                                <strong>Important:</strong> You cannot proceed without a valid 14-digit FSSAI license number. This is mandatory for all food sellers.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
