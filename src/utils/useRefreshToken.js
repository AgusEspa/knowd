import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useRefreshToken = () => {
	const { userAuth, setUserAuth } = useContext(AuthContext);

	const refreshURL =
		process.env.REACT_APP_API_URL + "/api/users/token/refresh";

	const config = {
		headers: {
			Authorization: `Bearer ${userAuth.refreshToken}`,
		},
	};

	const refresh = async () => {
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
