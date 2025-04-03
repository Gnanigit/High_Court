import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TranslateScreen from "./pages/TranslateScreen";
import Chatbot from "./components/Chatbot";
import About from "./pages/About";
import { PDFEditor } from "./components/PDFEditor/PDFEditor";
import ApprovalPage from "./pages/Approve";
import ApprovalConfirmation from "./pages/ApprovalConfirmation";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    {" "}
    {/* Add Redux Provider as the outer wrapper */}
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/translate/single"
              element={<TranslateScreen type="single" />}
            />
            <Route
              path="/translate/multiple"
              element={<TranslateScreen type="multiple" />}
            />
            <Route path="/about" element={<About />} />
            <Route path="/editor" element={<PDFEditor />} />
            <Route path="/approve" element={<ApprovalPage />} />
            <Route
              path="/approval-confirmation"
              element={<ApprovalConfirmation />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      <Chatbot />
    </QueryClientProvider>
  </Provider>
);

export default App;
