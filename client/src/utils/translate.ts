export interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export const extractTextFromImage = async (image: File): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return "This is sample text that would be extracted from the uploaded image. In a real application, this text would be obtained using an OCR (Optical Character Recognition) service that can recognize and extract text from images.";
};

export const translateText = async (
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<TranslationResult> => {
  console.log(`Translating from ${sourceLanguage} to ${targetLanguage}`);

  await new Promise((resolve) => setTimeout(resolve, 1500));

  let translatedText = "";

  switch (targetLanguage) {
    case "es":
      translatedText =
        "Este es un texto de ejemplo que se extraería de la imagen cargada. En una aplicación real, este texto se obtendría mediante un servicio de OCR (Reconocimiento Óptico de Caracteres) que puede reconocer y extraer texto de imágenes.";
      break;
    case "fr":
      translatedText =
        "Ceci est un exemple de texte qui serait extrait de l'image téléchargée. Dans une application réelle, ce texte serait obtenu à l'aide d'un service OCR (Reconnaissance Optique de Caractères) capable de reconnaître et d'extraire du texte à partir d'images.";
      break;
    case "de":
      translatedText =
        "Dies ist ein Beispieltext, der aus dem hochgeladenen Bild extrahiert würde. In einer echten Anwendung würde dieser Text mit einem OCR-Dienst (Optical Character Recognition) erstellt, der Text in Bildern erkennen und extrahieren kann.";
      break;
    default:
      translatedText = `Translated version of: ${text}`;
  }

  return {
    originalText: text,
    translatedText,
    sourceLanguage,
    targetLanguage,
  };
};
