"use client";
import { useState, useEffect } from "react";
import { validateEmail, validateEmailOptional } from "@/utils/validation";

export default function EmailInput({
    value,
    onChange,
    label = "Email Address",
    required = true,
    className = "",
    placeholder = "your@email.com",
    disabled = false
}) {
    const [error, setError] = useState("");
    const [touched, setTouched] = useState(false);

    useEffect(() => {
        if (touched || value) {
            const validation = required ? validateEmail(value) : validateEmailOptional(value);
            setError(validation.error);
        }
    }, [value, touched, required]);

    const handleChange = (e) => {
        const newValue = e.target.value.trim();
        onChange(newValue);
    };

    const handleBlur = () => {
        setTouched(true);
    };

    const isValid = !error;

    return (
        <div className={`${className}`}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
                type="email"
                value={value || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none transition-colors ${error && touched
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-pink-500"
                    } ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"}`}
            />
            {error && touched && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
            {!error && touched && value && (
                <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Valid
                </p>
            )}
        </div>
    );
}
