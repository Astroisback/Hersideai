"use client";
import { Store, Briefcase, ShoppingBag } from "lucide-react";
import { translations } from "@/utils/translations";

export default function StepBusiness({ data, updateData, language = "en" }) {
    const t = translations[language];

    const categories = [
        { id: "beauty", label: t.beautyServices, icon: "💄" },
        { id: "food", label: t.homemadeFood, icon: "🥘" },
        { id: "shops", label: t.smallShops, icon: "🛍️" },
        { id: "others", label: t.others, icon: "✨" },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">{t.tellUsAboutBusiness}</h2>
                <p className="text-gray-500">{t.helpUsUnderstand}</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.businessName}</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={data.businessName || ""}
                            onChange={(e) => updateData({ businessName: e.target.value })}
                            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all text-gray-900"
                            placeholder={t.businessNamePlaceholder}
                        />
                        <Store className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.selectCategory}</label>
                    <div className="space-y-2">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => updateData({ category: cat.id })}
                                className={`w-full p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${data.category === cat.id
                                    ? "border-pink-500 bg-pink-50 ring-1 ring-pink-500"
                                    : "border-gray-200 hover:bg-gray-50"
                                    }`}
                            >
                                <span className="text-xl">{cat.icon}</span>
                                <span className={`font-medium ${data.category === cat.id ? "text-pink-700" : "text-gray-700"}`}>
                                    {cat.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.whatDoYouDo}</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => updateData({ businessType: "seller" })}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${data.businessType === "seller"
                                ? "border-pink-500 bg-pink-50 text-pink-700"
                                : "border-gray-200 hover:border-pink-200 text-gray-600"
                                }`}
                        >
                            <ShoppingBag size={24} />
                            <span className="font-medium">{language === "en" ? "Seller" : "विक्रेता"}</span>
                            <span className="text-xs opacity-70 text-center">{language === "en" ? "selling and listing items like pickles, papad, etc" : "अचार, पापड़ आदि जैसी वस्तुओं को बेचना और सूचीबद्ध करना"}</span>
                        </button>
                        <button
                            onClick={() => updateData({ businessType: "service" })}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${data.businessType === "service"
                                ? "border-pink-500 bg-pink-50 text-pink-700"
                                : "border-gray-200 hover:border-pink-200 text-gray-600"
                                }`}
                        >
                            <Briefcase size={24} />
                            <span className="font-medium">{language === "en" ? "Service" : "सेवा"}</span>
                            <span className="text-xs opacity-70 text-center">{language === "en" ? "offering services like tutoring, mehendi, or mini salon" : "ट्यूशन, मेहंदी या मिनी सैलून जैसी सेवाएं प्रदान करना"}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
