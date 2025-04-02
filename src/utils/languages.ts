export interface Language {
  code: string;
  name: string;
}

export const languages: Language[] = [
  { code: "tel", name: "Telugu" },
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
];

export const getLanguageByCode = (code: string): Language => {
  return languages.find((lang) => lang.code === code) || languages[0];
};
