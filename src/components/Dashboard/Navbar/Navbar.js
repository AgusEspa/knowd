import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import { BiUserCircle, BiMenu } from "react-icons/bi";

import UserMenu from "./UserMenu";
import styles from "../../../styles/Navbar.module.scss";

const Navbar = () => {
	const { userAuth, logout } = useContext(AuthContext);
	const [responsiveNavDisplay, setResponsiveNavDisplay] = useState(false);

	const handleResponsiveNavToggle = (event) => {
		event.preventDefault();
		setResponsiveNavDisplay((prevState) => !prevState);
	};

	return (
		<nav className={styles.navbarContainer}>
			<div className={styles.navLogoBox}>
				<img
					className={styles.navLogo}
					src={"./logo.png"}
					alt="self.OKRs logo"
				/>
			</div>

			<div className={styles.navLinksContainer}>
				<button
					className={styles.navToggle}
					onClick={handleResponsiveNavToggle}
				>
					<BiMenu />
				</button>
				<div
					className={
						responsiveNavDisplay
							? styles.linksMenuActive
							: styles.linksMenu
					}
				>
					<ul>
						<li>
							<Link to="/dashboard">Dashboard</Link>
						</li>
						<li className={styles.dropdownButton}>
							<div className={styles.buttonIcon}>
								<BiUserCircle />
								{userAuth.displayName}
							</div>
							<UserMenu logout={logout} />
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
