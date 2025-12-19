/**
 * Valorant Sensitivity Calculation Utilities
 *
 * Based on the following technical specifications:
 * - Valorant Yaw: 0.07 degrees per mouse count
 * - Valorant FOV: 103 degrees (horizontal, fixed)
 * - cm/360 formula: 914.4 / (DPI × Sens × 0.07) = 13062.86 / (DPI × Sens)
 */

// Valorant's fixed yaw value (degrees per mouse count)
export const VALORANT_YAW = 0.07;

// Valorant's fixed horizontal FOV
export const VALORANT_FOV = 103;

/**
 * Calculate effective DPI (eDPI)
 * eDPI = DPI × In-game Sensitivity
 *
 * @param dpi - Mouse DPI setting
 * @param sensitivity - Valorant in-game sensitivity
 * @returns eDPI value
 */
export function calculateEDPI(dpi: number, sensitivity: number): number {
  return dpi * sensitivity;
}

/**
 * Calculate cm/360 (centimeters needed to complete a 360° rotation)
 * Formula: 13062.86 / (DPI × Sensitivity)
 *
 * @param dpi - Mouse DPI setting
 * @param sensitivity - Valorant in-game sensitivity
 * @returns Distance in centimeters for 360° rotation
 */
export function calculateCm360(dpi: number, sensitivity: number): number {
  const eDPI = calculateEDPI(dpi, sensitivity);
  if (eDPI === 0) return Infinity;
  return 13062.86 / eDPI;
}

/**
 * Calculate inches/360
 *
 * @param dpi - Mouse DPI setting
 * @param sensitivity - Valorant in-game sensitivity
 * @returns Distance in inches for 360° rotation
 */
export function calculateIn360(dpi: number, sensitivity: number): number {
  return calculateCm360(dpi, sensitivity) / 2.54;
}

/**
 * Calculate the sensitivity factor for the web trainer
 * This converts mouse movement (from Pointer Lock API) to crosshair movement on screen
 *
 * The Pointer Lock API provides movementX/Y in pixels based on the OS DPI.
 * We need to translate this to simulate Valorant's feel.
 *
 * @param dpi - Mouse DPI setting
 * @param valorantSens - Valorant in-game sensitivity
 * @param screenWidth - Current screen/canvas width in pixels
 * @param fov - Field of view (default: 103 for Valorant)
 * @returns Sensitivity factor to multiply with mouse movement
 */
export function calculateWebSensitivity(
  _dpi: number,
  valorantSens: number,
  screenWidth: number,
  fov: number = VALORANT_FOV
): number {
  // Degrees rotated per mouse count in Valorant
  const degreesPerCount = valorantSens * VALORANT_YAW;

  // Pixels per degree on screen (based on FOV)
  const pixelsPerDegree = screenWidth / fov;

  // The Pointer Lock API movementX is already in mouse DPI units (counts)
  // So we just need: degrees per count × pixels per degree
  return degreesPerCount * pixelsPerDegree;
}

/**
 * Alternative sensitivity calculation using eDPI
 * This provides a simpler, more consistent feel across different DPI/sens combinations
 *
 * @param dpi - Mouse DPI setting
 * @param valorantSens - Valorant in-game sensitivity
 * @param baseMultiplier - Base sensitivity multiplier (default: 0.1)
 * @returns Simplified sensitivity factor
 */
export function calculateSimpleSensitivity(
  dpi: number,
  valorantSens: number,
  baseMultiplier: number = 0.1
): number {
  // Use eDPI as the base for a consistent feel
  const eDPI = calculateEDPI(dpi, valorantSens);

  // Normalize to a sensible range (pro average eDPI is ~280)
  // This gives roughly 1:1 pixel movement at eDPI 280
  return (eDPI / 280) * baseMultiplier;
}

/**
 * Get recommended sensitivity range for Valorant
 *
 * @param dpi - Mouse DPI setting
 * @returns Object with min and max recommended sensitivity values
 */
export function getRecommendedSensRange(dpi: number): { min: number; max: number } {
  // Target eDPI range: 200-400 (competitive range)
  const minEDPI = 200;
  const maxEDPI = 400;

  return {
    min: Math.round((minEDPI / dpi) * 1000) / 1000,
    max: Math.round((maxEDPI / dpi) * 1000) / 1000,
  };
}

/**
 * Convert sensitivity from another game to Valorant
 *
 * @param sourceSens - Sensitivity in source game
 * @param sourceYaw - Yaw value of source game
 * @returns Equivalent Valorant sensitivity
 */
export function convertToValorant(sourceSens: number, sourceYaw: number): number {
  return (sourceSens * sourceYaw) / VALORANT_YAW;
}

/**
 * Common game yaw values for conversion
 */
export const GAME_YAWS = {
  valorant: 0.07,
  csgo: 0.022,
  cs2: 0.022,
  apex: 0.022,
  overwatch: 0.0066,
  fortnite: 0.5555,
};

/**
 * Format eDPI for display
 *
 * @param dpi - Mouse DPI
 * @param sens - Game sensitivity
 * @returns Formatted eDPI string
 */
export function formatEDPI(dpi: number, sens: number): string {
  const eDPI = calculateEDPI(dpi, sens);
  return eDPI.toFixed(1);
}

/**
 * Format cm/360 for display
 *
 * @param dpi - Mouse DPI
 * @param sens - Game sensitivity
 * @returns Formatted cm/360 string
 */
export function formatCm360(dpi: number, sens: number): string {
  const cm360 = calculateCm360(dpi, sens);
  if (cm360 === Infinity) return '∞';
  return cm360.toFixed(2) + ' cm';
}

/**
 * Classify sensitivity level based on eDPI
 *
 * @param eDPI - Effective DPI value
 * @returns Classification string
 */
export function classifySensitivity(eDPI: number): string {
  if (eDPI < 200) return 'Very Low';
  if (eDPI < 300) return 'Low (Pro Level)';
  if (eDPI < 400) return 'Medium-Low';
  if (eDPI < 600) return 'Medium';
  if (eDPI < 800) return 'Medium-High';
  return 'High';
}
