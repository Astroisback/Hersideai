// Validation utilities for phone and email

/**
 * Validates Indian phone number (10 digits)
 * @param {string} value - Phone number to validate
 * @returns {object} - {isValid: boolean, error: string}
 */
export const validatePhone = (value) => {
    if (!value || value.trim() === "") {
        return { isValid: false, error: "Phone number is required" };
    }

    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(value)) {
        return { isValid: false, error: "Please enter a valid 10-digit mobile number" };
    }

    return { isValid: true, error: "" };
};

/**
 * Validates email address (RFC standard)
 * @param {string} value - Email to validate
 * @returns {object} - {isValid: boolean, error: string}
 */
export const validateEmail = (value) => {
    if (!value || value.trim() === "") {
        return { isValid: false, error: "Email is required" };
    }

    // RFC-compliant email regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(value)) {
        return { isValid: false, error: "Please enter a valid email address" };
    }

    return { isValid: true, error: "" };
};

/**
 * Formats phone input by removing non-numeric characters
 * @param {string} value - Raw input value
 * @returns {string} - Cleaned numeric-only string
 */
export const formatPhoneInput = (value) => {
    return value.replace(/\D/g, "").slice(0, 10);
};

/**
 * Validates phone without required check (for optional fields)
 * @param {string} value - Phone number to validate
 * @returns {object} - {isValid: boolean, error: string}
 */
export const validatePhoneOptional = (value) => {
    if (!value || value.trim() === "") {
        return { isValid: true, error: "" };
    }
    return validatePhone(value);
};

/**
 * Validates email without required check (for optional fields)
 * @param {string} value - Email to validate
 * @returns {object} - {isValid: boolean, error: string}
 */
export const validateEmailOptional = (value) => {
    if (!value || value.trim() === "") {
        return { isValid: true, error: "" };
    }
    return validateEmail(value);
};
