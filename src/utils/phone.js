// Sri Lanka phone rules — kept identical to Register.jsx
export const SL_PHONE_REGEX = /^(\+94\d{9}|0\d{9})$/;
export const PHONE_ERROR = "Enter a valid Sri Lanka phone number (e.g. 0771234567 or +94771234567)";
export const sanitizePhoneInput = v => v.replace(/[^\d+\s]/g, "");
export const isValidPhone = v => SL_PHONE_REGEX.test(v.replace(/\s+/g, ""));
