function useTokenValidation() {
    function validateToken(decodedToken) {
        const tokenExpirationDate = decodedToken.exp;
        const currentTime = new Date().getTime() / 1000;
        const isValid = tokenExpirationDate - 20 > currentTime;
        return isValid;
    }
    return [validateToken];
}
export default useTokenValidation;
