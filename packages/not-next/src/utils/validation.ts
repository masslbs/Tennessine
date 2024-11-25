// Any utility functions for form validation

export const isValidHex = (hex: string) => {
  return Boolean(hex.match(/^0x[0-9a-f]+$/i));
};
