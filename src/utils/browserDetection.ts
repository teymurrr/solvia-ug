/**
 * Utility functions to detect browser types
 */

/**
 * Detects if the current browser is Safari
 * @returns boolean indicating if the browser is Safari
 */
export const isSafari = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes('safari') && !userAgent.includes('chrome');
};

/**
 * Converts a state object to URL query parameters
 * @param state The state object to convert
 * @returns A query string starting with '?'
 */
export const stateToQueryParams = (state: Record<string, any>): string => {
  if (!state) return '';
  
  const params = new URLSearchParams();
  Object.entries(state).forEach(([key, value]) => {
    // Only add primitive values to query params
    if (typeof value !== 'object') {
      params.append(key, String(value));
    }
  });
  
  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
};

/**
 * Extracts state from URL query parameters
 * @returns An object with the state values
 */
export const queryParamsToState = (): Record<string, any> => {
  const params = new URLSearchParams(window.location.search);
  const state: Record<string, any> = {};
  
  // Convert all params to their respective types
  params.forEach((value, key) => {
    // Try to convert to boolean
    if (value === 'true') {
      state[key] = true;
    } else if (value === 'false') {
      state[key] = false;
    } 
    // Try to convert to number
    else if (!isNaN(Number(value))) {
      state[key] = Number(value);
    } 
    // Keep as string
    else {
      state[key] = value;
    }
  });
  
  return state;
};
