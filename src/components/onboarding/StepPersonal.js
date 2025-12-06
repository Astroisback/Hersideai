"use client";
import { User, Phone, Lock, AtSign } from "lucide-react";
import { translations } from "@/utils/translations";

export default function StepPersonal({ data, updateData, language = "en" }) {
    const t = translations[language];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">{t.tellUsAboutYourself}</h2>
                <p className="text-gray-500">{t.weWouldLoveToKnow}</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.fullNameLabel}</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={data.name || ""}
                            onChange={(e) => updateData({ name: e.target.value })}
                            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all text-gray-900"
                            placeholder={t.fullNamePlaceholder}
                        />
                        <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.whatsappNumber}</label>
                    <div className="relative">
                        <input
                            type="tel"
                            value={data.whatsapp || ""}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                updateData({ whatsapp: val });
                            }}
                            className={`w-full px-4 py-3 pl-10 border ${data.whatsapp && data.whatsapp.length !== 10 ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-pink-500'} rounded-xl focus:ring-2 outline-none transition-all text-gray-900`}
                            placeholder={t.whatsappPlaceholder}
                        />
                        <Phone className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    </div>
                    {data.whatsapp && data.whatsapp.length !== 10 && (
                        <p className="text-xs text-red-500 mt-1">{t.phoneNumberMustBe10}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{t.weWillUseForUpdates}</p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-800 mb-3">{t.loginCredentials}</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.usernameLabel}</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={data.username || ""}
                                    onChange={(e) => updateData({ username: e.target.value })}
                                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                                    placeholder={t.chooseUsername}
                                />
                                <AtSign className="absolute left-3 top-3.5 text-gray-400" size={20} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.passwordLabel}</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={data.password || ""}
                                    onChange={(e) => updateData({ password: e.target.value })}
                                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                                    placeholder={t.choosePassword}
                                />
                                <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
