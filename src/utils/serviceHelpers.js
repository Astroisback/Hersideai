/**
 * Service Mode Helper Utilities
 * Provides conditional label and UI logic based on seller's business type
 */

/**
 * Get conditional labels based on seller's business type
 * @param {string} businessType - "seller" (product mode) or "service" (service mode)
 * @param {object} t - Translation object from translations.js
 * @returns {object} - Conditional labels for UI
 */
export const getConditionalLabels = (businessType, t) => {
    const isServiceMode = businessType === "service";

    return {
        // Main tab labels
        myProductsOrServices: isServiceMode ? t.myServices : t.myProducts,
        ordersOrBookings: isServiceMode ? t.bookings : t.orders,

        // Action button labels
        addButton: isServiceMode ? t.addService : t.addProduct,

        // Item type identifier
        itemType: isServiceMode ? 'service' : 'product',

        // Collection name for Firestore queries
        collectionName: isServiceMode ? 'services' : 'products',
        orderCollectionName: isServiceMode ? 'bookings' : 'orders',

        // UI mode flag
        isServiceMode,
        isProductMode: !isServiceMode
    };
};

/**
 * Get booking status color for UI
 * @param {string} status - "pending", "approved", "declined", or "busy"
 * @returns {string} - Tailwind CSS color classes
 */
export const getBookingStatusColor = (status) => {
    switch (status) {
        case 'approved':
            return 'bg-green-100 text-green-700 border-green-300';
        case 'declined':
        case 'busy':
            return 'bg-red-100 text-red-700 border-red-300';
        case 'pending':
        default:
            return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    }
};

/**
 * Get booking status label
 * @param {string} status - "pending", "approved", "declined", or "busy"
 * @param {object} t - Translation object
 * @returns {string} - Translated status label
 */
export const getBookingStatusLabel = (status, t) => {
    switch (status) {
        case 'approved':
            return t.approved;
        case 'declined':
            return t.declined;
        case 'busy':
            return t.busy;
        case 'pending':
        default:
            return t.pending;
    }
};

/**
 * Format time slot for display
 * @param {object} slot - Time slot object with startTime and endTime
 * @returns {string} - Formatted time slot string
 */
export const formatTimeSlot = (slot) => {
    if (!slot || !slot.startTime || !slot.endTime) return '';
    return `${slot.startTime} - ${slot.endTime}`;
};

/**
 * Validate time slot
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateTimeSlot = (startTime, endTime) => {
    if (!startTime || !endTime) return false;

    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);

    return end > start;
};

/**
 * Check if seller has services with available time slots
 * @param {Array} services - Array of service objects
 * @returns {boolean} - True if at least one service has time slots
 */
export const hasActiveServices = (services) => {
    if (!services || services.length === 0) return false;
    return services.some(service =>
        service.timeSlots &&
        service.timeSlots.length > 0 &&
        service.isActive !== false
    );
};
