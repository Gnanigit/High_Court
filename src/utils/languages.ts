export interface Language {
  code: string;
  name: string;
}

export const languages: Language[] = [
  { code: "tel", name: "Telugu" },
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
];

export const getLanguageByCode = (code: string): Language => {
  return languages.find((lang) => lang.code === code) || languages[0];
};
