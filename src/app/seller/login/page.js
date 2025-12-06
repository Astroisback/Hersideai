"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import TermsModal from "@/components/TermsModal";
import { Store, ArrowRight, Lock, Languages } from "lucide-react";
import Link from "next/link";
import { translations } from "@/utils/translations";

export default function SellerLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showTerms, setShowTerms] = useState(false);
    const [loginResult, setLoginResult] = useState(null);
    const [language, setLanguage] = useState("en");
    const { login } = useAuth();
    const router = useRouter();

    const t = translations[language];

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        const result = await login(username, password);
        if (result) {
            // Login successful, show terms
            // Store the result (businessType) to use after terms acceptance if needed
            // For now, we'll just redirect after terms
            // But wait, the terms modal is shown BEFORE redirect.
            // We should probably store the businessType in state to use it in handleTermsAccepted
            setLoginResult(result);
            setShowTerms(true);
        } else {
            setError(t.invalidCredentials);
        }
    };

    const handleTermsAccepted = () => {
        setShowTerms(false);
        // Redirect based on business type
        if (loginResult === "service") {
            router.push("/service/dashboard");
        } else {
            router.push("/seller/dashboard");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col md:flex-row">

                {/* Login Form */}
                <div className="w-full p-8 md:p-10">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2 text-pink-600">
                            <Store size={28} />
                            <h1 className="text-2xl font-bold tracking-tight">{t.brandName}</h1>
                        </div>
                        <button
                            onClick={() => setLanguage(prev => prev === "en" ? "hi" : "en")}
                            className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-pink-600 transition-colors"
                        >
                            <Languages size={18} />
                            {language === "en" ? "EN" : "HI"}
                        </button>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{t.sellerLogin}</h2>
                    <p className="text-gray-500 text-sm mb-6">{t.loginSubtitle}</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.usernameLabel}</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all text-gray-900"
                                placeholder={t.usernamePlaceholder}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.passwordLabel}</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all text-gray-900"
                                    placeholder={t.passwordPlaceholder}
                                />
                                <Lock className="absolute right-3 top-2.5 text-gray-400" size={18} />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-100">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-pink-200"
                        >
                            {t.loginButton}
                            <ArrowRight size={18} />
                        </button>
                    </form>



                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            {t.dontHaveAccount}{" "}
                            <Link href="/seller/plans" className="text-pink-600 font-medium hover:underline">
                                {t.createOne}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <TermsModal
                isOpen={showTerms}
                onClose={() => setShowTerms(false)}
                onAccept={handleTermsAccepted}
            />
        </div>
    );
}
