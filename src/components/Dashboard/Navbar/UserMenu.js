import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import styles from "../../../styles/Navbar.module.scss";
import useAxios from "../../../utils/useAxios";

const UserMenu = () => {
    const { userAuth, logout } = useContext(AuthContext);
    const api = useAxios();

    const handleSecureLogOut = async () => {
        // loading spinner
        try {
            const body = { tokenString: `${userAuth.refreshToken}` };
            await api.post("/users/token/revoke", body);
            // loading spiner false
            logout();
        } catch (error) {}
    };

    return (
        <div className={styles.dropdownMenuContainer}>
            <div className={styles.dropdownMenuBox}>
                <ul>
                    <li>
                        <Link to="/settings">Settings</Link>
                    </li>
                    <li>
                        <button onClick={handleSecureLogOut}>Logout</button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default UserMenu;
