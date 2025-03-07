
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/theme-provider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CreateBlog from "./pages/CreateBlog";
import EditBlog from "./pages/EditBlog";
import StyleAnalysis from "./pages/StyleAnalysis";
import ContentList from "./pages/ContentList";
import AllContentsPage from "./pages/AllContentsPage";
import ResearchAgent from "./pages/ResearchAgent";
import SeoOptimizer from "./pages/SeoOptimizer";
import SourceManagement from "./pages/SourceManagement";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="content-weaver-theme">
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
            <Route path="/all-contents" element={<AllContentsPage />} />
            <Route path="/research" element={<ResearchAgent />} />
            <Route path="/seo" element={<SeoOptimizer />} />
            <Route path="/resources/sources" element={<SourceManagement />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
