import { useState, useEffect } from "react";
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
	const [online, isOnline] = useState(navigator.onLine);

	useEffect(() => {
		window.addEventListener("offline", setOffline);
		window.addEventListener("online", setOnline);

		return () => {
			window.removeEventListener("offline", setOffline);
			window.removeEventListener("online", setOnline);
		};
	}, []);

	const setOnline = () => {
		isOnline(true);
	};
	const setOffline = () => {
		isOnline(false);
	};

	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					<Route
						path="/"
						element={
							<PublicRoute>
								<Home />
							</PublicRoute>
						}
					/>
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute>
								<Dashboard online={online} />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/settings"
						element={
							<ProtectedRoute>
								<Settings online={online} />
							</ProtectedRoute>
						}
					/>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route
						path="/forgot_password"
						element={<ForgotPassword />}
					/>
					<Route path="/reset_password" element={<ResetPassword />} />
					<Route path="*" element={<PageNotFound />} />
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
