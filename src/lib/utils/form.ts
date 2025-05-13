/**
 * Format a date to a human-readable string.
 * @param date - The date to format, either as a Date object or a string.
 * @returns A formatted date string like "Jan 1, 2024".
 */
// export function formatDate(date: Date | string): string {
//   if (!date) return '';
//   const d = typeof date === 'string' ? new Date(date) : date;
//   return d.toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric'
//   });
// }

/**
 * Truncate a string to a maximum length and add ellipsis.
 * @param text - The input string.
 * @param maxLength - Maximum length before truncation (default is 100).
 * @returns The truncated string with ellipsis if needed.
 */
// export function truncateText(text: string, maxLength: number = 100): string {
//   if (!text) return '';
//   if (text.length <= maxLength) return text;
//   return `${text.slice(0, maxLength)}...`;
// }

/**
 * Check whether an object has no own enumerable properties.
 * @param obj - The object to check.
 * @returns `true` if the object is empty, otherwise `false`.
 */
// export function isEmptyObject(obj: Record<string, unknown>): boolean {
//   return Object.keys(obj).length === 0;
// }

/**
 * Deep clone a simple object using JSON methods.
 * @note Not suitable for objects with functions, symbols, undefined, or circular references.
 * @param obj - The object to clone.
 * @returns A deep-cloned copy of the object.
 */
// export function deepClone<T>(obj: T): T {
//   return JSON.parse(JSON.stringify(obj));
// }

/**
 * Generate a simple random string ID.
 * @returns A short alphanumeric string.
 * @example "k8g3lz1"
 */
// export function generateSimpleId(): string {
//   return Math.random().toString(36).substring(2, 9);
// }

/**
 * Convert a string to Title Case (capitalizes each word).
 * @param str - The string to convert.
 * @returns The Title Case version of the input.
 * @example "hello world" → "Hello World"
 */
// export function toTitleCase(str: string): string {
//   if (!str) return '';
//   return str.replace(
//     /\w\S*/g,
//     (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
//   );
// }

/**
 * Safely get a deeply nested value from an object.
 * @param obj - The object to read from.
 * @param path - Dot-separated path to the property (e.g., "user.profile.name").
 * @param defaultValue - Value to return if path is not found.
 * @returns The nested value or the default.
 */
// export function getNestedValue<T, D = undefined>(
//   obj: Record<string, unknown>,
//   path: string,
//   defaultValue?: D
// ): T | D {
//   if (!obj || !path) return defaultValue as D;

//   const keys = path.split('.');
//   let current: unknown = obj;

//   for (const key of keys) {
//     if (current === null || current === undefined || typeof current !== 'object') {
//       return defaultValue as D;
//     }
//     current = (current as Record<string, unknown>)[key];
//   }

//   return current as T ?? defaultValue as D;
// }

/**
 * Format a number as currency.
 * @param value - The numeric value to format.
 * @param locale - Locale string (default is 'en-US').
 * @param currency - Currency code (default is 'USD').
 * @returns The formatted currency string.
 * @example 1234.5 → "$1,234.50"
 */
// export function formatCurrency(
//   value: number,
//   locale = 'en-US',
//   currency = 'USD'
// ): string {
//   return new Intl.NumberFormat(locale, {
//     style: 'currency',
//     currency,
//   }).format(value);
// }

/**
 * Create a debounced version of a function.
 * @param fn - The function to debounce.
 * @param delay - The debounce delay in milliseconds.
 * @returns A debounced function that delays invoking `fn`.
 */
// export function debounce<T extends (...args: any[]) => void>(
//   fn: T,
//   delay: number
// ): (...args: Parameters<T>) => void {
//   let timeoutId: ReturnType<typeof setTimeout> | null = null;

//   return function (this: any, ...args: Parameters<T>): void {
//     if (timeoutId) {
//       clearTimeout(timeoutId);
//     }

//     timeoutId = setTimeout(() => {
//       fn.apply(this, args);
//       timeoutId = null;
//     }, delay);
//   };
// }
