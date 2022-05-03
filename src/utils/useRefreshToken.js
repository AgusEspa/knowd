import axios from "axios";
import jwt_decode from "jwt-decode";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useRefreshToken = () => {
	const { userAuth, setUserAuth, logout, baseApiUrl } =
		useContext(AuthContext);

	const refreshURL = baseApiUrl + "/api/users/token/refresh";

	const config = {
		headers: {
			Authorization: `Bearer ${userAuth.refreshToken}`,
		},
	};

	const refresh = async () => {
		const decodedToken = jwt_decode(userAuth.refreshToken);
		const tokenExpirationDate = decodedToken.exp;
		const currentTime = new Date().getTime() / 1000;
		const isValid = tokenExpirationDate - 20 > currentTime;
		if (!isValid) logout();

		try {
			const response = await axios.get(refreshURL, config);

			window.localStorage.setItem(
				"access_token",
				response.data.access_token
			);

			setUserAuth((prevState) => ({
				username: prevState.username,
				accessToken: response.data.access_token,
				refreshToken: prevState.refreshToken,
			}));

			return response.data.access_token;
		} catch (error) {
			throw error;
		}
	};

	return refresh;
};

export default useRefreshToken;
