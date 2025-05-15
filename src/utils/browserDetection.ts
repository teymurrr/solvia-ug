/**
 * Utility functions to detect browser types
 */

/**
 * Detects if the current browser is Safari
 * @returns boolean indicating if the browser is Safari
 */
export const isSafari = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase();
  // More precise Safari detection - checks for Safari but not Chrome
  // (Chrome includes Safari in its user agent string)
  const isSafariAgent = userAgent.includes('safari') && !userAgent.includes('chrome');
  
  // Add more detailed logging for debugging
  console.log('[browserDetection] User Agent:', userAgent);
  console.log('[browserDetection] Is Safari detected:', isSafariAgent);
  
  // Fallback detection using vendor if needed
  const isAppleWebKit = navigator.vendor && 
                        navigator.vendor.indexOf('Apple') > -1 &&
                        userAgent.indexOf('CriOS') === -1 && 
                        userAgent.indexOf('FxiOS') === -1;
                        
  console.log('[browserDetection] Is Apple WebKit:', isAppleWebKit);
  
  // Strict Safari detection - use both methods combined for more accuracy
  const result = isSafariAgent || isAppleWebKit;
  console.log('[browserDetection] Final Safari detection result:', result);
  
  return result;
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
    if (value !== undefined && value !== null) {
      // Handle arrays and objects by JSON stringifying them
      if (typeof value === 'object') {
        params.append(key, JSON.stringify(value));
      } else {
        // Only add primitive values to query params
        params.append(key, String(value));
      }
    }
  });
  
  const queryString = params.toString();
  console.log('Generated query string:', queryString ? `?${queryString}` : '');
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
    // Try to parse JSON objects/arrays
    if (value.startsWith('[') || value.startsWith('{')) {
      try {
        state[key] = JSON.parse(value);
        return;
      } catch (e) {
        // If parsing fails, continue with regular type conversion
      }
    }
    
    // Try to convert to boolean
    if (value === 'true') {
      state[key] = true;
    } else if (value === 'false') {
      state[key] = false;
    } 
    // Try to convert to number
    else if (!isNaN(Number(value)) && value !== '') {
      state[key] = Number(value);
    } 
    // Keep as string
    else {
      state[key] = value;
    }
  });
  
  console.log('Extracted state from query params:', state);
  return state;
};

/**
 * Creates a clean state object for dashboard navigation
 * @param fromDashboard Whether navigation originated from dashboard
 * @param additionalParams Any additional parameters to include
 * @returns A state object ready for navigation
 */
export const createDashboardReturnState = (fromDashboard: boolean, additionalParams: Record<string, any> = {}): Record<string, any> => {
  // Always ensure we have the activeTab parameter for dashboard navigation
  const baseState = { 
    activeTab: additionalParams.activeTab || 'vacancies',
    fromDashboard: fromDashboard === true // Ensure this is a boolean
  };
  
  // Add any additional parameters
  const state = {...baseState, ...additionalParams};
  
  console.log('[browserDetection] Created dashboard return state:', state);
  return state;
};

/**
 * Direct Apply to Vacancy - Skip intermediary pages for Safari
 * @param id Vacancy ID
 * @param applicationLink External application link if any
 * @param state Navigation state object
 * @returns Boolean indicating if direct navigation was performed
 */
export const handleDirectApply = (
  id: string,
  applicationLink: string | undefined,
  state: Record<string, any>,
  navigate: Function
): boolean => {
  // Only execute direct navigation for Safari
  if (!isSafari()) {
    console.log('[browserDetection] Not Safari, skipping direct navigation');
    return false;
  }
  
  console.log('[browserDetection] Direct Apply triggered for Safari with state:', state);
  console.log('[browserDetection] Application link exists:', !!applicationLink);
  
  // For external application links
  if (applicationLink) {
    console.log('[browserDetection] Opening external link in new tab:', applicationLink);
    // Open external link in new tab
    window.open(applicationLink, '_blank');
    
    // Create dashboard return state with notice about external application
    const dashboardState = createDashboardReturnState(true, {
      activeTab: 'vacancies',
      externalApplication: true
    });
    
    // Navigate directly to dashboard
    const queryString = stateToQueryParams(dashboardState);
    console.log('[browserDetection] Redirecting to dashboard after external link with query params:', queryString);
    navigate(`/dashboard/professional${queryString}`);
    return true;
  }
  
  // For internal application - navigate directly to apply page
  if (id) {
    // Ensure fromDashboard is properly set in state
    const updatedState = {
      ...state,
      fromDashboard: true,
      directToDashboard: true
    };
    
    // Navigate to apply page with query params
    const queryString = stateToQueryParams(updatedState);
    console.log('[browserDetection] Direct navigation to vacancy apply with query params:', queryString);
    navigate(`/vacancies/${id}/apply${queryString}`);
    return true;
  }
  
  return false;
};
