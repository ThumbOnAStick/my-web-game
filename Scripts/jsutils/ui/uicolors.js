// Color palette for the game
export const COLORS = {
  // Main palette
  background: '#0a1922',  // Dark blue-black background
  primary: '#7de8e8',     // Bright cyan
  secondary: '#ffe45e',   // Warm yellow
  
  // UI colors
  surface: '#1a2930',     // Slightly lighter than background
  border: '#2a3940',      // Medium dark for borders
  text: '#ffffff',        // White text
  textMuted: '#8a9ba8',   // Muted text
  
  // State colors
  success: '#4ecca3',     // Mint green
  warning: '#ffa41b',     // Orange
  danger: '#ee5a6f',      // Coral red
  
  // Health states
  healthHigh: '#4ecca3',  // Mint green
  healthMid: '#ffa41b',   // Orange
  healthLow: '#ee5a6f',   // Coral red
  
  // Player colors
  player: '#7de8e8',      // Primary cyan
  opponent: '#ff6b9d',    // Pink/magenta
  
  // Effects
  glow: '#7de8e8',        // Glow effect (primary)
  shadow: '#000000',      // Shadow
};

/**
 * Get health color based on percentage
 * @param {number} percentage - Health percentage (0-1)
 * @returns {string} Color hex code
 */
export function getHealthColor(percentage) {
  if (percentage > 0.6) return COLORS.healthHigh;
  if (percentage > 0.3) return COLORS.healthMid;
  return COLORS.healthLow;
}

/**
 * Convert hex color to RGB values
 * @param {string} hex - Hex color code
 * @returns {{r: number, g: number, b: number}}
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Create rgba string from hex color
 * @param {string} hex - Hex color code
 * @param {number} alpha - Alpha value (0-1)
 * @returns {string} RGBA color string
 */
export function hexToRgba(hex, alpha = 1) {
  const rgb = hexToRgb(hex);
  return rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})` : hex;
}
