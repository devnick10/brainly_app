import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { lazy } from 'react';

const BrainlyLanding = lazy(() => import('./pages/LandingPage'));
const SharedDashboard = lazy(() => import('./pages/SharedDashboard'));
const Signup = lazy(() => import('./pages/Signup'));
const Signin = lazy(() => import('./pages/Signin'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AuthRoute = lazy(() => import('./components/AuthRoute'));
const PrivateRoute = lazy(() => import('./components/PrivateRoute'));
const NotFound = lazy(() => import('./pages/NotFound.tsx'));

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-center" richColors />
        <Routes>
          <Route
            path="/"
            element={
              <AuthRoute>
                <BrainlyLanding />
              </AuthRoute>
            }
          />
          <Route
            path="/signin"
            element={
              <AuthRoute>
                <Signin />
              </AuthRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthRoute>
                <Signup />
              </AuthRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/brain/:hash" element={<SharedDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
