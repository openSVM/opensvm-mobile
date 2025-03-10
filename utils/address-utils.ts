import { PublicKey } from '@solana/web3.js';

/**
 * Checks if a string is a valid Solana address or transaction ID
 * @param value The string to check
 * @returns Object with type and validity information
 */
export function parseSearchInput(value: string): { 
  type: 'account' | 'transaction' | 'block' | 'unknown',
  isValid: boolean,
  value: string
} {
  // Remove any whitespace
  const cleanValue = value.trim();
  
  // Check if it's a number (likely a block height)
  if (/^\d+$/.test(cleanValue)) {
    return {
      type: 'block',
      isValid: true,
      value: cleanValue
    };
  }
  
  // Check if it's a valid base58 string (both addresses and txids are base58)
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/;
  if (!base58Regex.test(cleanValue)) {
    return {
      type: 'unknown',
      isValid: false,
      value: cleanValue
    };
  }
  
  try {
    // Try to create a PublicKey (will throw if invalid)
    new PublicKey(cleanValue);
    
    // Transaction IDs are typically 88 characters long
    // Account addresses are typically 32-44 characters
    if (cleanValue.length >= 80) {
      return {
        type: 'transaction',
        isValid: true,
        value: cleanValue
      };
    } else {
      return {
        type: 'account',
        isValid: true,
        value: cleanValue
      };
    }
  } catch (error) {
    return {
      type: 'unknown',
      isValid: false,
      value: cleanValue
    };
  }
}

/**
 * Formats an address for display by showing only the first and last few characters
 * @param address The address to format
 * @param prefixLength Number of characters to show at the beginning
 * @param suffixLength Number of characters to show at the end
 * @returns Formatted address string
 */
export function formatAddress(address: string, prefixLength = 4, suffixLength = 4): string {
  if (!address || address.length <= prefixLength + suffixLength) {
    return address;
  }
  
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
}