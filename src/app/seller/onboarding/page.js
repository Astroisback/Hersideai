"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, setDoc, writeBatch } from "firebase/firestore";
import { ChevronRight, ChevronLeft, Check, Languages } from "lucide-react";
import { translations } from "@/utils/translations";

import StepPersonal from "@/components/onboarding/StepPersonal";
import StepBusiness from "@/components/onboarding/StepBusiness";
import StepFSSAI from "@/components/onboarding/StepFSSAI";
import StepProfile from "@/components/onboarding/StepProfile";
import StepLocation from "@/components/onboarding/StepLocation";

function OnboardingPageContent() {
    const searchParams = useSearchParams();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState("free");
    const [language, setLanguage] = useState("en");
    const [formData, setFormData] = useState({
        // Step 1
        name: "",
        whatsapp: "",
        username: "",
        password: "",
        // Step 2
        businessName: "",
        businessType: "", // seller or service
        category: "",
        // Step 2.5 (FSSAI - conditional)
        fssaiLicenseNumber: "",
        // Step 3
        displayName: "",
        address: "",
        phone: "",
        description: "",
        // Step 4
        location: null,
    });

    const { user, setIsOnboarded } = useAuth();
    const router = useRouter();

    const t = translations[language];

    useEffect(() => {
        // Get plan from URL params
        const plan = searchParams.get("plan");
        if (plan && (plan === "free" || plan === "premium")) {
            setSelectedPlan(plan);
        } else {
            // Redirect to plan selection if no valid plan
            router.push("/seller/plans");
        }
    }, [searchParams, router]);

    const updateData = (newData) => {
        setFormData((prev) => ({ ...prev, ...newData }));
    };

    // Check if FSSAI step is required
    const requiresFSSAI = formData.category === "food" && formData.businessType === "seller";
    const totalSteps = requiresFSSAI ? 5 : 4;

    const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Create seller document in Firestore
            const sellerRef = await addDoc(collection(db, "sellers"), {
                ...formData,
                createdAt: new Date(),
                storeStatus: "live",
                // Subscription plan fields
                subscriptionPlan: selectedPlan,
                monthlyEarnings: 0,
                productCount: 0,
                earningsResetDate: new Date(),
                // FSSAI license (for food sellers)
                fssaiLicenseNumber: formData.fssaiLicenseNumber || null,
            });

            // Get the generated document ID
            const sellerId = sellerRef.id;

            // Prepare seller data for localStorage and AuthContext
            const sellerData = {
                id: sellerId,
                ...formData,
                role: "seller",
                isOnboarded: true,
                subscriptionPlan: selectedPlan,
            };

            // Store in localStorage
            localStorage.setItem("seller_user", JSON.stringify(sellerData));

            // Update Auth Context
            setIsOnboarded(true);

            // Show success message
            const planName = selectedPlan === "premium" ? "PREMIUM" : "FREE";
            alert(`${t.accountCreatedSuccess}\n${t.plan}: ${planName}\n${t.sellerId}: ${sellerId}`);

            // Redirect to dashboard
            router.push("/seller/dashboard");
        } catch (error) {
            console.error("Error saving data:", error);
            alert(t.failedToSave);
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1: return <StepPersonal data={formData} updateData={updateData} language={language} />;
            case 2: return <StepBusiness data={formData} updateData={updateData} language={language} />;
            case 3:
                // If FSSAI is required, show it at step 3
                if (requiresFSSAI) {
                    return <StepFSSAI data={formData} updateData={updateData} language={language} />;
                }
                // Otherwise, show Profile at step 3
                return <StepProfile data={formData} updateData={updateData} language={language} />;
            case 4:
                // If FSSAI was shown, Profile is at step 4
                if (requiresFSSAI) {
                    return <StepProfile data={formData} updateData={updateData} language={language} />;
                }
                // Otherwise, Location is at step 4
                return <StepLocation data={formData} updateData={updateData} language={language} />;
            case 5:
                // Location is always at step 5 when FSSAI is required
                return <StepLocation data={formData} updateData={updateData} language={language} />;
            default: return null;
        }
    };

    // Validation for each step
    const canProceed = () => {
        console.log('Checking canProceed for step:', step, 'requiresFSSAI:', requiresFSSAI);
        console.log('FormData:', formData);

        switch (step) {
            case 1:
                const step1Valid = formData.name?.trim() && formData.username?.trim() && formData.password?.trim() && formData.whatsapp?.trim();
                console.log('Step 1 validation:', step1Valid);
                return step1Valid;
            case 2:
                const step2Valid = formData.businessName?.trim() && formData.category && formData.businessType;
                console.log('Step 2 validation:', step2Valid);
                return step2Valid;
            case 3:
                if (requiresFSSAI) {
                    // FSSAI step - 14-digit license number is required
                    const fssaiValid = formData.fssaiLicenseNumber && formData.fssaiLicenseNumber.length === 14;
                    console.log('Step 3 FSSAI validation:', fssaiValid, 'License:', formData.fssaiLicenseNumber);
                    return fssaiValid;
                }
                // Profile step - address is now in StepLocation, so don't require it here
                const step3ProfileValid = formData.displayName?.trim() && formData.phone?.trim() && formData.phone?.length === 10 && formData.description?.trim();
                console.log('Step 3 Profile validation:', step3ProfileValid);
                return step3ProfileValid;
            case 4:
                if (requiresFSSAI) {
                    // Profile step when FSSAI was shown - address is now in StepLocation
                    const step4ProfileValid = formData.displayName?.trim() &&
                        formData.phone?.trim() &&
                        formData.phone?.length === 10 &&
                        formData.description?.trim();
                    console.log('Step 4 Profile (with FSSAI) validation:', step4ProfileValid);
                    console.log('  displayName:', formData.displayName);
                    console.log('  phone:', formData.phone, 'length:', formData.phone?.length);
                    console.log('  description:', formData.description);
                    return step4ProfileValid;
                }
                // Location step
                console.log('Step 4 Location validation: true (optional)');
                return true; // Location is optional
            case 5:
                // Location step
                console.log('Step 5 Location validation: true (optional)');
                return true; // Location is optional
            default:
                return false;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h1 className="font-bold text-lg text-gray-800">{t.sellerOnboarding}</h1>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500">
                        {t.stepOf.replace("{step}", step).replace("{total}", totalSteps)}
                    </div>
                    <button
                        onClick={() => setLanguage(prev => prev === "en" ? "hi" : "en")}
                        className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-pink-600 transition-colors"
                    >
                        <Languages size={18} />
                        {language === "en" ? "EN" : "HI"}
                    </button>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-gray-200 w-full">
                <div
                    className="h-full bg-pink-600 transition-all duration-300"
                    style={{ width: `${(step / totalSteps) * 100}%` }}
                />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center p-6">
                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-20">
                    {renderStep()}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-between items-center z-10">
                <button
                    onClick={prevStep}
                    disabled={step === 1}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${step === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                        }`}
                >
                    {t.back}
                </button>

                {step < totalSteps ? (
                    <button
                        onClick={nextStep}
                        disabled={!canProceed()}
                        className={`px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg ${canProceed()
                            ? "bg-pink-600 text-white hover:bg-pink-700 shadow-pink-200"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        {t.nextStep}
                        <ChevronRight size={18} />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-8 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg shadow-green-200"
                    >
                        {loading ? t.saving : t.completeSetup}
                        {!loading && <Check size={18} />}
                    </button>
                )}
            </div>
        </div>
    );
}

export default function OnboardingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div></div>}>
            <OnboardingPageContent />
        </Suspense>
    );
}
