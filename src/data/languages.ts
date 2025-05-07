
// List of available languages for selection
export const availableLanguages = [
  "English",
  "French", 
  "German",
  "Spanish",
  "Italian",
  "Portuguese",
  "Dutch",
  "Russian",
  "Chinese",
  "Japanese",
  "Arabic",
  "Korean",
  "Hindi",
  "Bengali",
  "Turkish",
  "Thai",
  "Vietnamese",
  "Swedish",
  "Norwegian",
  "Finnish",
  "Danish",
  "Polish",
  "Greek",
  "Hungarian",
  "Czech",
  "Romanian",
  "Bulgarian",
  "Ukrainian",
  "Croatian",
  "Serbian",
  "Lithuanian",
  "Latvian",
  "Estonian",
  "Hebrew",
  "Urdu",
  "Persian",
  "Malay",
  "Indonesian",
  "Filipino",
  "Swahili"
];

// Provide a default languages list as fallback
export const DEFAULT_LANGUAGES = ["English", "French", "German", "Spanish", "Italian"];

// Helper function to ensure we always get a valid language array
export const getSafeLanguages = (): string[] => {
  try {
    if (Array.isArray(availableLanguages) && availableLanguages.length > 0) {
      return [...availableLanguages]; // Return a copy to prevent accidental mutation
    }
    console.warn("Using DEFAULT_LANGUAGES as fallback because availableLanguages is invalid");
    return [...DEFAULT_LANGUAGES];
  } catch (error) {
    console.error("Error in getSafeLanguages:", error);
    return ["English", "French", "German", "Spanish", "Italian"]; // Hardcoded fallback
  }
};
