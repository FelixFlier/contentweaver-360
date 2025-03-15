// src/lib/test-config.ts
/**
 * Helper module to control test mode during runtime
 */

let TEST_MODE = import.meta.env.VITE_TEST_MODE === 'true';

/**
 * Check if test mode is enabled
 */
export function isTestMode(): boolean {
  return TEST_MODE;
}

/**
 * Enable test mode
 */
export function enableTestMode(): void {
  TEST_MODE = true;
  localStorage.setItem('test_mode', 'true');
}

/**
 * Disable test mode
 */
export function disableTestMode(): void {
  TEST_MODE = false;
  localStorage.setItem('test_mode', 'false');
}

/**
 * Initialize test mode from localStorage if available
 */
export function initTestMode(): void {
  const storedMode = localStorage.getItem('test_mode');
  if (storedMode === 'true') {
    TEST_MODE = true;
  } else if (storedMode === 'false') {
    TEST_MODE = false;
  }
  // If not found, use the env variable (already initialized)
}

// Initialize on import
if (typeof window !== 'undefined') {
  initTestMode();
}
