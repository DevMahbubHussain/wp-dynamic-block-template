import { __, _x } from '@wordpress/i18n';

/**
 * Global Date Utilities for WordPress/WooCommerce Development.
 * * NOTE: For production use, you might substitute the native Date functions
 * with a robust library like 'date-fns' or 'moment.js' (if already included
 * in your build) to handle time zones and complex parsing more reliably.
 * These examples use native JS Date objects for maximum compatibility.
 */

// --- 1. Constants & Core Formats ---

/**
 * Gets the current locale-specific date format from WordPress settings.
 * * In a real-world scenario, you would fetch the format string using 
 * the 'useSettings' hook or exposing it via a localization script.
 * For this utility, we simulate a default.
 * * @returns {string} WordPress date format string (e.g., 'Y-m-d' or 'M j, Y').
 */
export const getWpDateFormat = () => {
    // Simulated fetch of the format string from the server/localization data
    // Defaulting to a common format if context isn't available.
    return window.wp.date?.dateFormat || 'M j, Y'; 
};

/**
 * Gets the current locale-specific time format from WordPress settings.
 * * @returns {string} WordPress time format string (e.g., 'g:i a' or 'H:i').
 */
export const getWpTimeFormat = () => {
    // Simulated fetch of the time format string.
    return window.wp.date?.timeFormat || 'g:i a';
};


// --- 2. Formatting Functions ---

/**
 * Formats a given date string (or Date object) into the WordPress preferred date format.
 * * @param {string|Date} dateValue Date string (ISO 8601) or Date object.
 * @returns {string} Formatted date string (e.g., "Jan 1, 2024").
 */
export const formatDate = (dateValue) => {
    if (!dateValue) return '';

    try {
        const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
        
        // Use Intl.DateTimeFormat for locale-aware formatting, mapping WordPress parts
        // to standard options. This is safer than manually implementing 'Y-m-d' parsing.
        const options = { year: 'numeric', month: 'short', day: 'numeric' };

        // The 'woocommerce' text domain is used here for context
        return new Intl.DateTimeFormat(getWpLocale(), options).format(date);

    } catch (e) {
        console.error('Error formatting date:', e);
        return dateValue.toString();
    }
};

/**
 * Formats a given date string (or Date object) into the WordPress preferred time format.
 * * @param {string|Date} dateValue Date string (ISO 8601) or Date object.
 * @returns {string} Formatted time string (e.g., "9:30 am").
 */
export const formatTime = (dateValue) => {
    if (!dateValue) return '';

    try {
        const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
        
        // This is a simplified approach. Full WP time format (g:i a) requires more logic.
        const is24Hour = getWpTimeFormat().includes('H');
        const options = { hour: 'numeric', minute: '2-digit', hour12: !is24Hour };

        return new Intl.DateTimeFormat(getWpLocale(), options).format(date);

    } catch (e) {
        return '';
    }
};

/**
 * Formats a date and time together.
 * @param {string|Date} dateValue 
 * @returns {string} Formatted date and time string.
 */
export const formatDateTime = (dateValue) => {
    const datePart = formatDate(dateValue);
    const timePart = formatTime(dateValue);
    
    if (!datePart && !timePart) return '';

    // Translator Comment Context: 'date' and 'time' are placeholders for formatted values.
    return _x(
        '%1$s at %2$s', // E.g., "January 1, 2024 at 9:30 am"
        'date and time format, %1$s is date, %2$s is time',
        'woocommerce' 
    ).replace( '%1$s', datePart ).replace( '%2$s', timePart );
};

// --- 3. WooCommerce/Date Comparison Utilities ---

/**
 * Checks if a given date is in the past relative to the current time.
 * Useful for checking expiration dates, event completion, etc.
 * * @param {string|Date} dateValue Date to check.
 * @returns {boolean} True if the date is in the past.
 */
export const isDateInPast = (dateValue) => {
    if (!dateValue) return false;
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    return date.getTime() < Date.now();
};

/**
 * Checks if a WooCommerce sale price is currently active.
 * Requires sale start and end dates (which can be null).
 * * @param {string|null} startDateString ISO string for sale start date.
 * @param {string|null} endDateString ISO string for sale end date.
 * @returns {boolean} True if the current time is between start and end dates.
 */
export const isSaleActive = (startDateString, endDateString) => {
    const now = Date.now();

    // Check if a start date exists and if the current time is after the start
    const isStarted = startDateString 
        ? now >= new Date(startDateString).getTime() 
        : true; // If no start date, sale is considered started

    // Check if an end date exists and if the current time is before the end
    const isNotEnded = endDateString 
        ? now < new Date(endDateString).getTime() 
        : true; // If no end date, sale is considered not ended

    return isStarted && isNotEnded;
};


// --- 4. Helper for Locale (Internal Use) ---

/**
 * Attempts to derive the current locale for Intl formatting.
 * @returns {string} The locale string (e.g., 'en-US', 'es-ES').
 */
const getWpLocale = () => {
    return document.documentElement.lang || navigator.language || 'en-US';
};