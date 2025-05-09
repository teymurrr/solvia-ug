
// Default list of languages
export const DEFAULT_LANGUAGES = [
  "English", "Spanish", "French", "German", "Italian", 
  "Portuguese", "Dutch", "Russian", "Chinese", "Japanese", 
  "Arabic", "Hindi", "Bengali", "Polish", "Ukrainian", 
  "Romanian", "Greek", "Swedish", "Norwegian", "Finnish",
  "Danish", "Czech", "Hungarian", "Turkish", "Korean", 
  "Thai", "Vietnamese", "Malay", "Indonesian", "Tagalog"
];

// Function to safely get languages
export const getSafeLanguages = () => {
  try {
    return DEFAULT_LANGUAGES;
  } catch (error) {
    console.error("Error retrieving languages:", error);
    return DEFAULT_LANGUAGES.slice(0, 10); // Return at least some languages
  }
};

// Export the available languages for use in components
export const availableLanguages = DEFAULT_LANGUAGES;
