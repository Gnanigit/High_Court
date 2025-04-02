import { useEffect } from "react";

declare global {
  interface Window {
    botId: string;
    productName: string;
    baseUrl: string;
    isOpenChat: boolean;
  }
}

const Chatbot: React.FC = () => {
  useEffect(() => {
    window.botId = "67e7a035b65544f3986bec1e";
    window.productName = "Wisemelon";
    window.baseUrl = "https://api.wisemelon.ai";
    window.isOpenChat = false;

    import("https://widget.wisemelon.ai/plugin.js")
      .then((module) => {
        if (module && typeof module.default === "function") {
          module.default();
        }
      })
      .catch((error) => {
        console.error("Error loading chatbot script:", error);
      });
  }, []);

  return null; // No UI needed, just loading the chatbot script
};

export default Chatbot;
