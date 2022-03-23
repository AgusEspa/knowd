import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children }) {

    const { userAuth } = useContext(AuthContext);

    const isAuthenticated = userAuth.refreshToken;
    
    return isAuthenticated ? children : <Navigate to="/login" />;
}    

export default ProtectedRoute;