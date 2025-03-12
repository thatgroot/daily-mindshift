
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Calendar from "./pages/Calendar";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NewHabit from "./pages/NewHabit";
import NotFound from "./pages/NotFound";
import Docs from "./pages/Docs";
import Auth from "./pages/Auth";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import OnboardingTutorial from "./components/OnboardingTutorial";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <div className="bg-gradient-to-br from-background via-background to-muted/30 min-h-screen">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ErrorBoundary>
              <OnboardingTutorial />
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={<PrivateRoute><Index /></PrivateRoute>} />
                <Route path="/calendar" element={<PrivateRoute><Calendar /></PrivateRoute>} />
                <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
                <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
                <Route path="/new-habit" element={<PrivateRoute><NewHabit /></PrivateRoute>} />
                <Route path="/docs" element={<PrivateRoute><Docs /></PrivateRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </BrowserRouter>
        </div>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
