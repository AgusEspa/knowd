import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import PageNotFound from "./pages/PageNotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/"
                        element={
                            <PublicRoute><Home /></PublicRoute>}
                    />
                    <Route path="/dashboard"
                        element={
                            <ProtectedRoute><Dashboard /></ProtectedRoute>}
                    />
                    <Route path="/settings"
                        element={
                            <ProtectedRoute><Settings /></ProtectedRoute>}
                    />
                    <Route path="/login" 
                        element={<Login />} 
                    />
                    <Route path="/register" 
                        element={
                            <Register />}                                
                    />
                    <Route path="/forgot_password" 
                        element={
                            <ForgotPassword />}                                
                    />
                    <Route path="/reset_password" 
                        element={
                            <ResetPassword />}                                
                    />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;