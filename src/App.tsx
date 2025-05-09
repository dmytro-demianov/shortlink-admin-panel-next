
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AppLayout } from "./components/layout/AppLayout";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { Dashboard } from "./pages/Dashboard";
import { LinksPage } from "./pages/links/LinksPage";
import { CreateLinkPage } from "./pages/links/CreateLinkPage";
import { FoldersPage } from "./pages/folders/FoldersPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/links" element={<AppLayout><LinksPage /></AppLayout>} />
            <Route path="/links/create" element={<AppLayout><CreateLinkPage /></AppLayout>} />
            <Route path="/folders" element={<AppLayout><FoldersPage /></AppLayout>} />
            
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
