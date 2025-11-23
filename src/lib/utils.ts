import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a phone number to display format attractively based on country
 * @param phoneNumber - The phone number to format (e.g., "+34600000002")
 * @returns Formatted phone number (e.g., "+34 600 000 002")
 */
export function formatPhoneNumber(phoneNumber: string): string {
  if (!phoneNumber) return '';

  // Remove all non-digit characters except the leading +
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');

  if (!cleaned.startsWith('+')) {
    return phoneNumber; // Return original if no country code
  }

  // Map of common country codes to their expected formats
  const countryFormats = {
    // North America (US, Canada) - 1
    '1': (number: string) => {
      if (number.length === 10) {
        return `+1 (${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(
          6
        )}`;
      }
      return `+1 ${number}`;
    },
    // Spain - 34
    '34': (number: string) => {
      if (number.length === 9) {
        return `+34 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(
          6
        )}`;
      }
      return `+34 ${number}`;
    },
    // France - 33
    '33': (number: string) => {
      if (number.length === 9) {
        return `+33 ${number.slice(0, 1)} ${number.slice(1, 3)} ${number.slice(
          3,
          5
        )} ${number.slice(5, 7)} ${number.slice(7)}`;
      }
      return `+33 ${number}`;
    },
    // Germany - 49
    '49': (number: string) => {
      if (number.length >= 10) {
        return `+49 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(
          6
        )}`;
      }
      return `+49 ${number}`;
    },
    // UK - 44
    '44': (number: string) => {
      if (number.length === 10) {
        return `+44 ${number.slice(0, 4)} ${number.slice(4, 7)} ${number.slice(
          7
        )}`;
      }
      return `+44 ${number}`;
    },
    // Italy - 39
    '39': (number: string) => {
      if (number.length === 10) {
        return `+39 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(
          6
        )}`;
      }
      return `+39 ${number}`;
    },
    // Mexico - 52
    '52': (number: string) => {
      if (number.length === 10) {
        return `+52 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(
          6
        )}`;
      }
      return `+52 ${number}`;
    },
  };

  // Try to match known country codes (1-3 digits)
  for (let i = 1; i <= 3; i++) {
    const countryCode = cleaned.slice(1, 1 + i);
    const number = cleaned.slice(1 + i);

    if (countryFormats[countryCode] && number.length >= 7) {
      return countryFormats[countryCode](number);
    }
  }

  // Generic formatting for unknown country codes
  const match = cleaned.match(/^\+(\d{1,3})(\d+)$/);
  if (match) {
    const [, countryCode, number] = match;

    // Generic attractive formatting
    if (number.length >= 9) {
      // Split into groups of 3
      const groups = [];
      for (let i = 0; i < number.length; i += 3) {
        groups.push(number.slice(i, i + 3));
      }
      return `+${countryCode} ${groups.join(' ')}`;
    } else if (number.length >= 6) {
      // Split into two parts
      const mid = Math.ceil(number.length / 2);
      return `+${countryCode} ${number.slice(0, mid)} ${number.slice(mid)}`;
    } else {
      return `+${countryCode} ${number}`;
    }
  }

  // If all else fails, return original
  return phoneNumber;
}
