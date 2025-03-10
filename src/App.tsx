// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import ApiErrorBoundary from "@/components/ApiErrorBoundary";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: import.meta.env.VITE_TEST_MODE === 'true' ? false : 3,
      refetchOnWindowFocus: import.meta.env.VITE_TEST_MODE !== 'true',
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="content-weaver-theme">
      <TooltipProvider>
        <ApiErrorBoundary>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
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
            </AuthProvider>
          </BrowserRouter>
        </ApiErrorBoundary>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
