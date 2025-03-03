
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CreateBlog from "./pages/CreateBlog";
import EditBlog from "./pages/EditBlog";
import StyleAnalysis from "./pages/StyleAnalysis";
import ContentList from "./pages/ContentList";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/create/blog" element={<CreateBlog />} />
          <Route path="/create/linkedin" element={<CreateBlog />} />
          <Route path="/edit/blog/:id" element={<EditBlog />} />
          <Route path="/edit/linkedin/:id" element={<EditBlog />} />
          <Route path="/analysis" element={<StyleAnalysis />} />
          <Route path="/content" element={<ContentList />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
