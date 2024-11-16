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
    // Wait for user state to be determined
    if (user !== null) {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return <div>Loading...</div>; // Or your loading component
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
