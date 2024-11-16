import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/Header";
import { LoginPage } from "@/pages/auth/LoginPage";
import { SignupPage } from "@/pages/auth/SignupPage";
import { CarsPage } from "@/pages/cars/CarsPage";
import { NewCarPage } from "@/pages/cars/NewCarPage";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Set a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 2000);

      if (user !== null) {
        clearTimeout(timeoutId);
        setIsLoading(false);
      }

      return () => clearTimeout(timeoutId);
    };

    checkAuth();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
}
function App() {
  const { initUser } = useAuth();

  useEffect(() => {
    initUser();
  }, []);
  return (
    <Router>
      <div className="relative flex min-h-screen flex-col px-20">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <CarsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/cars/new"
              element={
                <PrivateRoute>
                  <NewCarPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
