import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner";
import { SharedDashboard } from "./pages/SharedDashboard";
import { PrivateRoute } from "./components/PrivateRoute";
import { AuthRoute } from "./components/AuthRoute";
import BrainlyLanding from "./pages/LandingPage";

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-center" richColors />
        <Routes>
          <Route path="/" element={<AuthRoute><BrainlyLanding /></AuthRoute>} />
          <Route path="/signin" element={<AuthRoute><Signin /></AuthRoute>} />
          <Route path="/signup" element={<AuthRoute><Signup /></AuthRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/brain/:hash" element={<SharedDashboard />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App;
