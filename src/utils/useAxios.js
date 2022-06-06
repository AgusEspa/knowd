import axios from "axios";
import jwt_decode from "jwt-decode";
import { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import useRefreshToken from "./useRefreshToken";
import useTokenValidation from "./useTokenValidation";

const useAxios = () => {
    const { userAuth, baseApiUrl } = useContext(AuthContext);
    const refresh = useRefreshToken();
    const [verifyTokenExpiration] = useTokenValidation();

    const baseURL = baseApiUrl + "/api";

    const axiosInstance = axios.create({
        baseURL: baseURL,
        headers: { Authorization: `Bearer ${userAuth.accessToken}` },
    });

    useEffect(() => {
        const requestIntercept = axiosInstance.interceptors.request.use(
            async (request) => {
                const decodedToken = jwt_decode(userAuth.accessToken);

                if (verifyTokenExpiration(decodedToken)) return request;

                const refreshedToken = await refresh();

                request.headers.Authorization = `Bearer ${refreshedToken}`;
                return request;
            },
            (error) => Promise.reject(error)
        );

        const responseIntercept = axiosInstance.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                if (error.status === 403) {
                    const refreshedToken = await refresh();

                    const originalRequest = error.config;

                    originalRequest.headers.Authorization = `Bearer ${refreshedToken}`;

                    return axiosInstance(originalRequest);
                }

                return Promise.reject(error);
            }
        );

        return () => {
            axiosInstance.interceptors.request.eject(requestIntercept);
            axiosInstance.interceptors.response.eject(responseIntercept);
        };
    }, [userAuth, refresh, axiosInstance, verifyTokenExpiration]);

    return axiosInstance;
};

export default useAxios;
