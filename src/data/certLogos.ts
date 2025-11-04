/**
 * Certification Issuer Logo Mappings
 * 
 * Maps issuer names (with "(Logo)" suffix) to their logo image paths.
 * Logo images should be placed in /public/assets/certs/
 * 
 * Supported formats: .png, .jpg, .svg
 */

export const certLogos: Record<string, string> = {
  "DeepLearning.AI (Logo)": "/assets/certs/deeplearningai.png",
  "Udemy (Logo)": "/assets/certs/udemy.png",
  "Coursera (Logo)": "/assets/certs/coursera.png",
  "GUVI (Logo)": "/assets/certs/guvi.png",
  "Google Cloud / Qwiklabs (Logo)": "/assets/certs/googlecloud.png"
};

/**
 * Fallback emoji icons for certifications (used when logo images are not available)
 */
export const certEmojis: Record<string, string> = {
  "DeepLearning.AI (Logo)": "🤖",
  "Udemy (Logo)": "🎓",
  "Coursera (Logo)": "📘",
  "GUVI (Logo)": "💻",
  "Google Cloud / Qwiklabs (Logo)": "☁️"
};

/**
 * Utility function to get clean issuer name (removes "(Logo)" suffix)
 */
export const getCleanIssuerName = (issuer: string): string => {
  return issuer.replace(/\s*\(Logo\)\s*$/, "");
};

