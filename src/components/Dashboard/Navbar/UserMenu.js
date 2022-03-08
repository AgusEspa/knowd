import { Link } from "react-router-dom";
import styles from "../../../styles/Navbar.module.scss"

const UserMenu = (props) => {

	return(
		<div className={styles.dropdownMenuContainer}>
			<div className={styles.dropdownMenuBox}>
				<ul>
					<li>
						<Link to="/settings"><span>Settings</span></Link>
					</li>
					<li>
						<button onClick={props.logout}><span>Logout</span></button>
					</li>
				</ul>
			</div>
		</div>

	);

}

export default UserMenu;