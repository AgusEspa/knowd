import { useState, createContext } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

	const navigate = useNavigate();

	const [userAuth, setUserAuth] = useState({username: "", emailAddress: "", accessToken: window.localStorage.getItem("access_token"), refreshToken: window.localStorage.getItem("refresh_token")});

	const logout = () => {
		setUserAuth([]);
		window.localStorage.clear();
		navigate("/login");
	}


	return(
		<AuthContext.Provider value={{ userAuth, setUserAuth, logout }} >
			{children}
		</AuthContext.Provider>
	);
}
 