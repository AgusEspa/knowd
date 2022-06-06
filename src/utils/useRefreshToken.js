import axios from "axios";
import jwt_decode from "jwt-decode";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import useTokenValidation from "./useTokenValidation";

const useRefreshToken = () => {
    const { userAuth, setUserAuth, logout, baseApiUrl } =
        useContext(AuthContext);
    const [verifyTokenExpiration] = useTokenValidation();

    const refreshURL = baseApiUrl + "/api/users/token/refresh";

    const config = {
        headers: {
            Authorization: `Bearer ${userAuth.refreshToken}`,
        },
    };

    const refresh = async () => {
        const decodedToken = jwt_decode(userAuth.refreshToken);
        if (!verifyTokenExpiration(decodedToken)) logout();

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
