import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
          <Route path="/approve/:id" element={<ApprovalPage />} />
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
);

export default App;

// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Index from "./pages/Index";
// import NotFound from "./pages/NotFound";
// import TranslateScreen from "./pages/TranslateScreen";
// import Chatbot from "./components/Chatbot";
// import About from "./pages/About";
// import { PDFEditor } from "./components/PDFEditor/PDFEditor";
// import ApprovalPage from "./pages/Approve";
// import ApprovalConfirmation from "./pages/ApprovalConfirmation";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <BrowserRouter>
//       <TooltipProvider>
//         <Toaster />
//         <Sonner />
//         <Routes>
//           <Route path="/" element={<Index />} />
//           <Route path="/translate" element={<TranslateScreen />} />
//           <Route path="/chatbot" element={<Chatbot />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/pdf-editor" element={<PDFEditor />} />
//           <Route path="/approve/:id" element={<ApprovalPage />} />
//           <Route
//             path="/approval-confirmation"
//             element={<ApprovalConfirmation />}
//           />
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </TooltipProvider>
//     </BrowserRouter>
//   </QueryClientProvider>
// );

// export default App;
